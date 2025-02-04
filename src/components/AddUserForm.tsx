import { useState } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { addPaciente, type Paciente } from "~/lib/matendimento"
import type React from "react" // Added import for React

interface AddUserFormProps {
  onUserAdded: (user: Paciente) => void
}

export function AddUserForm({ onUserAdded }: AddUserFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [metadata, setMetadata] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newUser = await addPaciente({ name, email, metadata })
    onUserAdded(newUser)
    setName("")
    setEmail("")
    setMetadata({})
  }

  const handleAddMetadata = () => {
    setMetadata({ ...metadata, "": "" })
  }

  const handleMetadataChange = (index: number, key: string, value: string) => {
    const updatedMetadata = Object.entries(metadata)
    updatedMetadata[index] = [key, value]
    setMetadata(Object.fromEntries(updatedMetadata))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label>Metadata</Label>
        {Object.entries(metadata).map(([key, value], index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <Input placeholder="Key" value={key} onChange={(e) => handleMetadataChange(index, e.target.value, value)} />
            <Input
              placeholder="Value"
              value={value}
              onChange={(e) => handleMetadataChange(index, key, e.target.value)}
            />
          </div>
        ))}
        <Button type="button" onClick={handleAddMetadata} className="mt-2">
          Add Metadata
        </Button>
      </div>
      <Button type="submit">Add User</Button>
    </form>
  )
}

