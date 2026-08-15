import { useState, useEffect } from "react";
import { Plus, Package, Calendar, Tag } from "lucide-react";
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

export default function Doacoes() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [doacoes, setDoacoes] = useState([]);
  const [familias, setFamilias] = useState([]);

  const [familiaId, setFamiliaId] = useState("");
  const [tipoDoacao, setTipoDoacao] = useState("Cesta Básica");
  const [quantidade, setQuantidade] = useState("1");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    const qDoacoes = query(collection(db, "doacoes"), orderBy("dataDoacao", "desc"));
    const unsubscribeDoacoes = onSnapshot(qDoacoes, (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
      setDoacoes(lista);
    });
    return () => unsubscribeDoacoes();
  }, []);

  useEffect(() => {
    const qFamilias = query(collection(db, "familias"), orderBy("nomeRepresentante", "asc"));
    const unsubscribeFamilias = onSnapshot(qFamilias, (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => {
        if (doc.data().status === "Ativa") {
          lista.push({ id: String(doc.id), nome: doc.data().nomeRepresentante });
        }
      });
      setFamilias(lista);
    });
    return () => unsubscribeFamilias();
  }, []);

  const abrirModalNovo = () => {
    setFamiliaId("");
    setTipoDoacao("Cesta Básica");
    setQuantidade("1");
    setObservacao("");
    setOpen(true);
  };

  const handleSalvarDoacao = async (e) => {
    e.preventDefault();
    if (!familiaId) {
      toast.error("Segurança: Por favor, selecione uma família assistida.");
      return;
    }
    setLoading(true);
    try {
      const familiaSelecionada = familias.find(f => f.id === familiaId);
      await addDoc(collection(db, "doacoes"), {
        familiaId: familiaId,
        nomeRepresentante: familiaSelecionada.nome,
        tipoDoacao: tipoDoacao,
        quantidade: Number(quantidade),
        observacao: observacao,
        dataDoacao: new Date().toISOString()
      });
      setOpen(false);
      toast.success("Entrega registrada com sucesso!");
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Registro de Saídas / Doações</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Controle de tudo o que é entregue às famílias.</p>
        </div>
        
        <Button onClick={abrirModalNovo} className="gap-2 bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm">
          <Package size={16} />
          Nova Entrega
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">Registrar Saída de Doação</DialogTitle>
              <DialogDescription className="text-slate-500">
                Informe qual família está recebendo e o tipo de doação.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSalvarDoacao} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="font-medium text-slate-700">Família Beneficiada</Label>
                <Select value={familiaId} onValueChange={setFamiliaId}>
                  <SelectTrigger className="rounded-lg text-left">
                    <span className="truncate">
                      {familiaId ? familias.find(f => f.id === familiaId)?.nome : "Selecione a família..."}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {familias.map((familia) => (
                      <SelectItem key={familia.id} value={familia.id}>{familia.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-slate-700">Tipo de Item</Label>
                <Select value={tipoDoacao} onValueChange={setTipoDoacao}>
                  <SelectTrigger className="rounded-lg">
                    <span className="truncate">{tipoDoacao}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cesta Básica">Cesta Básica</SelectItem>
                    <SelectItem value="Roupas/Calçados">Roupas / Calçados</SelectItem>
                    <SelectItem value="Móveis/Eletrodomésticos">Móveis / Eletrodomésticos</SelectItem>
                    <SelectItem value="Itens Avulsos">Itens Avulsos (Alimentos soltos)</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade" className="font-medium text-slate-700">Quantidade (Volumes/Unidades)</Label>
                <Input id="quantidade" type="number" required min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacao" className="font-medium text-slate-700">Observação (Opcional)</Label>
                <Input id="observacao" placeholder="Ex: Cesta montada na ONG..." value={observacao} onChange={(e) => setObservacao(e.target.value)} className="rounded-lg" />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg h-11 font-medium" disabled={loading}>
                {loading ? "Registrando..." : "Confirmar Entrega"}
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
                <TableHead className="font-semibold text-slate-700">Família</TableHead>
                <TableHead className="font-semibold text-slate-700">Item Doado</TableHead>
                <TableHead className="font-semibold text-slate-700">Qtd</TableHead>
                <TableHead className="font-semibold text-slate-700">Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package size={32} className="text-slate-300" />
                      <p>Nenhuma entrega registrada ainda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                doacoes.map((doacao) => (
                  <TableRow key={doacao.id} className="transition-colors hover:bg-slate-50/80">
                    <TableCell className="font-medium text-slate-600 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400"/>
                      {formatarData(doacao.dataDoacao)}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">{doacao.nomeRepresentante}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Tag size={14} className="text-slate-400"/>
                        {doacao.tipoDoacao}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide">
                        {doacao.quantidade}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{doacao.observacao || "-"}</TableCell>
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