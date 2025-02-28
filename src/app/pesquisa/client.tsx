"use client"

import { useState } from "react"
import { SearchForm } from "~/components/SearchForm"
import { UserList } from "~/components/UserList"
import { BarcodeScanner } from "~/components/Barcodescanner"
import getPacients from "./actions"
import UserProfileButton from "~/components/UserProfileButton"
import { type paciente } from "~/interfaces/pacientes"
import { type Session } from "next-auth"

export default function PesquisaClient({ session }:{session: Session | null}) {
  const [barcodeString, setBarcodeString] = useState("")
  const [searchResults, setSearchResults] = useState<paciente[]>([])
  const [isScanning, setIsScanning] = useState(false)

  // const session = useSession()

  const handleSearch = async (query: string) => {
    const results = await getPacients(query)
    setSearchResults(results)
  }

  const handleScanBarcode = () => {
    setIsScanning(true)
  }
  
  const handleBarcodeResult = async (result: string) => {
    setBarcodeString(result)
    setIsScanning(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <main className="flex flex-col flex-1 max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 w-full">
        <div className="flex justify-center mb-4">
        <UserProfileButton session={session} />
        {/* <LogoutButton /> */}
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">Pesquisa de Pacientes</h1>

        {/* Search Form */}
        <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
          <SearchForm searchText={barcodeString} onSearch={handleSearch} onScanBarcode={handleScanBarcode} />
        </div>

        {/* User List (Scrollable) */}
        <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg shadow-sm bg-white p-2 max-h-[50vh]">
          <UserList users={searchResults} />
        </div>

        {/* Barcode Scanner */}
        {isScanning && <BarcodeScanner onResult={handleBarcodeResult} onClose={() => setIsScanning(false)} />}
      </main>
    </div>
  )
}
