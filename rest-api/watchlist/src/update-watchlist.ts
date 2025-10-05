import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ethers } from "ethers";
import { z } from "zod";
import jwt from "jsonwebtoken";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Environment variables from your SAM template.yaml
const tableName = process.env.DeepDreamerUserTable;
const jwtSecret = process.env.JWT_SECRET;

// node rpc provider
const RPCURL = process.env.RPCURL;
const provider = new ethers.JsonRpcProvider(RPCURL);

// Zod schema for the JWT payload (same as before)
const tokenPayloadSchema = z.object({
    email: z.email("Invalid email format in token"),
});

// Zod schema to validate the incoming request body
const updateBodySchema = z.object({
    watchlist: z
        .array(
            z.array(
                z.object({
                    address: z.string().min(1), // Ensure address is not an empty string
                }),
            ),
        )
        .min(1), // Ensure the watchlist itself is not an empty array
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!tableName || !jwtSecret) {
        console.error("Missing required environment variables: DeepDreamerUserTable or JWT_SECRET");
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Server configuration error." }),
        };
    }

    try {
        // 1. Authenticate the user (same logic as the fetch function)
        const authHeader = event.headers.authorization || event.headers.Authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                statusCode: 401, // Unauthorized
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Authorization header is missing or malformed." }),
            };
        }
        const token = authHeader.split(" ")[1];
        const decodedPayload = jwt.verify(token, jwtSecret);
        const { email } = tokenPayloadSchema.parse(decodedPayload);

        // 2. Validate the request body
        if (!event.body) {
            return {
                statusCode: 400, // Bad Request
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Request body is missing." }),
            };
        }
        const parsedBody = JSON.parse(event.body);
        const { watchlist } = updateBodySchema.parse(parsedBody);

        // 3. Update the item in DynamoDB
        const command = new UpdateCommand({
            TableName: tableName,
            Key: {
                email, // The primary key of the item to update
            },
            // Defines the update operation
            UpdateExpression: "SET #watchlist = :watchlist",
            // Prevents the update if the user does not exist
            ConditionExpression: "attribute_exists(email)",
            // Maps the placeholder '#watchlist' to the actual attribute name
            ExpressionAttributeNames: {
                "#watchlist": "watchlist",
            },
            // Maps the placeholder ':watchlist' to the actual value
            ExpressionAttributeValues: {
                ":watchlist": watchlist,
            },
        });

        await ddbDocClient.send(command);

        // 4. Return a success response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Watchlist updated successfully.",
            }),
        };
    } catch (err: any) {
        // Handle specific, expected errors first
        if (err.name === "ConditionalCheckFailedException") {
            return {
                statusCode: 404, // Not Found
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "User not found." }),
            };
        }
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
                body: JSON.stringify({ message: "Invalid request body.", errors: err.message }),
            };
        }

        // Generic error handler
        console.error(err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "An unexpected error occurred." }),
        };
    }
};
