import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ethers } from "ethers";
import { z } from "zod";
import jwt from "jsonwebtoken";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Environment variables from your SAM template.yaml
const tableName = process.env.OctoTokensUserTable;
const jwtSecret = process.env.JWT_SECRET;

// node rpc provider
const RPCURL = process.env.RPCURL;
const provider = new ethers.JsonRpcProvider(RPCURL);

// Zod schema to validate the structure of the decoded JWT payload
const tokenPayloadSchema = z.object({
    email: z.email("Invalid email format in token"),
});

interface StockDetails {
    name: string;
    address: string;
    price: number;
    priceAt: number;
}

// The final structure you want to return
interface WatchListProps {
    lists: StockDetails[][];
}

// The expected input structure (price is not yet present)
interface WatchListInput {
    lists: {
        address: string;
    }[][];
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // 1. Check for required environment variables to fail fast
        if (!tableName || !jwtSecret) throw new Error("Server configuration error");

        // 2. Extract and validate the JWT from the Authorization header
        const authHeader = event.headers.authorization || event.headers.Authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 401, // Unauthorized
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Authorization header is missing or malformed." }),
            };
        }
        const token = authHeader.split(" ")[1];

        // 3. Verify the JWT and parse the payload
        const decodedPayload = jwt.verify(token, jwtSecret);
        const { email } = tokenPayloadSchema.parse(decodedPayload);

        // 4. Fetch the user's watchlist from DynamoDB
        const command = new GetCommand({
            TableName: tableName,
            Key: {
                email,
            },
            // Optimization: Only retrieve the 'watchlist' attribute, not the entire user object
            ProjectionExpression: "watchlist",
        });

        const { Item } = await ddbDocClient.send(command);

        // 5. Handle case where user is not found
        if (!Item) {
            return {
                statusCode: 404, // Not Found
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "User not found." }),
            };
        }

        const lists = (Item.watchlist ?? []) as WatchListInput["lists"];
        const allAddresses = lists.flat().map((item) => item.address);
        const uniqueSymbols = [...new Set(allAddresses)];

        if (uniqueSymbols.length === 0)
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    watchlist: [],
                }),
            };

        const stockMap = new Map<string, StockDetails>();
        const abi = [
            "function latestRoundData() view returns (uint80,int256,uint256,uint256,uint80)",
            "function description() view returns (string)",
        ];

        for (const address of uniqueSymbols) {
            try {
                const feed = new ethers.Contract(address, abi, provider);
    
                const lr = await feed.latestRoundData();
                const name = await feed.description() as string; // it returns like only this string "ETH / USD".
    
                const price = Number(lr[1]) / 1e8;
                const ts = Number(lr[3]) || Date.now();
    
                stockMap.set(address, { name, price, priceAt: ts, address });
            } catch (error) {
                // ignore
            }
        }

        const updatedLists: WatchListProps["lists"] = lists.map(
            (list) =>
                list.map((item) => ({
                    address: item.address,
                    name: stockMap.get(item.address)?.name,
                    price: stockMap.get(item.address)?.price,
                    priceAt: stockMap.get(item.address)?.priceAt,
                })) as StockDetails[],
        );

        // 6. Return the watchlist successfully
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                watchlist: updatedLists,
            }),
        };
    } catch (err: any) {
        // Handle specific errors for better client feedback
        if (err instanceof jwt.JsonWebTokenError) {
            return {
                statusCode: 401, // Unauthorized
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: `Invalid token: ${err.message}` }),
            };
        }

        if (err instanceof z.ZodError) {
            return {
                statusCode: 400, // Bad Request
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Token payload is invalid.", errors: err.message }),
            };
        }

        // Generic error handler for other issues (e.g., DynamoDB connection)
        console.error(err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "An unexpected error occurred." }),
        };
    }
};
