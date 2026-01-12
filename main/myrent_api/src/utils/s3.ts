import { S3Client, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} missing in .env`);
  return v;
}

export const S3_BUCKET = mustEnv("S3_BUCKET");
export const S3_PUBLIC_BASE_URL = mustEnv("S3_PUBLIC_BASE_URL").replace(/\/$/, "");

export const s3 = new S3Client({
  region: mustEnv("S3_REGION"),
  endpoint: mustEnv("S3_ENDPOINT"),
  credentials: {
    accessKeyId: mustEnv("S3_ACCESS_KEY"),
    secretAccessKey: mustEnv("S3_SECRET_KEY"),
  },
  forcePathStyle: true, // IMPORTANT pour MinIO
});

export async function ensureBucketExists() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
  }
}

export function buildPublicUrl(key: string) {
  return `${S3_PUBLIC_BASE_URL}/${key}`;
}
