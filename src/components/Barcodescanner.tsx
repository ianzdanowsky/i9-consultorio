import { useZxing } from "react-zxing"
import { X } from "lucide-react"

interface BarcodeScannerProps {
  onResult: (result: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onResult, onClose }: BarcodeScannerProps) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText())
      console.log(result)
    },
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">Escaneie o Código</h2>
        <video ref={ref} className="w-full rounded-lg shadow-sm" />
      </div>
    </div>
  )
}
