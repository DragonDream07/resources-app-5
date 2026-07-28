# Shop Frontend

React + Vite frontend for the Shop e-commerce platform.

## Prerequisites

- Node.js >= 18
- npm >= 9
- Backend API server running (see root `docker-compose.yml`)

## Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values
# Then start the dev server
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `http://localhost:4000` | Backend API base URL |
| `VITE_APP_ENV` | No | `development` | App environment name |
| `VITE_STRIPE_PUBLISHABLE_KEY` | No | — | Stripe publishable key for payments |
| `VITE_ENABLE_GUEST_CHECKOUT` | No | `true` | Toggle guest checkout feature |

All Vite env vars must be prefixed with `VITE_` to be exposed to the browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Design Tokens

Design tokens are defined in `src/config/tailwind.config.js` and extended in the root `tailwind.config.js`.

### Usage

Use Tailwind utility classes throughout components. The token extensions provide:

- **Colors** — brand palette, semantic colours (success, warning, error, info)
- **Typography** — font families, sizes, weights
- **Spacing** — consistent spacing scale
- **Border radius** — component-level radius tokens
- **Shadows** — elevation scale

Example:

```jsx
<button className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-md">
  Add to Cart
</button>
```

Helper utilities `clsx` and `tailwind-merge` are available for conditional and merged class names:

```jsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));
```

## Route Map

### Public Routes

| Path | Page | Description |
|---|---|---|
| `/` | `Home` | Homepage |
| `/products` | `ProductListing` | All products |
| `/categories/:categoryId` | `CategoryProductListing` | Products by category |
| `/search` | `SearchResults` | Search results |
| `/products/:productId` | `ProductDetail` | Product detail |
| `/cart` | `Cart` | Shopping cart |

### Auth Routes (guests only)

| Path | Page | Description |
|---|---|---|
| `/auth/login` | `Login` | Login |
| `/auth/register` | `Register` | Registration |
| `/auth/forgot-password` | `ForgotPassword` | Forgot password |
| `/auth/reset-password` | `ResetPassword` | Reset password |

### Checkout Routes

| Path | Page | Description |
|---|---|---|
| `/checkout/address` | `CheckoutAddress` | Address step |
| `/checkout/review` | `CheckoutReview` | Review order |
| `/checkout/payment` | `CheckoutPayment` | Payment step |
| `/checkout/confirmation` | `CheckoutConfirmation` | Order confirmation |
| `/checkout/guest-register` | `GuestPostCheckoutRegister` | Post-checkout guest registration |

### Account Routes (authenticated users)

| Path | Page | Description |
|---|---|---|
| `/account` | `AccountOverview` | Account dashboard |
| `/account/profile` | `AccountProfile` | Profile settings |
| `/account/addresses` | `AccountAddresses` | Saved addresses |
| `/account/addresses/new` | `AddressNew` | Add address |
| `/account/addresses/:addressId/edit` | `AddressEdit` | Edit address |
| `/account/orders` | `OrderHistory` | Order history |
| `/account/orders/:orderId` | `OrderDetail` | Order detail |
| `/account/orders/:orderId/return` | `ReturnRequest` | Request return |
| `/account/notifications` | `Notifications` | Notifications |

### Admin Routes (admin role required)

| Path | Page | Description |
|---|---|---|
| `/admin` | `AdminDashboard` | Admin dashboard |
| `/admin/reports` | `AdminReports` | Reports |
| `/admin/orders` | `AdminOrderList` | Order management |
| `/admin/orders/:orderId` | `AdminOrderDetail` | Order detail |
| `/admin/catalogue/products` | `AdminProductList` | Product management |
| `/admin/catalogue/products/new` | `AdminProductNew` | Create product |
| `/admin/catalogue/products/:productId/edit` | `AdminProductEdit` | Edit product |
| `/admin/catalogue/categories` | `AdminCategoryList` | Category management |
| `/admin/catalogue/categories/new` | `AdminCategoryNew` | Create category |
| `/admin/catalogue/categories/:categoryId/edit` | `AdminCategoryEdit` | Edit category |
| `/admin/catalogue/brands` | `AdminBrandList` | Brand management |
| `/admin/catalogue/brands/new` | `AdminBrandNew` | Create brand |
| `/admin/catalogue/brands/:brandId/edit` | `AdminBrandEdit` | Edit brand |
| `/admin/promotions` | `AdminPromotionList` | Promotions |
| `/admin/promotions/new` | `AdminPromotionNew` | Create promotion |
| `/admin/promotions/:promoId/edit` | `AdminPromotionEdit` | Edit promotion |
| `/admin/returns` | `AdminReturnList` | Returns management |
| `/admin/returns/:returnRequestId` | `AdminReturnDetail` | Return detail |
| `/admin/users` | `AdminUserList` | User management |
| `/admin/users/:userId` | `AdminUserDetail` | User detail |

## API Client

All API calls go through `src/api/` modules which use `axios` with the base URL from `VITE_API_BASE_URL`. In development, Vite proxies `/api` requests to the backend server to avoid CORS issues.

## Testing

Tests use Jest + `@testing-library/react`. Configuration is in `jest.config.cjs` and `babel.config.cjs` at the project root.

```bash
npm test
```

## Project Structure

```
src/
  api/          # Axios API client modules
  assets/       # Static images and icons
  components/   # Shared UI components
  config/       # App and Tailwind config
  hooks/        # Custom React hooks
  pages/        # Route-level page components
  routes/       # React Router route guards
  store/        # Global state (context / zustand)
  utils/        # Utility functions
  App.jsx
  main.jsx
  index.css
```
