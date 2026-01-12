import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { ensureBucketExists } from "./utils/s3";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  try {
    const maxAttempts = 10;
    const delayMs = 1500;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await ensureBucketExists();
        console.log("MinIO bucket ready");
        break;
      } catch (error) {
        console.error(`MinIO bucket error (attempt ${attempt}/${maxAttempts})`, error);
        if (attempt === maxAttempts) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    app.listen(port, "0.0.0.0", () => {
      console.log(`API running on port ${port}`);
    });
  } catch (e) {
    console.error("MinIO bucket error", e);
    process.exit(1);
  }
}

start();
