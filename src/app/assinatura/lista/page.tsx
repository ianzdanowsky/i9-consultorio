import { getSignatures } from "~/app/assinatura/lista/actions"
import SignatureList from "~/components/signature/signatureList"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function SignaturesPage() {
  const { success, signatures, error } = await getSignatures()

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Assinaturas Salvas</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {!success && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Erro ao carregar assinaturas: {error}</p>
        </div>
      )}

      {success && signatures.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhuma assinatura encontrada.</p>
          <Link href="/assinatura" className="mt-4 inline-block">
            <Button>Adicionar Assinatura</Button>
          </Link>
        </div>
      )}

      {success && signatures.length > 0 && <SignatureList signatures={signatures} />}
    </main>
  )
}

