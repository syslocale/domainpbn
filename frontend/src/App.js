import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Public Pages
import Homepage from './pages/Homepage';
import PackagesPage from './pages/PackagesPage';
import PBNPage from './pages/PBNPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import FAQPage from './pages/FAQPage';
import StaticPage from './pages/StaticPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PBNManagement from './pages/admin/PBNManagement';
import PackagesManagement from './pages/admin/PackagesManagement';
import BlogManagement from './pages/admin/BlogManagement';
import FAQManagement from './pages/admin/FAQManagement';
import PagesManagement from './pages/admin/PagesManagement';
import SettingsManagement from './pages/admin/SettingsManagement';

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
    <FloatingWhatsApp />
  </>
);

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Homepage /></PublicLayout>} />
          <Route path="/paket" element={<PublicLayout><PackagesPage /></PublicLayout>} />
          <Route path="/pbn" element={<PublicLayout><PBNPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogListPage /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogDetailPage /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><StaticPage /></PublicLayout>} />
          <Route path="/tos" element={<PublicLayout><StaticPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><StaticPage /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pbn" element={<PBNManagement />} />
            <Route path="packages" element={<PackagesManagement />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="faq" element={<FAQManagement />} />
            <Route path="pages" element={<PagesManagement />} />
            <Route path="settings" element={<SettingsManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
