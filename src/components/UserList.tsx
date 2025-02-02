import type { User } from "~/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

interface UserListProps {
  users: User[]
}

export function UserList({ users }: UserListProps) {
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
    </div>
  )
}

