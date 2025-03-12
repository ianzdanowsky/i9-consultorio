import SignatureCapture from "~/components/signature/signatureCapture"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { List } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Captura de Assinatura</h1>
        <Link href="/assinatura/lista">
          <Button variant="outline">
            <List className="mr-2 h-4 w-4" />
            Ver Assinaturas
          </Button>
        </Link>
      </div>
      <SignatureCapture />
    </main>
  )
}