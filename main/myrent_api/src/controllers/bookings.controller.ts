import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import * as BookingsService from "../services/bookings.service";

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user!.id;

  const { property_id, start_date, end_date } = req.body as {
    property_id: string;
    start_date: string;
    end_date: string;
  };

  if (!property_id || !start_date || !end_date) {
    throw new AppError(400, "Missing required fields: property_id, start_date, end_date");
  }

  const booking = await BookingsService.createBooking(tenantId, { property_id, start_date, end_date });
  res.status(201).json(booking);
});

export const listMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user!.id;
  const bookings = await BookingsService.listMyBookings(tenantId);
  res.json(bookings);
});

export const listOwnerBookings = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const bookings = await BookingsService.listOwnerBookings(ownerId);
  res.json(bookings);
});

export const confirmBooking = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const { id } = req.params;

  const updated = await BookingsService.confirmBooking(id, ownerId);
  res.json(updated);
});

export const cancelBookingByOwner = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const { id } = req.params;

  const updated = await BookingsService.cancelByOwner(id, ownerId);
  res.json(updated);
});

export const cancelMyBooking = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user!.id;
  const { id } = req.params;

  const updated = await BookingsService.cancelByTenant(id, tenantId);
  res.json(updated);
});
