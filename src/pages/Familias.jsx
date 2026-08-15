import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
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

export default function Familias() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [familias, setFamilias] = useState([]);
  const [busca, setBusca] = useState("");
  
  const [familiaEditando, setFamiliaEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [membros, setMembros] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("Aparecida de Goiânia");

  useEffect(() => {
    const q = query(collection(db, "familias"), orderBy("dataCadastro", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setFamilias(lista);
    });
    return () => unsubscribe();
  }, []);

  const abrirModalNovo = () => {
    setNome("");
    setMembros("");
    setBairro("");
    setCidade("Aparecida de Goiânia");
    setFamiliaEditando(null);
    setOpen(true);
  };

  const abrirModalEdicao = (familia) => {
    setNome(familia.nomeRepresentante);
    setMembros(familia.quantidadeMembros.toString());
    setBairro(familia.bairro);
    setCidade(familia.cidade);
    setFamiliaEditando(familia.id);
    setOpen(true);
  };

  const handleExcluir = async (id) => {
    const confirmar = window.confirm("Segurança: Tem certeza que deseja excluir permanentemente este cadastro?");
    if (confirmar) {
      try {
        await deleteDoc(doc(db, "familias", id));
        toast.success("O cadastro da família foi removido com sucesso!");
      } catch (error) {
        toast.error("Erro ao tentar excluir o cadastro.");
      }
    }
  };

  const handleSalvarFamilia = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (familiaEditando) {
        const familiaRef = doc(db, "familias", familiaEditando);
        await updateDoc(familiaRef, {
          nomeRepresentante: nome,
          quantidadeMembros: Number(membros),
          bairro: bairro,
          cidade: cidade
        });
      } else {
        await addDoc(collection(db, "familias"), {
          nomeRepresentante: nome,
          quantidadeMembros: Number(membros),
          bairro: bairro,
          cidade: cidade,
          status: "Ativa",
          dataCadastro: new Date().toISOString()
        });
      }

      setOpen(false);
      toast.success(familiaEditando ? "Cadastro atualizado com sucesso!" : "Família cadastrada com sucesso!");
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const termoBusca = busca.toLowerCase().trim();
  const familiasFiltradas = familias.filter((familia) => {
    const nome = familia.nomeRepresentante?.toLowerCase() || "";
    const bairro = familia.bairro?.toLowerCase() || "";
    const cidade = familia.cidade?.toLowerCase() || "";
    return nome.includes(termoBusca) || bairro.includes(termoBusca) || cidade.includes(termoBusca);
  });

  return (
    // Aplicando a mesma largura máxima e alinhamento do Dashboard
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Cabeçalho Refinado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Famílias Assistidas</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Gerencie os cadastros das famílias beneficiadas.</p>
        </div>
        
        <Button onClick={abrirModalNovo} className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
          <Plus size={16} />
          Nova Família
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">
                {familiaEditando ? "Editar Cadastro" : "Cadastrar Nova Família"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Preencha os dados básicos do representante da família.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSalvarFamilia} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="font-medium text-slate-700">Nome do Representante</Label>
                <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="membros" className="font-medium text-slate-700">Quantidade de Membros</Label>
                <Input id="membros" type="number" required min="1" value={membros} onChange={(e) => setMembros(e.target.value)} className="rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro" className="font-medium text-slate-700">Bairro</Label>
                  <Input id="bairro" required value={bairro} onChange={(e) => setBairro(e.target.value)} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade" className="font-medium text-slate-700">Cidade</Label>
                  <Input id="cidade" required value={cidade} onChange={(e) => setCidade(e.target.value)} className="rounded-lg" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg h-11 font-medium" disabled={loading}>
                {loading ? "Salvando..." : (familiaEditando ? "Atualizar Cadastro" : "Salvar Cadastro")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Busca Refinada */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm transition-shadow focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <Search size={20} className="text-slate-400 ml-2" />
        <Input 
          placeholder="Buscar família por nome, bairro ou cidade..." 
          className="border-0 shadow-none focus-visible:ring-0 px-2 text-slate-700"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Container da Tabela com Responsividade Total (overflow-x-auto) e Design Arredondado */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700">Representante</TableHead>
                <TableHead className="font-semibold text-slate-700">Membros</TableHead>
                <TableHead className="font-semibold text-slate-700">Localização</TableHead> 
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familiasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={32} className="text-slate-300" />
                      <p>Nenhuma família encontrada.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                familiasFiltradas.map((familia) => (
                  <TableRow key={familia.id} className="transition-colors hover:bg-slate-50/80">
                    <TableCell className="font-semibold text-slate-800">{familia.nomeRepresentante}</TableCell>
                    <TableCell className="text-slate-600">{familia.quantidadeMembros}</TableCell>
                    <TableCell className="text-slate-600">{familia.bairro}, {familia.cidade}</TableCell>
                    <TableCell>
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide">
                        {familia.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => abrirModalEdicao(familia)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleExcluir(familia.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
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