import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error reading products file');
    }
  }

  async getProductById(productId) {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      const products = JSON.parse(data);
      return products.find(product => product.id === productId);
    } catch (error) {
      throw new Error('Error reading products file');
    }
  }

  async addProduct(newProduct) {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      const products = JSON.parse(data);
      newProduct.id = uuidv4();
      products.push(newProduct);
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw new Error('Error adding product');
    }
  }

  async updateProduct(productId, updatedFields) {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      let products = JSON.parse(data);
      const index = products.findIndex(product => product.id === productId);
      if (index === -1) {
        throw new Error('Product not found');
      }
      products[index] = { ...products[index], ...updatedFields };
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  async deleteProduct(productId) {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      let products = JSON.parse(data);
      const index = products.findIndex(product => product.id === productId);
      if (index === -1) {
        throw new Error('Product not found');
      }
      products.splice(index, 1);
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return 'Product deleted successfully';
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }
}