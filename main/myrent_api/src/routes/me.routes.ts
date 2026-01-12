/**
 * @openapi
 * tags:
 *   - name: Me
 *     description: Authenticated user info
 *
 * /me:
 *   get:
 *     summary: Get current authenticated user (JWT required)
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user extracted from the token
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */


import { Router } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;