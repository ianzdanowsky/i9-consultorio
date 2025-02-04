// import { connectDB } from "~/lib/db"

export interface Paciente {
  id: string
  name: string
  email: string
  metadata: Record<string, string>
}

const users: Paciente[] = [
  { id: "1", name: "051000012517", email: "john@example.com", metadata: { department: "IT", role: "Developer" } },
  { id: "2", name: "Jane Smith", email: "jane@example.com", metadata: { department: "HR", role: "Manager" } },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", metadata: { department: "Sales", role: "Representative" } },
]

export async function searchPacientes(query: string): Promise<Paciente[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      Object.values(user.metadata).some((value) => value.toLowerCase().includes(query.toLowerCase())),
  )
}

export async function getPacienteByBarcode(barcode: string): Promise<Paciente | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // For this example, we'll just match the barcode to the user ID
  return users.find((user) => user.id === barcode) ?? null
}

export async function addPaciente(user: Omit<Paciente, "id">): Promise<Paciente> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newPaciente: Paciente = {
    ...user,
    id: (users.length + 1).toString(),
  }

  users.push(newPaciente)
  return newPaciente
}

export async function getAllPacientes(): Promise<Paciente[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return users
}

