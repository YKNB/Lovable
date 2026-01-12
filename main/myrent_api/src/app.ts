import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import usersRouter from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import bookingsRoutes from "./routes/bookings.routes";
import propertiesRoutes from "./routes/properties.routes";
import meRoutes from "./routes/me.routes";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { errorHandler } from "./middleware/error";

// const app = express();

export const app = express();


// Middlewares 
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

if (process.env.NODE_ENV === "test") {
  app.get("/__test__/boom", (_req, _res) => {
    throw new Error("boom");
  });
}


app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/properties", propertiesRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/users", usersRouter);
app.use(meRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
