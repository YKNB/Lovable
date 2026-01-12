import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/appError";

function parseISODate(dateStr: string): Date {
  // attend "YYYY-MM-DD"
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new AppError(400, "Invalid date format (use YYYY-MM-DD)");
  return d;
}

function daysBetween(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export async function createBooking(
  tenantId: string,
  data: {
    property_id: string;
    start_date: string;
    end_date: string;
  }
) {
  const start = parseISODate(data.start_date);
  const end = parseISODate(data.end_date);

  if (end <= start) throw new AppError(400, "end_date must be after start_date");

  const property = await prisma.properties.findUnique({
    where: { id: data.property_id },
    select: { id: true, price_per_night: true },
  });
  if (!property) throw new AppError(404, "Property not found");

  const overlap = await prisma.bookings.findFirst({
    where: {
      property_id: data.property_id,
      status: { in: ["PENDING", "CONFIRMED"] },
      AND: [{ start_date: { lt: end } }, { end_date: { gt: start } }],
    },
    select: { id: true },
  });

  if (overlap) throw new AppError(409, "This property is already booked for these dates");

  const nights = daysBetween(start, end);
  const total = new Prisma.Decimal(property.price_per_night).mul(nights);

  return prisma.bookings.create({
    data: {
      tenant_id: tenantId,
      property_id: data.property_id,
      start_date: start,
      end_date: end,
      total_price: total,
      status: "PENDING",
    },
    select: {
      id: true,
      tenant_id: true,
      property_id: true,
      start_date: true,
      end_date: true,
      total_price: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export function listMyBookings(tenantId: string) {
  return prisma.bookings.findMany({
    where: { tenant_id: tenantId },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      property_id: true,
      start_date: true,
      end_date: true,
      total_price: true,
      status: true,
      created_at: true,
      updated_at: true,
      properties: {
        select: { id: true, title: true, city: true, price_per_night: true },
      },
    },
  });
}

export function listOwnerBookings(ownerId: string) {
  return prisma.bookings.findMany({
    where: { properties: { owner_id: ownerId } },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      tenant_id: true,
      property_id: true,
      start_date: true,
      end_date: true,
      total_price: true,
      status: true,
      created_at: true,
      updated_at: true,
      properties: {
        select: { id: true, title: true, city: true, price_per_night: true },
      },
    },
  });
}

export async function confirmBooking(bookingId: string, ownerId: string) {
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    include: { properties: true },
  });

  if (!booking) throw new AppError(404, "Booking not found");
  if (booking.properties.owner_id !== ownerId) throw new AppError(403, "Forbidden (not your property)");
  if (booking.status === "CANCELLED") throw new AppError(409, "Cannot confirm a cancelled booking");

  return prisma.bookings.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" },
    select: {
      id: true,
      tenant_id: true,
      property_id: true,
      start_date: true,
      end_date: true,
      total_price: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export async function cancelByOwner(bookingId: string, ownerId: string) {
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    include: { properties: true },
  });

  if (!booking) throw new AppError(404, "Booking not found");
  if (booking.properties.owner_id !== ownerId) throw new AppError(403, "Forbidden (not your property)");
  if (booking.status === "CANCELLED") throw new AppError(409, "Booking already cancelled");

  return prisma.bookings.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    select: {
      id: true,
      tenant_id: true,
      property_id: true,
      start_date: true,
      end_date: true,
      total_price: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export async function cancelByTenant(bookingId: string, tenantId: string) {
  const booking = await prisma.bookings.findUnique({ where: { id: bookingId } });

  if (!booking) throw new AppError(404, "Booking not found");
  if (booking.tenant_id !== tenantId) throw new AppError(403, "Forbidden (not your booking)");
  if (booking.status === "CONFIRMED") throw new AppError(409, "Cannot cancel a confirmed booking");
  if (booking.status === "CANCELLED") throw new AppError(409, "Booking already cancelled");

  return prisma.bookings.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    select: {
      id: true,
      tenant_id: true,
      property_id: true,
      start_date: true,
      end_date: true,
      total_price: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
}
