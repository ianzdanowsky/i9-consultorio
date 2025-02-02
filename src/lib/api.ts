export interface User {
    id: string
    name: string
    email: string
    metadata: Record<string, string>
  }
  
  const users: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", metadata: { department: "IT", role: "Developer" } },
    { id: "2", name: "Jane Smith", email: "jane@example.com", metadata: { department: "HR", role: "Manager" } },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", metadata: { department: "Sales", role: "Representative" } },
  ]
  
  export async function searchUsers(query: string): Promise<User[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        Object.values(user.metadata).some((value) => value.toLowerCase().includes(query.toLowerCase())),
    )
  }
  
  export async function getUserByBarcode(barcode: string): Promise<User | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    // For this example, we'll just match the barcode to the user ID
    return users.find((user) => user.id === barcode) ?? null
  }
  
  export async function addUser(user: Omit<User, "id">): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    const newUser: User = {
      ...user,
      id: (users.length + 1).toString(),
    }
  
    users.push(newUser)
    return newUser
  }
  
  export async function getAllUsers(): Promise<User[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    return users
  }
  
  