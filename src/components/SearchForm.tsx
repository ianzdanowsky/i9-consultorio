import { useState } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { useEffect } from "react"

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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3 items-center">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nome, código, data ..."
        className="w-full"
      />
      <div className="flex space-x-4">
        <Button type="button" onClick={onScanBarcode}>
          Ler codigo de Barras</Button>&nbsp;&nbsp;&nbsp;
        <Button type="submit">Buscar</Button>
      </div>
    </form>
  )
}

