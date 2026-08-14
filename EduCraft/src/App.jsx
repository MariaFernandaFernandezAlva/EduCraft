import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/common/ToastContainer";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Quotation from "./pages/Quotation";
import Community from "./pages/Community";
import Services from "./pages/Services";

export default function App() {
  return (
    <ToastProvider>
      <Router>
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
      </Router>
    </ToastProvider>
  );
}