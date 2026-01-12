/**
 * @openapi
 * /auth/register:
 *   post:
 *     operationId: registerUser
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthRegisterBody"
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       409:
 *         description: Email already used
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
 * /auth/login:
 *   post:
 *     operationId: loginUser
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthLoginBody"
 *     responses:
 *       200:
 *         description: Logged in (returns token + user)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Missing email/password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Invalid credentials
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
import { asyncHandler } from "../utils/asyncHandler";
import { handleValidationErrors } from "../middleware/validation";
import { register, login } from "../controllers/auth.controller";
import { registerValidation, loginValidation } from "../middleware/auth.validation";


const router = Router();

router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  asyncHandler(register)
);

router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  asyncHandler(login)
);

export default router;
