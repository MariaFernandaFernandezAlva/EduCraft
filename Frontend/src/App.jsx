// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/common/ToastContainer";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Páginas Landing
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Quotation from "./pages/Quotation";
import Community from "./pages/Community";
import Services from "./pages/Services";

// Admin - Autenticación
import { useAdminAuth } from './hooks/useAdminAuth';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import ProtectedRoute from './components/Admin/ProtectedRoute';

// Admin - Servicios
import ServiciosPage from './pages/Admin/Servicios/ServiciosPage';
import ServicioDrawer from './pages/Admin/Servicios/ServicioDrawer';

// Admin - Proyectos
import ProyectosPage from './pages/Admin/Proyectos/ProyectosPage';
import AddProyecto from './pages/Admin/Proyectos/AddProyecto';
import EditProyecto from './pages/Admin/Proyectos/EditProyecto';

// Admin - Cotizaciones
import CotizacionesPage from './pages/Admin/Cotizaciones/CotizacionesPage';

// Admin - Historial
import HistorialPage from './pages/Admin/Historial/HistorialPage';

// Admin - Testimonios
import TestimoniosPage from './pages/Admin/Testimonios/TestimoniosPage';

export default function App() {
  const { isAuthenticated, loading } = useAdminAuth();

  return (
    <ToastProvider>
      <Router>
        
        {/* RUTAS DEL ADMIN - Sin Header/Footer */}
        <Routes>
          
          {/* Login Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Panel Admin Protegido */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/servicios" replace />} />
            <Route path="servicios" element={<ServiciosPage />}>
  <Route path="new" element={<ServicioDrawer />} />
  <Route path=":id/edit" element={<ServicioDrawer />} />
</Route>
            
            {/* Proyectos - Próximamente */}
            <Route path="proyectos" element={<ProyectosPage />} />
            <Route path="proyectos/new" element={<AddProyecto />} />
            <Route path="proyectos/:id/edit" element={<EditProyecto />} />
            
            {/* Cotizaciones - Próximamente */}
            <Route path="cotizaciones" element={<CotizacionesPage />} />
            <Route path="historial" element={<HistorialPage />} />
            {/* <Route path="cotizaciones" element={<CotizacionesPage />} /> */}
            
            {/* Testimonios - Próximamente */}
            <Route path="testimonios" element={<TestimoniosPage />} />
          </Route>

          {/* RUTAS DE LA LANDING - Con Header/Footer */}
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                {/* Header Global */}
                <Header />
                {/* Main Content */}
                <div className="grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/quotation" element={<Quotation />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/services" element={<Services />} />
                  </Routes>
                </div>
                {/* Footer Global */}
                <Footer />
                {/* Toast Container */}
                <ToastContainer />
              </div>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}