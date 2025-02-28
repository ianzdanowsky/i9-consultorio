"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import Lottie from "lottie-react";
import soundLines from "~/components/animations/lottie/sound-lines.json";

export default function LoginPageClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false, // Impede a redireção automática para tratamento de erro
    });

    if (result?.error) {
      setError("Usuário ou senha inválidos");
    } else {
      // Redireciona para a página de pesquisa após login bem-sucedido
      router.push("/pesquisa");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col rounded-lg bg-white p-6 shadow-md">
        {/* Header */}
        <CardHeader className="flex flex-col items-center justify-center gap-1 text-center">
          <div className="-mb-2 flex justify-center">
            <Lottie
              animationData={soundLines}
              style={{ width: 100, height: 100 }}
            />
          </div>
          <CardTitle className="text-2xl font-bold">
            i9 Atendimento por voz
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
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
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full text-white"
            >
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
  );
}
