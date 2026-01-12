import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { updateUser, deleteUser } from "../controllers/users.controller";
import { handleValidationErrors } from "../middleware/validation";
import { updateUserValidation, deleteUserValidation } from "../middleware/users.validation";

const router = Router();

router.put(
  "/:id",
  requireAuth,
  updateUserValidation,
  handleValidationErrors,
  asyncHandler(updateUser)
);

router.delete(
  "/:id",
  requireAuth,
  deleteUserValidation,
  handleValidationErrors,
  asyncHandler(deleteUser)
);

export default router;
