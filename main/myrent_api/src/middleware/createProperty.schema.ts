
import { body } from "express-validator";

export const createPropertyValidation = [
  body("title")
    .isString().withMessage("title must be a string")
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage("title must be 3..150 chars"),

  body("city")
    .isString().withMessage("city must be a string")
    .trim()
    .isLength({ min: 2, max: 120 }).withMessage("city must be 2..120 chars"),

  body("price_per_night")
    .notEmpty().withMessage("price_per_night is required")
    .isFloat({ min: 0 }).withMessage("price_per_night must be >= 0"),

  body("max_guests")
    .optional()
    .isInt({ min: 1 }).withMessage("max_guests must be >= 1"),

  body("image_url")
    .optional({ values: "falsy" }) // ignore: undefined, null, "" (pratique)
    .isString().withMessage("image_url must be a string")
    .isURL().withMessage("image_url must be a valid URL"),
];
