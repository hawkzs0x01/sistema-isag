import { useState, useEffect } from "react";
import { Plus, ArrowDownToLine, Calendar, Tag } from "lucide-react";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export default function Entradas() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [entradas, setEntradas] = useState([]);
  const [parceiros, setParceiros] = useState([]);

  const [parceiroId, setParceiroId] = useState("");
  const [tipoItem, setTipoItem] = useState("Cesta Básica");
  const [quantidade, setQuantidade] = useState("1");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    const qEntradas = query(collection(db, "entradas"), orderBy("dataEntrada", "desc"));
    const unsubscribeEntradas = onSnapshot(qEntradas, (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
      setEntradas(lista);
    });
    return () => unsubscribeEntradas();
  }, []);

  useEffect(() => {
    const qParceiros = query(collection(db, "parceiros"), orderBy("nome", "asc"));
    const unsubscribeParceiros = onSnapshot(qParceiros, (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => {
        lista.push({ id: String(doc.id), nome: doc.data().nome });
      });
      setParceiros(lista);
    });
    return () => unsubscribeParceiros();
  }, []);

  const abrirModalNovo = () => {
    setParceiroId("");
    setTipoItem("Cesta Básica");
    setQuantidade("1");
    setObservacao("");
    setOpen(true);
  };

  const handleSalvarEntrada = async (e) => {
    e.preventDefault();
    if (!parceiroId) {
      toast.error("Segurança: Por favor, selecione um parceiro doador.");
      return;
    }
    setLoading(true);
    try {
      const parceiroSelecionado = parceiros.find(p => p.id === parceiroId);
      await addDoc(collection(db, "entradas"), {
        parceiroId: parceiroId,
        nomeParceiro: parceiroSelecionado.nome,
        tipoItem: tipoItem,
        quantidade: Number(quantidade),
        observacao: observacao,
        dataEntrada: new Date().toISOString()
      });
      setOpen(false);
      toast.success("Recebimento registrado com sucesso!");
    } catch (error) {
      toast.error("Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Registro de Entradas</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Controle de tudo o que a ONG recebe de doação.</p>
        </div>
        
        <Button onClick={abrirModalNovo} className="gap-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">
          <ArrowDownToLine size={16} />
          Registrar Recebimento
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">Registrar Nova Entrada</DialogTitle>
              <DialogDescription className="text-slate-500">
                Informe qual parceiro fez a doação e o que foi recebido.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSalvarEntrada} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="font-medium text-slate-700">Parceiro / Doador</Label>
                <Select value={parceiroId} onValueChange={setParceiroId}>
                  <SelectTrigger className="rounded-lg text-left">
                    {/* HACK DE UI: Força a renderização manual do nome, evitando o bug do Radix */}
                    <span className="truncate">
                      {parceiroId ? parceiros.find(p => p.id === parceiroId)?.nome : "Selecione quem doou..."}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {parceiros.map((parceiro) => (
                      <SelectItem key={parceiro.id} value={parceiro.id}>{parceiro.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-slate-700">Tipo de Item</Label>
                <Select value={tipoItem} onValueChange={setTipoItem}>
                  <SelectTrigger className="rounded-lg">
                    <span className="truncate">{tipoItem}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cesta Básica">Cesta Básica</SelectItem>
                    <SelectItem value="Roupas/Calçados">Roupas / Calçados</SelectItem>
                    <SelectItem value="Móveis/Eletrodomésticos">Móveis / Eletrodomésticos</SelectItem>
                    <SelectItem value="Itens Avulsos">Itens Avulsos (Alimentos soltos)</SelectItem>
                    <SelectItem value="Dinheiro/PIX">Dinheiro / PIX</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade" className="font-medium text-slate-700">Quantidade / Valor</Label>
                <Input id="quantidade" type="number" required min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacao" className="font-medium text-slate-700">Observação (Opcional)</Label>
                <Input id="observacao" placeholder="Ex: 50kg de arroz..." value={observacao} onChange={(e) => setObservacao(e.target.value)} className="rounded-lg" />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg h-11 font-medium" disabled={loading}>
                {loading ? "Registrando..." : "Confirmar Recebimento"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700">Data</TableHead>
                <TableHead className="font-semibold text-slate-700">Doador (Origem)</TableHead>
                <TableHead className="font-semibold text-slate-700">Item Recebido</TableHead>
                <TableHead className="font-semibold text-slate-700">Qtd</TableHead>
                <TableHead className="font-semibold text-slate-700">Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ArrowDownToLine size={32} className="text-slate-300" />
                      <p>Nenhum recebimento registrado ainda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                entradas.map((entrada) => (
                  <TableRow key={entrada.id} className="transition-colors hover:bg-slate-50/80">
                    <TableCell className="font-medium text-slate-600 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400"/>
                      {formatarData(entrada.dataEntrada)}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">{entrada.nomeParceiro}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Tag size={14} className="text-slate-400"/>
                        {entrada.tipoItem}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide">
                        {entrada.quantidade}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{entrada.observacao || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}