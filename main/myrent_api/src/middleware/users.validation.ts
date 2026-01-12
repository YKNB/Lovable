import { body, param } from "express-validator";

export const userIdParamValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid user id (must be UUID)"),
];

export const updateUserValidation = [
  ...userIdParamValidation,

  body().custom((value) => {
    // Interdire body vide
    if (!value || typeof value !== "object") return true; // laisser express-validator gérer
    const keys = Object.keys(value);
    if (keys.length === 0) {
      throw new Error("Request body cannot be empty");
    }
    return true;
  }),

  body("first_name")
    .optional()
    .isString()
    .withMessage("first_name must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("first_name must be 2-100 characters"),

  body("last_name")
    .optional()
    .isString()
    .withMessage("last_name must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("last_name must be 2-100 characters"),

  body("password")
    .optional()
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 8, max: 128 })
    .withMessage("password must be 8-128 characters"),

  // Interdire les champs non autorisés (ex: role, email, etc.)
  body().custom((value) => {
    if (!value || typeof value !== "object") return true;
    const allowed = new Set(["first_name", "last_name", "password"]);
    const unknown = Object.keys(value).filter((k) => !allowed.has(k));
    if (unknown.length > 0) {
      throw new Error(`Unknown fields: ${unknown.join(", ")}`);
    }
    return true;
  }),
];

export const deleteUserValidation = [
  ...userIdParamValidation,
];
