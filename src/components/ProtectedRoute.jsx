import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // O Firebase verifica o cofre para ver se o usuário tem a "chave" válida
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Enquanto o Firebase pensa, mostramos uma tela de carregamento simples
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Carregando painel...</p>
      </div>
    );
  }

  if (!user) {
    // Se não tiver usuário logado, manda de volta pra raiz (Login)
    return <Navigate to="/" />;
  }

  // Se passou por tudo, renderiza a tela que o usuário pediu (o Layout)
  return children;
}
