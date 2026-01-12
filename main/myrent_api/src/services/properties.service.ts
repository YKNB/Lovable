import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/appError";



export function listProperties() {
  return prisma.properties.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      owner_id: true,
      title: true,
      description: true,
      price_per_night: true,
      city: true,
      address: true,
      max_guests: true,
      image_url: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export function getPropertyById(id: string) {
  return prisma.properties.findUnique({
    where: { id },
    select: {
      id: true,
      owner_id: true,
      title: true,
      description: true,
      price_per_night: true,
      city: true,
      address: true,
      max_guests: true,
      image_url: true,
      created_at: true,
      updated_at: true,
    },
  });
}



export function createProperty(
  ownerId: string,
  data: {
    title: string;
    description?: string;
    price_per_night: number | string;
    city: string;
    address?: string;
    max_guests?: number;
    image_url?: string;
  }
) {
  const guests = data.max_guests ?? 1;
  if (guests < 1) throw new AppError(400, "max_guests must be >= 1");

  const price = new Prisma.Decimal(data.price_per_night);
  if (price.lt(0)) throw new AppError(400, "price_per_night must be >= 0");

  if (data.image_url && !data.image_url.startsWith("http")) {
    throw new AppError(400, "image_url must be a valid URL");
  }

  return prisma.properties.create({
    data: {
      owner_id: ownerId,
      title: data.title,
      description: data.description ?? null,
      price_per_night: price,
      city: data.city,
      address: data.address ?? null,
      max_guests: guests,
      image_url: data.image_url ?? null,
    },
    select: {
      id: true,
      owner_id: true,
      title: true,
      description: true,
      price_per_night: true,
      city: true,
      address: true,
      max_guests: true,
      image_url: true,
      created_at: true,
      updated_at: true,
    },
  });
}



export async function updateProperty(
  id: string,
  ownerId: string,
  isAdmin: boolean,
  data: {
    title?: string;
    description?: string | null;
    price_per_night?: number | string;
    city?: string;
    address?: string | null;
    max_guests?: number;
    image_url?: string | null;
  }
) {
  const existing = await prisma.properties.findUnique({
    where: { id },
    select: { id: true, owner_id: true },
  });

  if (!existing) throw new AppError(404, "Property not found");
  if (!isAdmin && existing.owner_id !== ownerId) {
    throw new AppError(403, "Forbidden (not your property)");
  }

  const updateData: Prisma.propertiesUpdateInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.address !== undefined) updateData.address = data.address;

  if (data.max_guests !== undefined) {
    if (data.max_guests < 1) {
      throw new AppError(400, "max_guests must be >= 1");
    }
    updateData.max_guests = data.max_guests;
  }

  if (data.price_per_night !== undefined) {
    const price = new Prisma.Decimal(data.price_per_night);
    if (price.lt(0)) {
      throw new AppError(400, "price_per_night must be >= 0");
    }
    updateData.price_per_night = price;
  }

  if (data.image_url !== undefined) {
    if (data.image_url !== null && !data.image_url.startsWith("http")) {
      throw new AppError(400, "image_url must be a valid URL");
    }
    updateData.image_url = data.image_url;
  }

  return prisma.properties.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      owner_id: true,
      title: true,
      description: true,
      price_per_night: true,
      city: true,
      address: true,
      max_guests: true,
      image_url: true,
      created_at: true,
      updated_at: true,
    },
  });
}



export async function deleteProperty(id: string, ownerId: string, isAdmin: boolean) {
  const existing = await prisma.properties.findUnique({
    where: { id },
    select: { id: true, owner_id: true },
  });

  if (!existing) throw new AppError(404, "Property not found");
  if (!isAdmin && existing.owner_id !== ownerId) {
    throw new AppError(403, "Forbidden (not your property)");
  }

  await prisma.properties.delete({ where: { id } });
}
