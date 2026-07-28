import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';

// Layouts
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// Public / Guest pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

// Auth pages (guest-only)
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Protected (authenticated user) pages
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutReviewPage = lazy(() => import('@/pages/checkout/CheckoutReviewPage'));
const CheckoutAddressPage = lazy(() => import('@/pages/checkout/CheckoutAddressPage'));
const CheckoutPlaceOrderPage = lazy(() => import('@/pages/checkout/CheckoutPlaceOrderPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const OrdersPage = lazy(() => import('@/pages/orders/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/orders/OrderDetailPage'));
const OrderTimelinePage = lazy(() => import('@/pages/orders/OrderTimelinePage'));
const OrderTrackingPage = lazy(() => import('@/pages/orders/OrderTrackingPage'));
const ReturnRequestPage = lazy(() => import('@/pages/returns/ReturnRequestPage'));
const ReturnRequestDetailPage = lazy(() => import('@/pages/returns/ReturnRequestDetailPage'));
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'));
const AddressesPage = lazy(() => import('@/pages/account/AddressesPage'));
const AddressDetailPage = lazy(() => import('@/pages/account/AddressDetailPage'));
const ChangePasswordPage = lazy(() => import('@/pages/account/ChangePasswordPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminProductFormPage = lazy(() => import('@/pages/admin/AdminProductFormPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminBrandsPage = lazy(() => import('@/pages/admin/AdminBrandsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('@/pages/admin/AdminOrderDetailPage'));
const AdminReturnsPage = lazy(() => import('@/pages/admin/AdminReturnsPage'));
const AdminReturnDetailPage = lazy(() => import('@/pages/admin/AdminReturnDetailPage'));
const AdminPromoCodesPage = lazy(() => import('@/pages/admin/AdminPromoCodesPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));

const fallback = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Loading…
  </div>
);

const withSuspense = (element) => <Suspense fallback={fallback}>{element}</Suspense>;

const router = createBrowserRouter([
  {
    // Guest-only routes (redirect to / if already authenticated)
    element: withSuspense(<GuestRoute />),
    children: [
      {
        element: withSuspense(<AuthLayout />),
        children: [
          { path: '/login', element: withSuspense(<LoginPage />) },
          { path: '/register', element: withSuspense(<RegisterPage />) },
          { path: '/forgot-password', element: withSuspense(<ForgotPasswordPage />) },
          { path: '/reset-password', element: withSuspense(<ResetPasswordPage />) },
        ],
      },
    ],
  },
  {
    // Public routes accessible to everyone
    element: withSuspense(<MainLayout />),
    children: [
      { path: '/', element: withSuspense(<HomePage />) },
      { path: '/search', element: withSuspense(<SearchPage />) },
      { path: '/products/:productId', element: withSuspense(<ProductDetailPage />) },
      { path: '/categories/:categoryId', element: withSuspense(<CategoryPage />) },
      { path: '/403', element: withSuspense(<ForbiddenPage />) },
      { path: '/404', element: withSuspense(<NotFoundPage />) },

      // Protected (authenticated) routes nested under MainLayout
      {
        element: withSuspense(<ProtectedRoute />),
        children: [
          { path: '/cart', element: withSuspense(<CartPage />) },
          { path: '/checkout/review', element: withSuspense(<CheckoutReviewPage />) },
          { path: '/checkout/address', element: withSuspense(<CheckoutAddressPage />) },
          { path: '/checkout/place-order', element: withSuspense(<CheckoutPlaceOrderPage />) },
          { path: '/payment', element: withSuspense(<PaymentPage />) },
          { path: '/orders', element: withSuspense(<OrdersPage />) },
          { path: '/orders/:orderId', element: withSuspense(<OrderDetailPage />) },
          { path: '/orders/:orderId/timeline', element: withSuspense(<OrderTimelinePage />) },
          { path: '/orders/:orderId/tracking', element: withSuspense(<OrderTrackingPage />) },
          { path: '/orders/:orderId/return-requests', element: withSuspense(<ReturnRequestPage />) },
          { path: '/return-requests/:returnRequestId', element: withSuspense(<ReturnRequestDetailPage />) },
          { path: '/account/profile', element: withSuspense(<ProfilePage />) },
          { path: '/account/addresses', element: withSuspense(<AddressesPage />) },
          { path: '/account/addresses/:addressId', element: withSuspense(<AddressDetailPage />) },
          { path: '/account/change-password', element: withSuspense(<ChangePasswordPage />) },
          { path: '/notifications', element: withSuspense(<NotificationsPage />) },
        ],
      },

      // Catch-all
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
  {
    // Admin routes
    element: withSuspense(<AdminRoute />),
    children: [
      {
        element: withSuspense(<AdminLayout />),
        children: [
          { path: '/admin', element: withSuspense(<AdminDashboardPage />) },
          { path: '/admin/products', element: withSuspense(<AdminProductsPage />) },
          { path: '/admin/products/new', element: withSuspense(<AdminProductFormPage />) },
          { path: '/admin/products/:productId/edit', element: withSuspense(<AdminProductFormPage />) },
          { path: '/admin/categories', element: withSuspense(<AdminCategoriesPage />) },
          { path: '/admin/brands', element: withSuspense(<AdminBrandsPage />) },
          { path: '/admin/orders', element: withSuspense(<AdminOrdersPage />) },
          { path: '/admin/orders/:orderId', element: withSuspense(<AdminOrderDetailPage />) },
          { path: '/admin/returns', element: withSuspense(<AdminReturnsPage />) },
          { path: '/admin/returns/:returnRequestId', element: withSuspense(<AdminReturnDetailPage />) },
          { path: '/admin/promo-codes', element: withSuspense(<AdminPromoCodesPage />) },
          { path: '/admin/reports', element: withSuspense(<AdminReportsPage />) },
        ],
      },
    ],
  },
]);

export default router;
