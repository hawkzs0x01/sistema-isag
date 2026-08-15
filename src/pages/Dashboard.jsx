import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Users, Package, ArrowDownToLine, TrendingUp, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [metricas, setMetricas] = useState({
    familias: 0,
    pessoas: 0,
    entradas: 0,
    saidas: 0
  });

  const [dadosGrafico, setDadosGrafico] = useState([
    { name: 'Entradas', quantidade: 0 },
    { name: 'Saídas', quantidade: 0 },
  ]);

  useEffect(() => {
    // Escuta Famílias e SOMA a quantidade de membros para o requisito da FECAF
    const unFamilias = onSnapshot(collection(db, "familias"), (snap) => {
      let totalPessoas = 0;
      snap.forEach(doc => {
        totalPessoas += Number(doc.data().quantidadeMembros) || 0;
      });
      setMetricas(prev => ({ ...prev, familias: snap.size, pessoas: totalPessoas }));
    });

    const unEntradas = onSnapshot(collection(db, "entradas"), (snap) => {
      setMetricas(prev => ({ ...prev, entradas: snap.size }));
      setDadosGrafico(prev => [
        { name: 'Entradas', quantidade: snap.size },
        prev[1]
      ]);
    });

    const unSaidas = onSnapshot(collection(db, "doacoes"), (snap) => {
      setMetricas(prev => ({ ...prev, saidas: snap.size }));
      setDadosGrafico(prev => [
        prev[0],
        { name: 'Saídas', quantidade: snap.size }
      ]);
    });

    return () => {
      unFamilias();
      unEntradas();
      unSaidas();
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">
          Visão geral do Instituto Solidário em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium text-slate-500">Famílias Assistidas</CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Home className="text-blue-600" size={22} />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-4xl font-bold text-slate-900">{metricas.familias}</div>
            <p className="text-sm text-slate-400 mt-1">Cadastros ativos</p>
          </CardContent>
        </Card>

        {/* Novo Cartão: Pessoas Impactadas (Requisito FECAF) */}
        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium text-slate-500">Pessoas Impactadas</CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <Users className="text-indigo-600" size={22} />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-4xl font-bold text-slate-900">{metricas.pessoas}</div>
            <p className="text-sm text-slate-400 mt-1">Membros beneficiados</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium text-slate-500">Total de Entradas</CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <ArrowDownToLine className="text-emerald-600" size={22} />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-4xl font-bold text-slate-900">{metricas.entradas}</div>
            <p className="text-sm text-slate-400 mt-1">Recebimentos registrados</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium text-slate-500">Total de Saídas</CardTitle>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <Package className="text-orange-600" size={22} />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-4xl font-bold text-slate-900">{metricas.saidas}</div>
            <p className="text-sm text-slate-400 mt-1">Doações entregues</p>
          </CardContent>
        </Card>

      </div>

      <Card className="col-span-1 rounded-2xl border-slate-200/60 shadow-sm bg-white">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-slate-400" />
            Fluxo Geral (Entradas vs Saídas)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 14}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 13}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    fontWeight: '500'
                  }}
                />
                <Bar dataKey="quantidade" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}