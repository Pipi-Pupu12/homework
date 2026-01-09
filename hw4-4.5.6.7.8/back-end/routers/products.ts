import express from "express";
import fileDb from "../file/fileDb";
import { getImageURL, imagesUpload } from "../file/multer";
import { ProductWithoutId } from "../types";
const productsRouter = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить список всех продуктов
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список продуктов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
productsRouter.get("/", async (req, res) => {
  const products = await fileDb.getItems();
  res.send(products);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Продукт не найден
 */
productsRouter.get("/:id", async (req: any, res: any) => {
  const products = await fileDb.getItems();
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).send({ error: "Продукт не найден" });
  }
  res.send(product);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Создать новый продукт
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название продукта
 *               description:
 *                 type: string
 *                 description: Описание продукта
 *               price:
 *                 type: integer
 *                 description: Цена продукта
 *               status:
 *                 type: string
 *                 description: Статус продукта
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Изображение продукта
 *     responses:
 *       200:
 *         description: Продукт создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
productsRouter.post("/", imagesUpload.single("image"), async (req, res) => {
  const product: ProductWithoutId = {
    title: req.body.title,
    description: req.body.description,
    price: parseInt(req.body.price),
    image: req.file ? getImageURL(req.file.filename) : null,
    status: req.body.status,
  };

  const savedProduct = await fileDb.addItem(product);
  res.send(savedProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Обновить продукт
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название продукта
 *               description:
 *                 type: string
 *                 description: Описание продукта
 *               price:
 *                 type: integer
 *                 description: Цена продукта
 *               status:
 *                 type: string
 *                 description: Статус продукта
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Изображение продукта
 *     responses:
 *       200:
 *         description: Продукт обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Продукт не найден
 */
productsRouter.patch("/:id", imagesUpload.single("image"), async (req, res) => {
  const id = req.params.id;
  const updateData: Partial<ProductWithoutId> = {};

  if (req.body.title) {
    updateData.title = req.body.title;
  }
  if (req.body.description) {
    updateData.description = req.body.description;
  }
  if (req.body.price) {
    updateData.price = parseInt(req.body.price);
  }
  if (req.body.status) {
    updateData.status = req.body.status;
  }
  if (req.file) {
    updateData.image = getImageURL(req.file.filename);
  }

  const updatedProduct = await fileDb.updateItem(id, updateData);

  if (!updatedProduct) {
    res.status(404).send({ error: "Продукт не найден" });
    return;
  }

  res.send(updatedProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить продукт
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       404:
 *         description: Продукт не найден
 */
productsRouter.delete("/:id", async (req: any, res: any) => {
  const id = req.params.id;
  const deleted = await fileDb.deleteItem(id);

  if (!deleted) {
    return res.status(404).send({ error: "Продукт не найден" });
  }

  res.send({ message: "Продукт удалён", id });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - price
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор продукта
 *         title:
 *           type: string
 *           description: Название продукта
 *         description:
 *           type: string
 *           description: Описание продукта
 *         price:
 *           type: integer
 *           description: Цена продукта
 *         image:
 *           type: string
 *           nullable: true
 *           description: URL изображения продукта
 *         status:
 *           type: string
 *           description: Статус продукта
 */

export default productsRouter;
