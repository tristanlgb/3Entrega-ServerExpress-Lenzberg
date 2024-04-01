import express from 'express';
import fs from 'fs/promises';
import { ProductManager } from './productManager.js';

const app = express();
const port = 8080;

app.use(express.json());

const productsRouter = express.Router();
const productsFile = './products.json';
const productManager = new ProductManager(productsFile);

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const errorMessage = err.message || 'Internal Server Error';
  const statusCode = err.statusCode || 500;
  const errorDetails = err.details || null;
  res.status(statusCode).json({ error: errorMessage, details: errorDetails });
};

productsRouter.get('/', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const data = await fs.readFile(productsFile, 'utf8');
    let products = JSON.parse(data);
    if (limit) {
      products = products.slice(0, limit);
    }
    res.json(products);
  } catch (err) {
    next(err);
  }
});

productsRouter.get('/:pid', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.pid);
    const data = await fs.readFile(productsFile, 'utf8');
    const products = JSON.parse(data);
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
});

app.use('/products', productsRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});