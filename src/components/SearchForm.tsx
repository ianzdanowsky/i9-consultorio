import { useState } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

interface SearchFormProps {
  onSearch: (query: string) => void
  onScanBarcode: () => void
}

export function SearchForm({ onSearch, onScanBarcode }: SearchFormProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="flex-grow"
      />
      <Button type="submit">Search</Button>
      <Button type="button" onClick={onScanBarcode}>
        Scan Barcode
      </Button>
    </form>
  )
}

