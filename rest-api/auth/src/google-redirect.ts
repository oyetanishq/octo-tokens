import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const googleClient = new OAuth2Client(
    process.env.GoogleClientId,
    process.env.GoogleClientSecret,
    process.env.GoogleRedirectUrl
);

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const state = crypto.randomUUID();

        // Build Google OAuth URL
        const url = googleClient.generateAuthUrl({
            access_type: "offline",
            scope: ["profile", "email"],
            state,
        });

        // Return redirect response
        return {
            statusCode: 302,
            headers: {
                Location: url,
                "Set-Cookie": `oauth_state=${state}; Max-Age=240; HttpOnly; Path=/; Secure`,
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
