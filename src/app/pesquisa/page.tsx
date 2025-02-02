"use client"

import { useState, useEffect } from "react"
import { SearchForm } from "~/components/SearchForm"
import { UserList } from "~/components/UserList"
import { BarcodeScanner } from "~/components/Barcodescanner"
import { AddUserForm } from "~/components/AddUserForm"
import { searchUsers, getUserByBarcode, getAllUsers, type User } from "~/lib/api"

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    void fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    const allUsers = await getAllUsers()
    setUsers(allUsers)
  }

  const handleSearch = async (query: string) => {
    const results = await searchUsers(query)
    setSearchResults(results)
  }

  const handleScanBarcode = () => {
    setIsScanning(true)
  }

  const handleBarcodeResult = async (result: string) => {
    setIsScanning(false)
    const user = await getUserByBarcode(result)
    if (user) {
      setSearchResults([user])
    } else {
      setSearchResults([])
    }
  }

  const handleUserAdded = (newUser: User) => {
    setUsers([...users, newUser])
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Users</h2>
          <SearchForm onSearch={handleSearch} onScanBarcode={handleScanBarcode} />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Search Results</h3>
            <UserList users={searchResults} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <AddUserForm onUserAdded={handleUserAdded} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <UserList users={users} />
      </div>
      {isScanning && <BarcodeScanner onResult={handleBarcodeResult} onClose={() => setIsScanning(false)} />}
    </main>
  )
}

