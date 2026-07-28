import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductSkus,
  getProductSku,
  createProductSku,
  updateProductSku,
  deleteProductSku,
  listProductImages,
  addProductImage,
  deleteProductImage,
  listCategories,
  getCategory,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  listBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from './catalogue.controller.js';
import {
  validateProductCreate,
  validateProductUpdate,
  validateSkuCreate,
  validateSkuUpdate,
  validateCategoryCreate,
  validateCategoryUpdate,
  validateBrandCreate,
  validateBrandUpdate,
  validateImageAdd,
} from './catalogue.validator.js';

const router = Router();

// ── Products ──────────────────────────────────────────────────────────────────
router.get('/products', listProducts);
router.get('/products/:productId', getProduct);
router.post('/products', validateProductCreate, createProduct);
router.put('/products/:productId', validateProductUpdate, updateProduct);
router.delete('/products/:productId', deleteProduct);

// ── Product SKUs ──────────────────────────────────────────────────────────────
router.get('/products/:productId/skus', listProductSkus);
router.get('/products/:productId/skus/:skuId', getProductSku);
router.post('/products/:productId/skus', validateSkuCreate, createProductSku);
router.put('/products/:productId/skus/:skuId', validateSkuUpdate, updateProductSku);
router.delete('/products/:productId/skus/:skuId', deleteProductSku);

// ── Product Images ────────────────────────────────────────────────────────────
router.get('/products/:productId/images', listProductImages);
router.post('/products/:productId/images', validateImageAdd, addProductImage);
router.delete('/products/:productId/images/:imageId', deleteProductImage);

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories', listCategories);
router.get('/categories/:categoryId', getCategory);
router.get('/categories/:categoryId/products', getCategoryProducts);
router.post('/categories', validateCategoryCreate, createCategory);
router.put('/categories/:categoryId', validateCategoryUpdate, updateCategory);
router.delete('/categories/:categoryId', deleteCategory);

// ── Brands ────────────────────────────────────────────────────────────────────
router.get('/brands', listBrands);
router.get('/brands/:brandId', getBrand);
router.post('/brands', validateBrandCreate, createBrand);
router.put('/brands/:brandId', validateBrandUpdate, updateBrand);
router.delete('/brands/:brandId', deleteBrand);

export default router;
