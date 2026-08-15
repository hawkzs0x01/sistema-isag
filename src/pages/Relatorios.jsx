import { useState, useEffect, useMemo } from "react";
import { Printer, TrendingUp, TrendingDown, Users, Filter, Package, ArrowDownToLine } from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Relatorios() {
  const [familias, setFamilias] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);

  const [tipoRelatorio, setTipoRelatorio] = useState("Completo");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    const unFam = onSnapshot(query(collection(db, "familias"), orderBy("dataCadastro", "desc")), (snap) => {
      const lista = [];
      snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
      setFamilias(lista);
    });
    
    const unEnt = onSnapshot(query(collection(db, "entradas"), orderBy("dataEntrada", "desc")), (snap) => {
      const lista = [];
      snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
      setEntradas(lista);
    });

    const unSai = onSnapshot(query(collection(db, "doacoes"), orderBy("dataDoacao", "desc")), (snap) => {
      const lista = [];
      snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() }));
      setSaidas(lista);
    });

    return () => { unFam(); unEnt(); unSai(); };
  }, []);

  const dadosFiltrados = useMemo(() => {
    const filtrarPorData = (lista, campoData) => {
      return lista.filter(item => {
        if (!dataInicio && !dataFim) return true;
        const dataItem = new Date(item[campoData]).getTime();
        const inicio = dataInicio ? new Date(dataInicio + 'T00:00:00').getTime() : 0;
        const fim = dataFim ? new Date(dataFim + 'T23:59:59').getTime() : Infinity;
        return dataItem >= inicio && dataItem <= fim;
      });
    };
    return {
      familias: filtrarPorData(familias, 'dataCadastro'),
      entradas: filtrarPorData(entradas, 'dataEntrada'),
      saidas: filtrarPorData(saidas, 'dataDoacao')
    };
  }, [familias, entradas, saidas, dataInicio, dataFim]);

  const handleImprimir = () => window.print();

  const formatarData = (dataIso) => {
    if (!dataIso) return "-";
    return new Date(dataIso).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto print:max-w-full print:space-y-6 print:m-0 print:p-0">
      
      {/* CABEÇALHO DE TELA E FILTROS */}
      <div className="space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Relatórios Gerenciais</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Gere extratos detalhados para prestação de contas.</p>
          </div>
          <Button onClick={handleImprimir} className="gap-2 bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm">
            <Printer size={16} />
            Imprimir Relatório
          </Button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium text-slate-700"><Filter size={14}/> Tipo de Relatório</Label>
            <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
              <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Completo">Resumo Geral (Completo)</SelectItem>
                <SelectItem value="Entradas">Apenas Entradas (Recebimentos)</SelectItem>
                <SelectItem value="Saidas">Apenas Saídas (Doações)</SelectItem>
                <SelectItem value="Familias">Famílias Cadastradas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-medium text-slate-700">Data Inicial (Opcional)</Label>
            <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="rounded-lg text-slate-700" />
          </div>
          <div className="space-y-2">
            <Label className="font-medium text-slate-700">Data Final (Opcional)</Label>
            <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="rounded-lg text-slate-700" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full rounded-lg" onClick={() => { setDataInicio(""); setDataFim(""); }}>
              Limpar Datas
            </Button>
          </div>
        </div>
      </div>

      {/* CABEÇALHO DO DOCUMENTO (Impressão) */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase">Instituto Solidário</h1>
        <p className="text-slate-600 font-medium">Relatório Oficial: {tipoRelatorio === "Completo" ? "Resumo Geral" : tipoRelatorio}</p>
        <p className="text-sm text-slate-500 mt-1">
          Período: {dataInicio ? formatarData(dataInicio) : "Início"} até {dataFim ? formatarData(dataFim) : "Hoje"}
        </p>
        <p className="text-xs text-slate-400 mt-1">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      {/* CARTÕES DE RESUMO (Exibidos se o relatório for Completo) */}
      {(tipoRelatorio === "Completo") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
          <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm print:shadow-none print:border-slate-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider print:text-slate-800">Famílias no Período</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 print:bg-transparent">
                <Users className="text-blue-600 print:text-slate-800" size={20} />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-4xl font-extrabold text-slate-900 print:text-2xl">{dadosFiltrados.familias.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm print:shadow-none print:border-slate-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider print:text-slate-800">Entradas (Recebimentos)</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 print:bg-transparent">
                <ArrowDownToLine className="text-emerald-600 print:text-slate-800" size={20} />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-4xl font-extrabold text-slate-900 print:text-2xl">{dadosFiltrados.entradas.length}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200/60 bg-white shadow-sm print:shadow-none print:border-slate-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider print:text-slate-800">Saídas (Entregas)</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 print:bg-transparent">
                <Package className="text-orange-600 print:text-slate-800" size={20} />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-4xl font-extrabold text-slate-900 print:text-2xl">{dadosFiltrados.saidas.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TABELA DE ENTRADAS */}
      {(tipoRelatorio === "Completo" || tipoRelatorio === "Entradas") && (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden print:border-slate-300 print:shadow-none">
          <div className="p-4 border-b border-slate-200/60 bg-slate-50/50 print:bg-transparent">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600 print:text-black" />
              Extrato de Entradas
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Data</TableHead>
                  <TableHead className="font-semibold text-slate-700">Parceiro / Origem</TableHead>
                  <TableHead className="font-semibold text-slate-700">Item</TableHead>
                  <TableHead className="font-semibold text-slate-700">Qtd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosFiltrados.entradas.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{formatarData(e.dataEntrada)}</TableCell>
                    <TableCell className="font-semibold">{e.nomeParceiro}</TableCell>
                    <TableCell>{e.tipoItem}</TableCell>
                    <TableCell>{e.quantidade}</TableCell>
                  </TableRow>
                ))}
                {dadosFiltrados.entradas.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-slate-500">Nenhum registro no período.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* TABELA DE SAÍDAS */}
      {(tipoRelatorio === "Completo" || tipoRelatorio === "Saidas") && (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden print:border-slate-300 print:shadow-none">
          <div className="p-4 border-b border-slate-200/60 bg-slate-50/50 print:bg-transparent">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingDown size={18} className="text-orange-600 print:text-black" />
              Extrato de Saídas (Doações Entregues)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Data</TableHead>
                  <TableHead className="font-semibold text-slate-700">Família Beneficiada</TableHead>
                  <TableHead className="font-semibold text-slate-700">Item</TableHead>
                  <TableHead className="font-semibold text-slate-700">Qtd</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosFiltrados.saidas.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{formatarData(s.dataDoacao)}</TableCell>
                    <TableCell className="font-semibold">{s.nomeRepresentante}</TableCell>
                    <TableCell>{s.tipoDoacao}</TableCell>
                    <TableCell>{s.quantidade}</TableCell>
                  </TableRow>
                ))}
                {dadosFiltrados.saidas.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-slate-500">Nenhum registro no período.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* TABELA DE FAMÍLIAS */}
      {(tipoRelatorio === "Familias") && (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden print:border-slate-300 print:shadow-none">
          <div className="p-4 border-b border-slate-200/60 bg-slate-50/50 print:bg-transparent">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-blue-600 print:text-black" />
              Relação de Famílias Assistidas
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Data Cadastro</TableHead>
                  <TableHead className="font-semibold text-slate-700">Representante</TableHead>
                  <TableHead className="font-semibold text-slate-700">Localização</TableHead>
                  <TableHead className="font-semibold text-slate-700">Membros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosFiltrados.familias.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{formatarData(f.dataCadastro)}</TableCell>
                    <TableCell className="font-semibold">{f.nomeRepresentante}</TableCell>
                    <TableCell>{f.bairro}, {f.cidade}</TableCell>
                    <TableCell>{f.quantidadeMembros}</TableCell>
                  </TableRow>
                ))}
                {dadosFiltrados.familias.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-slate-500">Nenhum registro no período.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      {/* RODAPÉ DE ASSINATURA (Impressão) */}
      <div className="hidden print:flex justify-between mt-20 pt-8">
        <div className="text-center w-64">
          <div className="border-b border-black mb-2"></div>
          <p className="text-sm font-semibold">Assinatura do Responsável</p>
          <p className="text-xs text-slate-500">Instituto Solidário</p>
        </div>
        <div className="text-center w-64">
          <div className="border-b border-black mb-2"></div>
          <p className="text-sm font-semibold">Conferido por</p>
        </div>
      </div>
    </div>
  );
}