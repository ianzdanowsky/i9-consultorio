import { useEffect } from "react"
import { useZxing } from "react-zxing"

interface BarcodeScannerProps {
  onResult: (result: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onResult, onClose }: BarcodeScannerProps) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      console.log(result)
    },
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Scan Barcode</h2>
        <video ref={ref} className="w-full max-w-md" />
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Close Scanner
        </button>
      </div>
    </div>
  )
}

