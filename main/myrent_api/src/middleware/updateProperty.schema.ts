import { body } from "express-validator";

export const updatePropertyValidation = [
  body("title").optional().isString().isLength({ min: 3, max: 150 }),
  body("city").optional().isString().isLength({ min: 2, max: 120 }),
  body("price_per_night").optional().isFloat({ min: 0 }),
  body("max_guests").optional().isInt({ min: 1 }),

  body("image_url")
    .optional({ values: "falsy" })
    .isString()
    .isURL()
    .withMessage("image_url must be a valid URL"),
];