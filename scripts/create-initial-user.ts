import "reflect-metadata";
import { DataSource } from "typeorm";
import * as entities from "~/lib/entities";  // Import NextAuth default User entity
import bcrypt from "bcrypt";

// Configure your data source
const AppDataSource = new DataSource({
  type: "mssql",
  host: "10.0.0.84",
  port: 1433,
  username: "sa",
  password: "security",
  database: "i9dados",
  synchronize: false,  // No need to resync the schema for this script
  logging: true,
  entities: entities,
  extra: {
    trustServerCertificate: true,
  },
});

async function createInitialUser() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Data Source initialized!");

    const userRepository = AppDataSource.getRepository(entities.UserEntity);
    const accountRepository = AppDataSource.getRepository(entities.AccountEntity);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: "admin@example.com" },
    });

    if (existingUser) {
      console.log("⚠️ User already exists:", existingUser);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("tiago2512", 10);

    // Create a new user
    const newUser = userRepository.create({
      name: "Admin User",
      email: "tportela3@yahoo.com.br",
      accounts: accountRepository.create([
        { password: hashedPassword, provider: "email", type: "email" },
      ]),
      // You can add custom fields like `role` if your User entity supports it
    });

    await userRepository.save(newUser);

    console.log("✅ New user created:", newUser);
  } catch (error) {
    console.error("❌ Error creating user:", error);
  } finally {
    await AppDataSource.destroy();
    console.log("🔌 Connection closed.");
  }
}

// Run the script
createInitialUser();
