import multer from "multer";
import type { Request } from "express";
import type { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only jpg/png/webp allowed"));
    }

    cb(null, true);
  },
});
