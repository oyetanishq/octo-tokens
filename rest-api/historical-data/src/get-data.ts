import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import axios from "axios";
import jwt from "jsonwebtoken";

// Environment variables from your SAM template.yaml
const jwtSecret = process.env.JWT_SECRET;

// node rpc provider
const ALCAPIKEY = process.env.ALCAPIKEY;

const bodySchema = z.object({
    symbol: z.string().min(1),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    interval: z.enum(["1h", "1d"]), // adjust based on API support
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // 1. Check for required environment variables to fail fast
        if (!jwtSecret) throw new Error("Server configuration error");

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
        jwt.verify(token, jwtSecret);

        if (!event.body) throw new Error("Missing request body");
        const parsedBody = bodySchema.parse(JSON.parse(event.body));
        const { symbol, startTime, endTime, interval } = parsedBody;

        const response = await axios.post(`https://api.g.alchemy.com/prices/v1/${ALCAPIKEY}/tokens/historical`, {
            symbol,
            startTime,
            endTime,
            interval,
        });

        const formattedData = response.data.data.map((item: any) => ({
            timestamp: new Date(item.timestamp).toISOString(),
            value: item.value,
        }));

        // 6. Return the watchlist successfully
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                historicalData: formattedData,
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
