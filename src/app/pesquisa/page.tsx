"use client"

import { useState } from "react"
import { SearchForm } from "~/components/SearchForm"
import { UserList } from "~/components/UserList"
import { BarcodeScanner } from "~/components/Barcodescanner"
import getPacients from "./actions"
import LogoutButton from "~/components/LogoutButton"
import { type paciente } from "~/interfaces/pacientes"

export default function Home() {
  // const [users, setUsers] = useState<Paciente[]>([])
  const [barcodeString, setBarcodeString] = useState("")
  const [searchResults, setSearchResults] = useState<paciente[]>([])
  const [isScanning, setIsScanning] = useState(false)
  // const [isUserListVisible, setIsUserListVisible] = useState(false)

  // useEffect(() => {
  //   void fetchAllUsers()
  // }, [])

  // const fetchAllUsers = async () => {
  //   const allUsers = await getAllPacientes()
  //   // setUsers(allUsers)
  //   setIsUserListVisible(true)
  // }

  const handleSearch = async (query: string) => {
    console.log(query)
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
          <LogoutButton />
        </div>
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">Pesquisa de Pacientes</h1>

        {/* Search Form */}
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg shadow-sm">
          <SearchForm searchText={barcodeString} onSearch={handleSearch} onScanBarcode={handleScanBarcode} />
        </div>

        {/* User List */}
          <div className="w-full">
            <UserList users={searchResults} />
          </div>

        {/* Barcode Scanner */}
        {isScanning && <BarcodeScanner onResult={handleBarcodeResult} onClose={() => setIsScanning(false)} />}
      </main>
    </div>
  )
}
