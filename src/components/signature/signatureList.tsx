"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog"
// import { deleteSignature } from "~/app/assinatura/actions"
import { Trash2, Eye, FileSignature, Camera } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Signature {
  id: number
  reference_id: number
  type: "signature" | "photo"
  created_at: string
  data_preview: string
  data: string
}

export default function SignatureList({ signatures }: { signatures: Signature[] }) {
  const [viewSignature, setViewSignature] = useState<Signature | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

//   const handleDelete = async (id: number) => {
//     try {
//       setIsDeleting(true)
//       const result = await deleteSignature(id)

//       if (result.success) {
//         // Refresh the page to show updated list
//         window.location.reload()
//       } else {
//         alert(`Erro ao excluir: ${result.error}`)
//       }
//     } catch (error) {
//       console.error("Error deleting signature:", error)
//       alert("Ocorreu um erro ao excluir a assinatura.")
//     } finally {
//       setIsDeleting(false)
//       setDeleteConfirm(null)
//     }
//   }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {signatures.map((signature) => (
        <Card key={signature.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                {signature.type === "signature" ? (
                  <FileSignature className="mr-2 h-5 w-5" />
                ) : (
                  <Camera className="mr-2 h-5 w-5" />
                )}
                {signature.type === "signature" ? "Assinatura" : "Foto"}
              </CardTitle>
              <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                ID Ref: {signature.reference_id}
              </span>
            </div>
            <CardDescription>
              {format(new Date(signature.created_at), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
              <img
                src={signature.data || "/placeholder.svg"}
                alt={`${signature.type} #${signature.id}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setViewSignature(signature)}>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
            {/* <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(signature.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button> */}
          </CardFooter>
        </Card>
      ))}

      {/* View Dialog */}
      <Dialog open={viewSignature !== null} onOpenChange={(open) => !open && setViewSignature(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {viewSignature?.type === "signature" ? "Assinatura" : "Foto"} #{viewSignature?.id}
            </DialogTitle>
            <DialogDescription>
              ID de Referência: {viewSignature?.reference_id}
              <br />
              Capturado em{" "}
              {viewSignature &&
                format(new Date(viewSignature.created_at), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-2 bg-muted rounded-md">
            {viewSignature && (
              <img
                src={viewSignature.data || "/placeholder.svg"}
                alt={`${viewSignature.type} #${viewSignature.id}`}
                className="max-w-full max-h-[60vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta{" "}
              {deleteConfirm && signatures.find((s) => s.id === deleteConfirm)?.type === "signature"
                ? "assinatura"
                : "foto"}
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}

