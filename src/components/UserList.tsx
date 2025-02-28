import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation"
import { type paciente } from "~/interfaces/pacientes"

interface UserListProps {
  users: paciente[]
}

export function UserList({ users }: UserListProps) {
  const router = useRouter()

  return (
    <div className="w-full space-y-4">
      {users.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum paciente encontrado.</p>
      ) : (
        users.map((user) => (
          <Card key={user.ID} className="p-4 border rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{user.NAME}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">CNS: {user.EMAIL}</p>
              <Button
                onClick={() => router.push("/atendimento/" + user.ID)}
                className="mt-2 text-white w-full"
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
