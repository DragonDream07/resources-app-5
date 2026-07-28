import { Router } from 'express';
import { searchProducts, suggest } from './search.controller.js';
import { validateSearch, validateSuggest } from './search.validator.js';

const router = Router();

// GET /search — full-text search with faceted filters
router.get('/', validateSearch, searchProducts);

// GET /search/autocomplete — autocomplete / suggest
router.get('/autocomplete', validateSuggest, suggest);

export default router;
