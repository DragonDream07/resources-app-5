import {
  fetchProducts,
  fetchProductById,
  insertProduct,
  modifyProduct,
  removeProduct,
  fetchSkusByProduct,
  fetchSkuById,
  insertSku,
  modifySku,
  removeSku,
  fetchImagesByProduct,
  insertProductImage,
  removeProductImage,
  fetchCategories,
  fetchCategoryById,
  fetchProductsByCategory,
  insertCategory,
  modifyCategory,
  removeCategory,
  fetchBrands,
  fetchBrandById,
  insertBrand,
  modifyBrand,
  removeBrand,
} from './catalogue.service.js';

// ── Products ──────────────────────────────────────────────────────────────────

export async function listProducts(req, res, next) {
  try {
    const { page, limit, category_id, brand_id, min_price, max_price, sort } = req.query;
    const result = await fetchProducts({ page, limit, category_id, brand_id, min_price, max_price, sort });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await fetchProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await insertProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await modifyProduct(productId, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;
    await removeProduct(productId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// ── Product SKUs ──────────────────────────────────────────────────────────────

export async function listProductSkus(req, res, next) {
  try {
    const { productId } = req.params;
    const skus = await fetchSkusByProduct(productId);
    res.json(skus);
  } catch (err) {
    next(err);
  }
}

export async function getProductSku(req, res, next) {
  try {
    const { productId, skuId } = req.params;
    const sku = await fetchSkuById(productId, skuId);
    if (!sku) {
      return res.status(404).json({ message: 'SKU not found.' });
    }
    res.json(sku);
  } catch (err) {
    next(err);
  }
}

export async function createProductSku(req, res, next) {
  try {
    const { productId } = req.params;
    const sku = await insertSku(productId, req.body);
    res.status(201).json(sku);
  } catch (err) {
    next(err);
  }
}

export async function updateProductSku(req, res, next) {
  try {
    const { productId, skuId } = req.params;
    const sku = await modifySku(productId, skuId, req.body);
    if (!sku) {
      return res.status(404).json({ message: 'SKU not found.' });
    }
    res.json(sku);
  } catch (err) {
    next(err);
  }
}

export async function deleteProductSku(req, res, next) {
  try {
    const { productId, skuId } = req.params;
    await removeSku(productId, skuId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// ── Product Images ────────────────────────────────────────────────────────────

export async function listProductImages(req, res, next) {
  try {
    const { productId } = req.params;
    const images = await fetchImagesByProduct(productId);
    res.json(images);
  } catch (err) {
    next(err);
  }
}

export async function addProductImage(req, res, next) {
  try {
    const { productId } = req.params;
    const image = await insertProductImage(productId, req.body);
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
}

export async function deleteProductImage(req, res, next) {
  try {
    const { productId, imageId } = req.params;
    await removeProductImage(productId, imageId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function listCategories(req, res, next) {
  try {
    const categories = await fetchCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const category = await fetchCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryProducts(req, res, next) {
  try {
    const { categoryId } = req.params;
    const { page, limit, sort } = req.query;
    const result = await fetchProductsByCategory(categoryId, { page, limit, sort });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await insertCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const category = await modifyCategory(categoryId, req.body);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    await removeCategory(categoryId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// ── Brands ────────────────────────────────────────────────────────────────────

export async function listBrands(req, res, next) {
  try {
    const brands = await fetchBrands();
    res.json(brands);
  } catch (err) {
    next(err);
  }
}

export async function getBrand(req, res, next) {
  try {
    const { brandId } = req.params;
    const brand = await fetchBrandById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

export async function createBrand(req, res, next) {
  try {
    const brand = await insertBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
}

export async function updateBrand(req, res, next) {
  try {
    const { brandId } = req.params;
    const brand = await modifyBrand(brandId, req.body);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

export async function deleteBrand(req, res, next) {
  try {
    const { brandId } = req.params;
    await removeBrand(brandId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
