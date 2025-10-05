import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.OctoTokensUserTable;
const jwtSecret = process.env.JWT_SECRET;
const stage = process.env.STAGE;

// email variables
const MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC;
const MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE;

const EMAIL_API = process.env.EMAIL_API;
const EMAIL_SENDER_EMAIL = process.env.EMAIL_SENDER_EMAIL;
const EMAIL_SENDER_NAME = process.env.EMAIL_SENDER_NAME;

const userSchema = z.discriminatedUnion("service", [
    z.object({
        service: z.literal("register"),
        email: z.email(),
        fullName: z.string().min(1, "Full name required"),
        password: z.string().min(6, "Password too short"),
    }),
    z.object({
        service: z.literal("login"),
        email: z.email(),
        password: z.string().min(6, "Password too short"),
    }),
]);

const AccountEmailTemplate = (
    verification_link: string,
    username: string,
    service: z.infer<typeof userSchema>["service"],
) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>${service === "register" ? "Verify" : "Login"} your OctoTokens account</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family:-apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; color:#111827; }
    .wrapper { width:100%; table-layout:fixed; background:#f4f6f8; padding:24px 12px; }
    .container { max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(15,23,42,0.08); }
    .header { background: linear-gradient(90deg,#6a11cb,#2575fc); padding:20px; text-align:left; color:#fff; }
    .logo { font-weight:700; font-size:20px; letter-spacing:0.4px; }
    .hero { padding:28px 28px 12px 28px; }
    h1 { margin:0 0 12px 0; font-size:22px; line-height:1.2; color:#0f172a; }
    p { margin:0 0 14px 0; color:#475569; font-size:15px; line-height:1.45; }
    .cta { display:block; width:100%; text-align:center; margin:18px 0 18px 0; }
    .button { background:linear-gradient(90deg,#6a11cb,#2575fc); color:#fff!important; text-decoration:none; padding:12px 20px; border-radius:10px; display:inline-block; font-weight:600; }
    .small { font-size:13px; color:#94a3b8; }
    .footer { padding:18px 28px; font-size:13px; color:#94a3b8; border-top:1px solid #eef2f7; background:#fbfdff; }
    .muted-link { color:#2563eb; text-decoration:none; }
    @media (max-width:420px){
      .hero { padding:20px; }
      h1 { font-size:20px; }
    }
  </style>
</head>
<body>
  <span style="display:none;max-height:0;overflow:hidden;">
    ${
        service === "register"
            ? "Welcome to OctoTokens — verify your email to finish creating your account."
            : "Login to your OctoTokens account — confirm this request to continue."
    }
  </span>
  <table class="wrapper" role="presentation" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table class="container" role="presentation" cellspacing="0" cellpadding="0">
          <tr>
            <td class="header">
              <div style="display:flex;align-items:center;gap:12px;">
                <div class="logo">OctoTokens</div>
              </div>
            </td>
          </tr>

          <tr>
            <td class="hero">
              <h1>
                ${service === "register" ? "Verify your email" : "Login Request"}, ${username}
              </h1>

              <p>
                ${
                    service === "register"
                        ? "Thanks for creating an account at OctoTokens. Click the button below to confirm your email and activate your account."
                        : "We received a request to login to your OctoTokens account. Click the button below to confirm this login."
                }
              </p>

              <div class="cta" role="presentation">
                <a href="${verification_link}" class="button" target="_blank" rel="noopener">
                  ${service === "register" ? "Verify your email" : "Confirm Login"}
                </a>
              </div>

              <p class="small">If the button doesn't work, copy and paste this link into your browser:</p>
              <p class="small" style="word-break:break-all;">
                <a href="${verification_link}" class="muted-link" target="_blank" rel="noopener">${verification_link}</a>
              </p>

              <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0;">

              <p>Need help? Contact <a href="mailto:hello@tanishqsingh.com" class="muted-link">hello@tanishqsingh.com</a> or visit our site.</p>
              <p style="margin-top:8px"><a href="https://octotokens.tanishqsingh.com" class="muted-link" target="_blank" rel="noopener">Visit OctoTokens</a></p>
            </td>
          </tr>

          <tr>
            <td class="footer">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div style="min-width:180px;">
                  <strong>OctoTokens</strong><br>
                </div>
                <div style="text-align:right;">
                  <span class="small" style="margin-left:12px;color:#94a3b8;">
                    ${
                        service === "register"
                            ? "If you did not create an account, ignore this email."
                            : "If you did not attempt to login, ignore this email."
                    }
                  </span>
                </div>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendMail = async (
    email: string,
    fullName: string,
    service: z.infer<typeof userSchema>["service"],
    verification_link: string,
) => {
    if (stage !== "prod") {
        console.log(verification_link);
        return;
    }

    // send mail
    await fetch(EMAIL_API!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + Buffer.from(`${MJ_APIKEY_PUBLIC}:${MJ_APIKEY_PRIVATE}`).toString("base64"),
        },
        body: JSON.stringify({
            Messages: [
                {
                    From: {
                        Email: EMAIL_SENDER_EMAIL,
                        Name: EMAIL_SENDER_NAME,
                    },
                    To: [
                        {
                            Email: email,
                            Name: fullName,
                        },
                    ],
                    Subject: `${service === "register" ? "Verify" : "Login"} your OctoTokens account`,
                    HTMLPart: AccountEmailTemplate(verification_link, fullName, service),
                },
            ],
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            if (!("Messages" in res && res["Messages"][0]["Status"] == "success")) throw new Error("Email not sent");
        });
};

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.httpMethod !== "POST")throw new Error("only accepts POST method");
        if (!event.body) throw new Error("Missing request body");

        // parse and validate body
        const parsedBody = userSchema.parse(JSON.parse(event.body));
        const { email, service } = parsedBody;

        // check if user already exists
        const existingUser = await ddbDocClient.send(
            new GetCommand({
                TableName: tableName!,
                Key: { email },
            }),
        );

        if (service === "register") {
            if (existingUser.Item) throw new Error("User already exists");

            const { email, fullName, password } = parsedBody;
            const hashedPassword = await bcrypt.hash(password, 10);

            const token = jwt.sign({ email, fullName, password: hashedPassword }, jwtSecret!, { expiresIn: "15m" });
            const verification_link = `${stage === "prod" ? "https://octotokens.tanishqsingh.com" : "http://localhost:5173"}/account-verification/${token}`;

            await sendMail(email, fullName, "register", verification_link);

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: "mail sent" }),
            };
        } else {
            if (!existingUser.Item) throw new Error("User not found");

            const { email, password } = parsedBody;
            const match = await bcrypt.compare(password, existingUser.Item.password);
            if (!match) throw new Error("Incorrect email or password");

            const accessToken = jwt.sign({ email, fullName: existingUser.Item.fullName }, jwtSecret!, { expiresIn: "30d" });
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: "user logged in", accessToken }),
            };
        }
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
