import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, HeartHandshake, Package, LogOut, ArrowDownToLine, FileText, Menu, X } from "lucide-react"; 
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation(); // Usado para saber a página atual
  const [menuAberto, setMenuAberto] = useState(false);

  // Fecha o menu mobile automaticamente ao clicar em um link
  useEffect(() => {
    setMenuAberto(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao tentar sair:", error);
    }
  };

  return (
    // Fundo ligeiramente mais escuro para dar contraste aos cartões brancos
    <div className="flex min-h-screen bg-slate-100 print:bg-white font-sans">
      
      {/* BARRA SUPERIOR MOBILE (Aparece apenas em telas pequenas) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-40 print:hidden shadow-md">
        <span className="font-bold text-lg">Instituto Solidário</span>
        <button onClick={() => setMenuAberto(!menuAberto)} className="p-2 bg-slate-800 rounded-md">
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY ESCURO NO MOBILE (Para fechar o menu ao clicar fora) */}
      {menuAberto && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden print:hidden" 
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* MENU LATERAL (Responsivo) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col 
        transition-transform duration-300 ease-in-out print:hidden shadow-2xl md:shadow-none
        ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 text-xl font-extrabold text-white border-b border-slate-800 tracking-tight hidden md:block">
          Instituto Solidário
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto mt-16 md:mt-0">
          <Link to="/dashboard" className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium ${location.pathname === '/dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          
          <Link to="/familias" className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium ${location.pathname === '/familias' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Users size={20} />
            Famílias
          </Link>
          
          <Link to="/entradas" className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium ${location.pathname === '/entradas' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <ArrowDownToLine size={20} />
            Entradas (Estoque)
          </Link>
          
          <Link to="/doacoes" className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium ${location.pathname === '/doacoes' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Package size={20} />
            Saídas (Doações)
          </Link>
          
          <Link to="/parceiros" className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium ${location.pathname === '/parceiros' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <HeartHandshake size={20} />
            Parceiros
          </Link>

          <Link to="/relatorios" className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium mt-4 border-t border-slate-800 pt-6 ${location.pathname === '/relatorios' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <FileText size={20} />
            Relatórios
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 p-3 rounded-lg hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition-colors font-medium"
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 print:p-0 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}