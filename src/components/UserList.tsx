import type { Paciente } from "~/lib/matendimento"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation"

interface UserListProps {
  users: Paciente[]
}

export function UserList({ users }: UserListProps) {
  const router = useRouter()

  return (
    <div className="w-full space-y-4">
      {users.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum paciente encontrado.</p>
      ) : (
        users.map((user) => (
          <Card key={user.id} className="p-4 border rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Email: {user.email}</p>
              <Button
                onClick={() => router.push("/assistant/" + user.id)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white w-full"
              >
                Iniciar Atendimento
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
