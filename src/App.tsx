import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/ui/ProtectedRoute'

import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import CatalogPage from './pages/public/CatalogPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import LoginPage from './pages/public/LoginPage'
import SignUpPage from './pages/public/SignUpPage'

import DashboardPage from './pages/buyer/DashboardPage'
import EnquiryPage from './pages/buyer/EnquiryPage'
import EnquirySuccessPage from './pages/buyer/EnquirySuccessPage'
import ProfilePage from './pages/buyer/ProfilePage'

import AdminOverview from './pages/admin/AdminOverview'
import AdminProducts from './pages/admin/AdminProducts'
import AdminEnquiries from './pages/admin/AdminEnquiries'
import AdminBuyers from './pages/admin/AdminBuyers'
import AdminCategories from './pages/admin/AdminCategories'

export default function App() {
  const { initialize } = useAuthStore()

  useEffect(() => { initialize() }, [])

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:slug" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Buyer routes */}
        <Route path="/dashboard" element={<ProtectedRoute requireBuyer><DashboardPage /></ProtectedRoute>} />
        <Route path="/enquiry" element={<ProtectedRoute requireBuyer><EnquiryPage /></ProtectedRoute>} />
        <Route path="/enquiry/success" element={<ProtectedRoute requireBuyer><EnquirySuccessPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requireBuyer><ProfilePage /></ProtectedRoute>} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="enquiries/:id" element={<AdminEnquiries />} />
        <Route path="buyers" element={<AdminBuyers />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
