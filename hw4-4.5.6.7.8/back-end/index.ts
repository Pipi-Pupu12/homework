import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import productsRouter from "./routers/products";
import fileDb from "./file/fileDb";

const app = express();
const port = 8000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shop API",
      version: "1.0.0",
      description: "API для управления продуктами",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/products", productsRouter);
const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log("Server %s on %d port!", "start", port);
  });
};

run().catch(console.error);
