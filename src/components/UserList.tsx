import type { Paciente } from "~/lib/matendimento"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
// import getPacients from "~/app/pesquisa/actions"
import { useRouter } from "next/navigation"

interface UserListProps {
  users: Paciente[]
}

export function UserList({ users }: UserListProps) {
  // const pacientes = getPacients("search_string")

  const router = useRouter()
  

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {user.email}</p>
            <h4 className="font-semibold mt-2">Metadata:</h4>
            <ul>
              {Object.entries(user.metadata).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
                  {/* Botão Lateral */}
  <Button type="submit" className="ml-4 flex items-left space-x-0" onClick={() => router.push("/assistant/12345678")}>
</Button>
    </div>
  )
}

