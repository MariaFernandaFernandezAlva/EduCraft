// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AddServicio from './pages/Admin/Servicios/AddServicio';
import EditServicio from './pages/Admin/Servicios/EditServicio';

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
            <Route path="servicios" element={<ServiciosPage />} />
            <Route path="servicios/new" element={<AddServicio />} />
            <Route path="servicios/:id/edit" element={<EditServicio />} />
            
            {/* Proyectos - Próximamente */}
            {/* <Route path="proyectos" element={<ProyectosPage />} /> */}
            
            {/* Cotizaciones - Próximamente */}
            {/* <Route path="cotizaciones" element={<CotizacionesPage />} /> */}
            
            {/* Testimonios - Próximamente */}
            {/* <Route path="testimonios" element={<TestimoniosPage />} /> */}
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