/**
 * @openapi
 * /bookings:
 *   post:
 *     operationId: createBooking
 *     summary: Create a booking (TENANT only)
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BookingCreateBody"
 *     responses:
 *       201:
 *         description: Created (status PENDING)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Booking"
 *       400:
 *         description: Bad request (missing fields / invalid dates)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden (not TENANT)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       409:
 *         description: Conflict (dates overlap)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 * /bookings/me:
 *   get:
 *     operationId: listMyBookings
 *     summary: List my bookings (TENANT only)
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BookingWithPropertyLite"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 * /bookings/owned:
 *   get:
 *     operationId: listOwnerBookings
 *     summary: List bookings for my properties (OWNER only)
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BookingWithPropertyLite"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden (not OWNER)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 * /bookings/{id}/confirm:
 *   patch:
 *     operationId: confirmBooking
 *     summary: Confirm a booking (OWNER only, must own the property)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK (status CONFIRMED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Booking"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden (not your property)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       409:
 *         description: Cannot confirm cancelled booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 * /bookings/{id}/cancel:
 *   patch:
 *     operationId: cancelMyBooking
 *     summary: Cancel my booking (TENANT only, must own booking)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK (status CANCELLED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Booking"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden (not your booking / not TENANT)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       409:
 *         description: Cannot cancel confirmed or already cancelled booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 * /bookings/{id}/cancel-by-owner:
 *   patch:
 *     operationId: cancelBookingByOwner
 *     summary: Cancel a booking for my property (OWNER only, must own property)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK (status CANCELLED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Booking"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden (not your property / not OWNER)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */



import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import {
  cancelBookingByOwner,
  cancelMyBooking,
  confirmBooking,
  createBooking,
  listMyBookings,
  listOwnerBookings,
} from "../controllers/bookings.controller";

const router = Router();

// TENANT
router.post("/", requireAuth, requireRole("TENANT"), createBooking);
router.get("/me", requireAuth, requireRole("TENANT"), listMyBookings);
router.patch("/:id/cancel", requireAuth, requireRole("TENANT"), cancelMyBooking);

// OWNER
router.get("/owned", requireAuth, requireRole("OWNER"), listOwnerBookings);
router.patch("/:id/confirm", requireAuth, requireRole("OWNER"), confirmBooking);
router.patch("/:id/cancel-by-owner", requireAuth, requireRole("OWNER"), cancelBookingByOwner);

export default router;
