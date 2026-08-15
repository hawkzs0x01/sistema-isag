import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase" // Nosso arquivo de conexão criado no Passo 7

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
  // Criamos "estados" para guardar o que o usuário digita em tempo real
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Ferramenta do React Router para trocar de página via código
  const navigate = useNavigate()

  // Função que roda quando o usuário clica em "Entrar"
  const handleLogin = async (e) => {
    e.preventDefault() // Evita que a página recarregue (comportamento padrão do HTML)
    setError("")
    setLoading(true)

    try {
      // Tenta bater na porta do Firebase com o e-mail e senha
      await signInWithEmailAndPassword(auth, email, password)
      
      // Se deu certo, joga a pessoa pro Dashboard!
      navigate("/dashboard")
    } catch (err) {
      // Se o Firebase rejeitar, mostramos um erro na tela
      setError("E-mail ou senha incorretos. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Instituto Solidário</CardTitle>
          <CardDescription>
            Digite suas credenciais para acessar o painel de gestão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Englobamos os inputs em um <form> apontando para a nossa função */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@institutosolidario.org" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            {/* Se houver algum erro no login, ele aparece aqui em vermelho */}
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verificando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}