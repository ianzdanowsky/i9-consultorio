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
    <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col space-y-3">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite nome, código, ou data..."
        className="w-full p-2 border rounded-lg"
      />
      <div className="flex justify-between">
        <Button type="button" onClick={onScanBarcode} className="bg-blue-500 hover:bg-blue-600 text-white">
          Ler Código de Barras
        </Button>
        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
          Buscar
        </Button>
      </div>
    </form>
  )
}
