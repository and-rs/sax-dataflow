import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import * as fs from "node:fs";

const secretManager = new SecretsManagerClient();
const secretArn = process.env.DB_SECRET_ARN;

async function getDatabaseSecrets(): Promise<{
  username: string;
  password: string;
}> {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretArn });
    const response = await secretManager.send(command);
    const { username, password } = JSON.parse(response.SecretString!);
    return { username, password };
  } catch (error) {
    console.error("Error retrieving database secrets:", error);
    throw error;
  }
}

async function getDatabaseConfig() {
  const host = process.env.DB_HOST!;
  const port = process.env.DB_PORT!;
  const database = process.env.DB_NAME!;

  let username: string;
  let password: string;
  let url: string;

  if (process.env.NODE_ENV === "dev") {
    username = process.env.DB_USER!;
    password = process.env.DB_PASSWORD!;
    url = `postgresql://${username}:${password}@${host}:${port}/${database}`;

    return { url, ssl: false as any };
  } else {
    const secrets = await getDatabaseSecrets();
    username = secrets.username;
    password = secrets.password;
    url = `postgresql://${username}:${password}@${host}:${port}/${database}`;

    return {
      url,
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./global-bundle.pem", { encoding: "utf8" }),
      },
    };
  }
}

export { getDatabaseConfig };
