import { useState, useEffect } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

interface SearchFormProps {
  searchText: string
  onSearch: (query: string) => void
  onScanBarcode: () => void
}

export function SearchForm({ searchText, onSearch, onScanBarcode }: SearchFormProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    setQuery(searchText)
  }, [searchText])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col space-y-4 p-4">
      {/* Input Field */}
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite nome, código, ou data..."
        className="w-full text-lg h-14 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        autoFocus
      />

      {/* Buttons - Stack vertically on mobile */}
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <Button 
          type="button" 
          onClick={onScanBarcode} 
          className="w-full sm:w-auto hover:bg-gray-800 text-white rounded-lg"
        >
          📷 Ler Código de Barras
        </Button>
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          🔍 Buscar
        </Button>
      </div>
    </form>
  )
}
