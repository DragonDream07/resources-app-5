import api from './api.js';

// Products
export const listProducts = (params) =>
  api.get('/products', { params }).then((res) => res.data);

export const getProduct = (productId) =>
  api.get(`/products/${productId}`).then((res) => res.data);

export const getProductSkus = (productId) =>
  api.get(`/products/${productId}/skus`).then((res) => res.data);

export const getProductImages = (productId) =>
  api.get(`/products/${productId}/images`).then((res) => res.data);

// Categories
export const listCategories = () =>
  api.get('/categories').then((res) => res.data);

export const getCategory = (categoryId) =>
  api.get(`/categories/${categoryId}`).then((res) => res.data);

export const getCategoryProducts = (categoryId, params) =>
  api.get(`/categories/${categoryId}/products`, { params }).then((res) => res.data);

// Brands
export const listBrands = () =>
  api.get('/brands').then((res) => res.data);

export const getBrand = (brandId) =>
  api.get(`/brands/${brandId}`).then((res) => res.data);

// Admin CRUD — Products
export const adminCreateProduct = (payload) =>
  api.post('/products', payload).then((res) => res.data);

export const adminUpdateProduct = (productId, payload) =>
  api.put(`/products/${productId}`, payload).then((res) => res.data);

export const adminDeleteProduct = (productId) =>
  api.delete(`/products/${productId}`).then((res) => res.data);

export const adminAddProductImages = (productId, payload) =>
  api.post(`/products/${productId}/images`, payload).then((res) => res.data);

export const adminCreateProductSku = (productId, payload) =>
  api.post(`/products/${productId}/skus`, payload).then((res) => res.data);

export const adminUpdateProductSku = (productId, skuId, payload) =>
  api.put(`/products/${productId}/skus/${skuId}`, payload).then((res) => res.data);

// Admin CRUD — Categories
export const adminCreateCategory = (payload) =>
  api.post('/categories', payload).then((res) => res.data);

export const adminUpdateCategory = (categoryId, payload) =>
  api.put(`/categories/${categoryId}`, payload).then((res) => res.data);

export const adminDeleteCategory = (categoryId) =>
  api.delete(`/categories/${categoryId}`).then((res) => res.data);

// Admin CRUD — Brands
export const adminCreateBrand = (payload) =>
  api.post('/brands', payload).then((res) => res.data);

export default {
  listProducts,
  getProduct,
  getProductSkus,
  getProductImages,
  listCategories,
  getCategory,
  getCategoryProducts,
  listBrands,
  getBrand,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminAddProductImages,
  adminCreateProductSku,
  adminUpdateProductSku,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateBrand,
};
