import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.OctoTokensUserTable;
const jwtSecret = process.env.JWT_SECRET;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.httpMethod !== "GET") throw new Error(`Only GET is allowed, you tried: ${event.httpMethod}`);

        const token = event.queryStringParameters?.token;
        if (!token) throw new Error("Missing token");

        // verify token
        let decoded: any;
        try {
            decoded = jwt.verify(token, jwtSecret!);
        } catch (err) {
            throw new Error("Invalid or expired token");
        }

        const { email, fullName, password } = decoded as {
            email: string;
            fullName: string;
            password: string;
        };

        // check if user exists
        const existingUser = await ddbDocClient.send(
            new GetCommand({
                TableName: tableName!,
                Key: { email },
            }),
        );

        if (existingUser.Item) throw new Error("User already exists");

        // create user
        await ddbDocClient.send(
            new PutCommand({
                TableName: tableName!,
                Item: {
                    email,
                    fullName,
                    password, // this is hashed password
                    createdAt: new Date().toISOString(),
                    watchlist: [
                        [
                            { name: "ethusd", address: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419" },
                            { name: "btcusd", address: "0xf4030086522a5beea4988f8ca5b36dbc97bee88c" },
                        ],
                        [],
                        [],
                        [],
                    ], // creating watchlist with two initial stocks
                },
            }),
        );

        // issue access token (30 days)
        const accessToken = jwt.sign({ email, fullName }, jwtSecret!, { expiresIn: "30d" });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: "user logged in", accessToken }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ error: (err as Error).message }),
        };
    }
};
