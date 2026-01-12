import { body } from "express-validator";

export const registerValidation = [
  body("first_name")
    .isString().withMessage("first_name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("first_name must be 2-100 characters"),

  body("last_name")
    .isString().withMessage("last_name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("last_name must be 2-100 characters"),

  body("email")
    .isEmail().withMessage("email must be a valid email")
    .normalizeEmail(),

  body("password")
    .isString().withMessage("password must be a string")
    .isLength({ min: 8, max: 128 }).withMessage("password must be 8-128 characters"),

  // Role: on autorise seulement TENANT/OWNER en public (pas ADMIN)
  body("role")
    .optional()
    .isIn(["TENANT", "OWNER", "ADMIN"])
    .withMessage("role must be TENANT, OWNER, or ADMIN"),

  // Interdire les champs inattendus
  body().custom((value) => {
    if (!value || typeof value !== "object") return true;
    const allowed = new Set(["first_name", "last_name", "email", "password", "role"]);
    const unknown = Object.keys(value).filter((k) => !allowed.has(k));
    if (unknown.length > 0) {
      throw new Error(`Unknown fields: ${unknown.join(", ")}`);
    }
    return true;
  }),
];

export const loginValidation = [
  body("email")
    .isEmail().withMessage("email must be a valid email")
    .normalizeEmail(),

  body("password")
    .isString().withMessage("password must be a string")
    .isLength({ min: 1 }).withMessage("password is required"),

  body().custom((value) => {
    if (!value || typeof value !== "object") return true;
    const allowed = new Set(["email", "password"]);
    const unknown = Object.keys(value).filter((k) => !allowed.has(k));
    if (unknown.length > 0) {
      throw new Error(`Unknown fields: ${unknown.join(", ")}`);
    }
    return true;
  }),
];
