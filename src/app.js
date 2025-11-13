import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";
import { swaggerDocument } from "./docs/swagger.js";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Order Service running on port ${process.env.PORT}`);
  console.log(`📘 Swagger Docs available at /api-docs`);
});
