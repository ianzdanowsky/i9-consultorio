"use client"

import { useState, useRef, useEffect } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { saveSignature } from "~/app/assinatura//lista/actions"
import { Camera, RefreshCw, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function SignatureCapture() {
  const [tab, setTab] = useState<string>("signature")
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [referenceId, setReferenceId] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const sigCanvas = useRef<SignatureCanvas>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear()
      setSignatureData(null)
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Não foi possível acessar a câmera. Verifique as permissões.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCameraActive(false)
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const data = canvas.toDataURL("image/png")
        setPhotoData(data)
        stopCamera()
      }
    }
  }

  const retakePhoto = async () => {
    setPhotoData(null)
    await startCamera()
  }

  const handleSave = async () => {
    try {
      // Validar ID de referência
      if (!referenceId || isNaN(Number(referenceId))) {
        alert("Por favor, insira um ID de referência válido.")
        return
      }

      setIsSaving(true)

      let dataToSave = null

      if (tab === "signature" && sigCanvas.current) {
        if (sigCanvas.current.isEmpty()) {
          alert("Por favor, faça uma assinatura antes de salvar.")
          setIsSaving(false)
          return
        }
        dataToSave = sigCanvas.current.toDataURL("image/png")
        setSignatureData(dataToSave)
      } else if (tab === "photo") {
        if (!photoData) {
          alert("Por favor, tire uma foto antes de salvar.")
          setIsSaving(false)
          return
        }
        dataToSave = photoData
      }

      if (dataToSave) {
        const result = await saveSignature(dataToSave, Number(referenceId), tab === "signature" ? "signature" : "photo")

        if (result.success) {
          setSaveSuccess(true)
          // Limpar formulário
          if (tab === "signature") {
            clearSignature()
          } else {
            setPhotoData(null)
          }
          setReferenceId("") // Limpar ID de referência após salvar
        } else {
          alert(`Erro ao salvar: ${result.error}`)
        }
      }
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Ocorreu um erro ao salvar os dados.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleTabChange = async (value: string) => {
    setTab(value)
    if (value === "photo" && !isCameraActive && !photoData) {
      await startCamera()
    } else if (value === "signature" && isCameraActive) {
      stopCamera()
    }
  }

  return (
    <div className="space-y-4">
      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
          <AlertDescription className="text-green-700">
            Dados salvos com sucesso.{" "}
            <Link href="/signatures" className="underline font-medium">
              Ver todas as assinaturas
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Captura de Assinatura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Adicionar campo de ID de referência */}
          <div className="space-y-2">
            <Label htmlFor="reference-id">ID de Referência</Label>
            <Input
              id="reference-id"
              type="number"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              placeholder="Digite o ID de referência"
              required
              min="1"
              className="w-full"
            />
          </div>

          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signature">Assinatura</TabsTrigger>
              <TabsTrigger value="photo">Foto</TabsTrigger>
            </TabsList>

            <TabsContent value="signature" className="mt-4">
              <div className="border rounded-md p-2 bg-white">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    className: "w-full h-64 cursor-crosshair",
                  }}
                />
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={clearSignature} disabled={isSaving}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="photo" className="mt-4">
              <div className="border rounded-md p-2 bg-black">
                {!photoData ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                    <Button className="mt-4 w-full" onClick={takePhoto} disabled={!isCameraActive || isSaving}>
                      <Camera className="mr-2 h-4 w-4" />
                      Tirar Foto
                    </Button>
                  </>
                ) : (
                  <>
                    <img
                      src={photoData || "/placeholder.svg"}
                      alt="Foto capturada"
                      className="w-full h-64 object-contain"
                    />
                    <Button className="mt-4 w-full" onClick={retakePhoto} disabled={isSaving}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Nova Foto
                    </Button>
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSave} disabled={isSaving || !referenceId}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

