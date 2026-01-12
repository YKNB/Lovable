import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import * as PropertiesService from "../services/properties.service";
import * as PropertyImagesService from "../services/propertyImages.service";

export const listProperties = asyncHandler(async (_req: Request, res: Response) => {
  const properties = await PropertiesService.listProperties();
  res.json(properties);
});

export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const property = await PropertiesService.getPropertyById(id);
  if (!property) throw new AppError(404, "Property not found");

  res.json(property);
});


export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;

  const {
    title,
    description,
    price_per_night,
    city,
    address,
    max_guests,
    image_url,
  } = req.body as {
    title: string;
    description?: string;
    price_per_night: number | string;
    city: string;
    address?: string;
    max_guests?: number;
    image_url?: string;
  };

  if (!title || !city || price_per_night === undefined) {
    throw new AppError(400, "Missing required fields: title, city, price_per_night");
  }

  const created = await PropertiesService.createProperty(ownerId, {
    title,
    description,
    price_per_night,
    city,
    address,
    max_guests,
    image_url,
  });

  res.status(201).json(created);
});



export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const isAdmin = req.user!.role === "ADMIN";
  const { id } = req.params;

  const {
    title,
    description,
    price_per_night,
    city,
    address,
    max_guests,
    image_url,
  } = req.body as {
    title?: string;
    description?: string | null;
    price_per_night?: number | string;
       city?: string;
    address?: string | null;
    max_guests?: number;
    image_url?: string | null;
  };

  const updated = await PropertiesService.updateProperty(id, ownerId, isAdmin, {
    title,
    description,
    price_per_night,
    city,
    address,
    max_guests,
    image_url,
  });

  res.json(updated);
});



export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const isAdmin = req.user!.role === "ADMIN";
  const { id } = req.params;

  await PropertiesService.deleteProperty(id, ownerId, isAdmin);
  res.status(204).end();
});


export const uploadPropertyImage = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const isAdmin = req.user!.role === "ADMIN";
  const { id: propertyId } = req.params;

  if (!req.file) throw new AppError(400, "Missing file (field name: image)");

  const updated = await PropertyImagesService.uploadPropertyImage({
    propertyId,
    ownerId,
    isAdmin,
    file: {
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
    },
  });

  res.json(updated);
});
