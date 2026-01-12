import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "../prisma";
import { AppError } from "../utils/appError";
import { S3_BUCKET, buildPublicUrl, s3 } from "../utils/s3";
import crypto from "crypto";
import path from "path";

function extFromMime(mime: string) {
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return "";
}

export async function uploadPropertyImage(params: {
  propertyId: string;
  ownerId: string;
  isAdmin: boolean;
  file: { buffer: Buffer; mimetype: string; originalname: string };
}) {
  const { propertyId, ownerId, isAdmin, file } = params;

  const property = await prisma.properties.findUnique({
    where: { id: propertyId },
    select: { id: true, owner_id: true },
  });

  if (!property) throw new AppError(404, "Property not found");
  if (!isAdmin && property.owner_id !== ownerId) {
    throw new AppError(403, "Forbidden (not your property)");
  }

  const ext = extFromMime(file.mimetype);
  if (!ext) throw new AppError(400, "Unsupported image type");

  const random = crypto.randomBytes(8).toString("hex");
  const key = `properties/${propertyId}/${Date.now()}-${random}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Pour MinIO “public simple”, il faut rendre le bucket public via console
      // ou utiliser une policy. On fait ça juste après.
    })
  );

  const imageUrl = buildPublicUrl(key);

  const updated = await prisma.properties.update({
    where: { id: propertyId },
    data: { image_url: imageUrl },
    select: {
      id: true,
      owner_id: true,
      title: true,
      city: true,
      price_per_night: true,
      image_url: true,
      created_at: true,
      updated_at: true,
    },
  });

  return updated;
}
