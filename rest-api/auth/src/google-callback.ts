import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { OAuth2Client } from "google-auth-library";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.OctoTokensUserTable;
const jwtSecret = process.env.JWT_SECRET;
const stage = process.env.STAGE;

const googleClient = new OAuth2Client(
    process.env.GoogleClientId,
    process.env.GoogleClientSecret,
    process.env.GoogleRedirectUrl,
);

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const code = event.queryStringParameters?.code;
        if (!code) return { statusCode: 400, body: JSON.stringify({ error: "Missing code" }) };

        // Exchange authorization code for tokens
        const { tokens } = await googleClient.getToken(code);
        googleClient.setCredentials(tokens);

        // Get user info directly
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token!,
            audience: process.env.GoogleClientId,
        });
        const payload = ticket.getPayload();

        if (!payload) throw new Error("something went wrong");

        const { email, name } = payload;

        const existingUser = await ddbDocClient.send(
            new GetCommand({
                TableName: tableName!,
                Key: { email },
            }),
        );

        if (!existingUser.Item) {
            // if user is not there, then create it
            await ddbDocClient.send(
                new PutCommand({
                    TableName: tableName!,
                    Item: {
                        email,
                        fullName: name,
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
        }

        // issue access token (30 days)
        const accessToken = jwt.sign({ email, fullName: name }, jwtSecret!, { expiresIn: "30d" });
        const Location = `${stage === "prod" ? "https://octotokens.tanishqsingh.com" : "http://localhost:5173"}/google-verification/${accessToken}`;

        return {
            statusCode: 302,
            headers: {
                Location,
                "Access-Control-Allow-Origin": "*",
            },
            body: "",
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
