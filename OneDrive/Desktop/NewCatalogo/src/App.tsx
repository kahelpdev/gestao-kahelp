import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/admin/Login";
import AdminSetup from "./pages/admin/AdminSetup";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProdutos from "./pages/admin/AdminProdutos";
import AdminCarrossel from "./pages/admin/AdminCarrossel";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminPagamentos from "./pages/admin/AdminPagamentos";
import AdminWhatsapp from "./pages/admin/AdminWhatsapp";
import AdminMarca from "./pages/admin/AdminMarca";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Catálogo público */}
              <Route path="/" element={<Index />} />

              {/* Login e setup admin */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/setup" element={<AdminSetup />} />

              {/* Painel admin com layout e sidebar */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="produtos" element={<AdminProdutos />} />
                <Route path="carrossel" element={<AdminCarrossel />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="pagamentos" element={<AdminPagamentos />} />
                <Route path="whatsapp" element={<AdminWhatsapp />} />
                <Route path="marca" element={<AdminMarca />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
