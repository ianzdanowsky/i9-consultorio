import { DataSource, type DataSourceOptions } from "typeorm";
import * as entities from "~/server/auth/entities";

export const AppDataSourceOptions: DataSourceOptions = {
    type: "mssql",
    host: process.env.DB_SERVER,
    port: parseInt(process.env.DB_SERVER_PORT ?? "1433"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: entities,
    synchronize: false,
    logging: false,
    options: {
        instanceName: process.env.DB_INSTANCE,   // Specify the named instance here
        encrypt: false,          // Disable encryption if not needed
        trustServerCertificate: true,  // Bypass SSL certificate errors
      },
};

const AppDataSource = new DataSource(AppDataSourceOptions);

// Force initialization to get user's table before export
if (!AppDataSource.isInitialized) {
AppDataSource.initialize()
  .then(() => {
    AppDataSource.getRepository("cusuario");
    AppDataSource.getRepository("mprofissionalusuario")
    AppDataSource.getRepository("usuarioSenha");
  })
  .then(() => {
    console.log("✅ Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });
}

export default AppDataSource;