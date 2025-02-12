"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react" 
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card"

export default function LoginPageClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Impede a redireção automática para tratamento de erro
    })

    if (result?.error) {
      setError("Usuário ou senha inválidos")
    } else {
      // Redireciona para a página de pesquisa após login bem-sucedido
      router.push("/pesquisa")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <main className="flex flex-col flex-1 max-w-md mx-auto bg-white shadow-md rounded-lg p-6 w-full">
        
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">i9 Atendimento por voz</CardTitle>
          <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>

        {/* Formulário de Login */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="text"
                placeholder="Digite seu e-mail"
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
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Entrar
            </Button>
          </form>
        </CardContent>

        {/* Rodapé */}
        <CardFooter className="flex justify-center">
          {/* <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Cadastre-se
            </a>
          </p> */}
        </CardFooter>
      </main>
    </div>
  )
}
