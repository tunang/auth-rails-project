import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import AdminLayout from "@/layout/admin";
import HomePage from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Confirm from "@/pages/auth/confirm";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import MainLayout from "@/layout/main";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "@/layout/admin";
import { Role } from "@/types";
import BooksPage from "@/pages/admin/books/page";
import CategoriesPage from "@/pages/admin/categories/page";
// import Books from "@/pages/admin/books";
// import Categories from "@/pages/admin/categories";
// import Authors from "@/pages/admin/authors";
// import Orders from "@/pages/admin/orders";
// import Analytics from "@/pages/admin/analytics";
// import CategoryPage from "@/pages/category";
// import CategoryProductPage from "@/pages/category/CategoryProducts";
// import SearchResults from "@/pages/search/SearchResults";
// import BookDetail from "@/pages/books/BookDetail";
// import Cart from "@/pages/cart";
// import Address from "@/pages/address";
// import Checkout from "@/pages/checkout";
// import PaymentSuccessPage from "@/pages/payment/success";
// import PaymentCancelPage from "@/pages/payment/cancel";
// import OrderPage from "@/pages/order";
// import ProtectedRoute from "./ProtectedRoute";
// import { Role } from "@/types";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { 
        index: true,
        element: <HomePage />,
      },
      // {
      //   path: 'category',
      //   element: <CategoryPage  />,
      // },
      // {
      //   path: 'category/:id',
      //   element: <CategoryProductPage />,
      // },
      // {
      //   path: 'search',
      //   element: <SearchResults />,
      // },
      // {
      //   path: 'books/:id',
      //   element: <BookDetail />,
      // },
      // {
      //   path: 'cart',
      //   element: (
      //     <ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]}>
      //       <Cart />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'address',
      //   element: (
      //     <ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]}>
      //       <Address />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'checkout',
      //   element: (
      //     <ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]}>
      //       <Checkout />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'checkout/success',
      //   element: (
      //     <ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]}>
      //       <PaymentSuccessPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'checkout/cancel',
      //   element: (
      //     <ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]}>
      //       <PaymentCancelPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'orders',
      //   element: (
      //     <ProtectedRoute allowedRoles={[Role.USER, Role.ADMIN]}>
      //       <OrderPage />
      //     </ProtectedRoute>
      //   ),
      // }

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register", 
    element: <Register />,
  },
  {
    path: "/confirm",
    element: <Confirm />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword   />,
  },
  {
    path: "/reset",
    element: <ResetPassword />,
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
   
    children: [
      // {
      //   path: 'analytics',
      //   element: <Analytics />
      // },
      {
        path: 'books',
        element: <BooksPage />
      },
            {
        path: 'categories',
        element: <CategoriesPage />
      },
      // {
      //   path: 'authors',
      //   element: <Authors />
      // },
      // {
      //   path: 'orders',
      //   element: <Orders />
      // }
    ]
  }
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
