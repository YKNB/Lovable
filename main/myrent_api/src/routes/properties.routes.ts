/**
 * @openapi
 * /properties/{id}/image:
 *   post:
 *     operationId: uploadPropertyImage
 *     summary: Upload property image (OWNER only, must own property)
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated property
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Property"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property not found

 * /properties:
 *   get:
 *     operationId: listProperties
 *     summary: List properties (public)
 *     tags: [Properties]
 *     security: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Property"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *
 *   post:
 *     operationId: createProperty
 *     summary: Create a property (OWNER only)
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PropertyCreateBody"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Property"
 *       400:
 *         description: Bad request
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
 * /properties/{id}:
 *   get:
 *     operationId: getPropertyById
 *     summary: Get one property by id (public)
 *     tags: [Properties]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Property"
 *       404:
 *         description: Property not found
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
 *   patch:
 *     operationId: patchProperty
 *     summary: Update a property (OWNER only, must own property) - partial update
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PropertyUpdateBody"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Property"
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
 *         description: Property not found
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
 *   put:
 *     operationId: putProperty
 *     summary: Update a property (OWNER only) - behaves like PATCH in this API
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PropertyUpdateBody"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Property"
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
 *       404:
 *         description: Property not found
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
 *   delete:
 *     operationId: deleteProperty
 *     summary: Delete a property (OWNER only, must own property)
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Deleted
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
 *       404:
 *         description: Property not found
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
import {
  createProperty,
  listProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  uploadPropertyImage,
} from "../controllers/properties.controller";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";

import { createPropertyValidation } from "../middleware/createProperty.schema";
import { validateRequest } from "../middleware/validateRequest";

// (optionnel mais recommandé) validation PATCH/PUT
import { updatePropertyValidation } from "../middleware/updateProperty.schema";
import { uploadImage } from "../middleware/upload";

const router = Router();

// Public
router.get("/", listProperties);
router.get("/:id", getPropertyById);

// OWNER only
router.post(
  "/",
  requireAuth,
  requireRole("OWNER", "ADMIN"),
  createPropertyValidation,
  validateRequest,
  createProperty
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("OWNER", "ADMIN"),
  updatePropertyValidation, 
  validateRequest,          
  updateProperty
);

router.put(
  "/:id",
  requireAuth,
  requireRole("OWNER", "ADMIN"),
  updatePropertyValidation, 
  validateRequest,          
  updateProperty
);

router.post(
  "/:id/image",
  requireAuth,
  requireRole("OWNER", "ADMIN"),
  uploadImage.single("image"),
  uploadPropertyImage
);

router.delete("/:id", requireAuth, requireRole("OWNER", "ADMIN"), deleteProperty);

export default router;

