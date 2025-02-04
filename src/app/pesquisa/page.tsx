"use client"

import { useState, useEffect } from "react"
import { SearchForm } from "~/components/SearchForm"
import { UserList } from "~/components/UserList"
import { BarcodeScanner } from "~/components/Barcodescanner"
import { searchPacientes, getPacienteByBarcode, getAllPacientes, type Paciente } from "~/lib/matendimento"

export default function Home() {
  const [users, setUsers] = useState<Paciente[]>([])
  const [barcodeString, setBarcodeString ] = useState("")
  const [searchResults, setSearchResults] = useState<Paciente[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isUserListVisible, setIsUserListVisible] = useState(false) // Começa oculto

  useEffect(() => {
    void fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    const allUsers = await getAllPacientes()
    setUsers(allUsers)
    setIsUserListVisible(true) // Exibe a lista após a busca
  }

  const handleSearch = async (query: string) => {
    console.log(query)
    const results = await searchPacientes(query)
    setSearchResults(results)
  }

  const handleScanBarcode = () => {
    setIsScanning(true)
  }
  
  const handleBarcodeResult = async (result: string) => {
    setBarcodeString(result)
    setIsScanning(false)
    const user = await getPacienteByBarcode(result)
    if (user) {
      setSearchResults([user])
    } else {
      setSearchResults([])
    }
  }

  const handleUserAdded = (newUser: Paciente) => {
    setUsers([...users, newUser])
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pesquisa Atendimentos:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Pacientes:</h2>


          <SearchForm searchText={barcodeString} onSearch={handleSearch} onScanBarcode={handleScanBarcode} />

		      {isUserListVisible && (
          <div className="mt-4">
            <UserList users={searchResults} />
          </div>
		      )}
        </div>

        {isUserListVisible && (
        <div>
          <h2 className="text-xl font-semibold mb-4"></h2>
        </div>
        )}
      </div>
	  
      {isScanning && <BarcodeScanner onResult={handleBarcodeResult} />}
    </main>
  )
}