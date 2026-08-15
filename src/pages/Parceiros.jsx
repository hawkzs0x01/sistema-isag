import { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Building2, User, HeartHandshake } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Parceiros() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parceiros, setParceiros] = useState([]);
  const [busca, setBusca] = useState("");
  const [parceiroEditando, setParceiroEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Empresa");
  const [telefone, setTelefone] = useState("");
  const [responsavel, setResponsavel] = useState("");

  useEffect(() => {
    const q = query(collection(db, "parceiros"), orderBy("dataCadastro", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
      setParceiros(lista);
    });
    return () => unsubscribe();
  }, []);

  const abrirModalNovo = () => {
    setNome("");
    setTipo("Empresa");
    setTelefone("");
    setResponsavel("");
    setParceiroEditando(null);
    setOpen(true);
  };

  const abrirModalEdicao = (parceiro) => {
    setNome(parceiro.nome);
    setTipo(parceiro.tipo);
    setTelefone(parceiro.telefone || "");
    setResponsavel(parceiro.responsavel || "");
    setParceiroEditando(parceiro.id);
    setOpen(true);
  };

  const handleExcluir = async (id) => {
    const confirmar = window.confirm("Segurança: Deseja realmente remover este parceiro?");
    if (confirmar) {
      try {
        await deleteDoc(doc(db, "parceiros", id));
        toast.success("Parceiro removido com sucesso!");
      } catch (error) {
        toast.error("Erro ao remover o parceiro.");
      }
    }
  };

  const formatarTelefone = (valor) => {
    let v = valor.replace(/\D/g, ""); // Remove tudo que não é dígito
    if (v.length <= 10) {
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
      v = v.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return v.substring(0, 15);
  };

  const handleSalvarParceiro = async (e) => {
    e.preventDefault();
    if (telefone && telefone.length < 14) {
      toast.error("Aviso: Por favor, insira um telefone válido com DDD.");
      return;
    }
    setLoading(true);
    try {
      if (parceiroEditando) {
        const parceiroRef = doc(db, "parceiros", parceiroEditando);
        await updateDoc(parceiroRef, { nome, tipo, telefone, responsavel });
        toast.success("Dados do parceiro atualizados!");
      } else {
        await addDoc(collection(db, "parceiros"), {
          nome, tipo, telefone, responsavel, status: "Ativo", dataCadastro: new Date().toISOString()
        });
        toast.success("Novo parceiro registrado com sucesso!");
      }
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar os dados no servidor.");
    } finally {
      setLoading(false);
    }
  };

  const termoBusca = busca.toLowerCase().trim();
  const parceirosFiltrados = parceiros.filter((p) => 
    p.nome.toLowerCase().includes(termoBusca) || 
    (p.responsavel && p.responsavel.toLowerCase().includes(termoBusca))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Parceiros e Doadores</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Empresas e pessoas que apoiam o Instituto.</p>
        </div>
        
        <Button onClick={abrirModalNovo} className="gap-2 bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm">
          <Plus size={16} />
          Novo Parceiro
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">{parceiroEditando ? "Editar Parceiro" : "Cadastrar Parceiro"}</DialogTitle>
              <DialogDescription className="text-slate-500">Preencha os dados de contato do doador.</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSalvarParceiro} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="font-medium text-slate-700">Nome (Empresa ou Pessoa)</Label>
                <Input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: GSA Alimentos" className="rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="font-medium text-slate-700">Tipo de Parceiro</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Empresa">Empresa (PJ)</SelectItem>
                    <SelectItem value="Pessoa Física">Pessoa Física (PF)</SelectItem>
                    <SelectItem value="Governo/Prefeitura">Governo / Prefeitura</SelectItem>
                    <SelectItem value="Comércio Local">Comércio Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-medium text-slate-700">Nome do Contato</Label>
                  <Input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Ex: Sr. João" className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-slate-700">Telefone / WhatsApp</Label>
                  <Input 
                    type="tel"
                    value={telefone} 
                    onChange={(e) => {
                      const formatado = formatarTelefone(e.target.value);
                      e.target.value = formatado; // Hack do React para forçar a remoção de letras visualmente
                      setTelefone(formatado);
                    }} 
                    placeholder="(00) 00000-0000" 
                    className="rounded-lg" 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 rounded-lg h-11 font-medium" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Parceiro"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm transition-shadow focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500">
        <Search size={20} className="text-slate-400 ml-2" />
        <Input 
          placeholder="Buscar parceiro por nome ou contato..." 
          className="border-0 shadow-none focus-visible:ring-0 px-2 text-slate-700"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-700">Parceiro</TableHead>
                <TableHead className="font-semibold text-slate-700">Tipo</TableHead>
                <TableHead className="font-semibold text-slate-700">Contato</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parceirosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HeartHandshake size={32} className="text-slate-300" />
                      <p>Nenhum parceiro cadastrado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                parceirosFiltrados.map((p) => (
                  <TableRow key={p.id} className="transition-colors hover:bg-slate-50/80">
                    <TableCell className="font-semibold text-slate-800">{p.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        {p.tipo === "Pessoa Física" ? <User size={14} /> : <Building2 size={14} />}
                        {p.tipo}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {p.responsavel ? `${p.responsavel} ${p.telefone ? `(${p.telefone})` : ''}` : (p.telefone || "-")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => abrirModalEdicao(p)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Editar">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleExcluir(p.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Excluir">
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