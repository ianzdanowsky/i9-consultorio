import "reflect-metadata";
import { DataSource, type DataSourceOptions } from "typeorm";
import * as entities from "~/lib/entities";

export const AppDataSourceOptions: DataSourceOptions = {
    type: "mssql",
    host: "10.0.0.84",
    port: 1433,
    username: "sa",
    password: "security",
    database: "i9dados",
    entities: entities,
    synchronize: true,
    logging: true,
    options: {
        instanceName: "mssql",   // Specify the named instance here
        encrypt: false,          // Disable encryption if not needed
        trustServerCertificate: true,  // Bypass SSL certificate errors
      },
};


export const AppDataSource = new DataSource(AppDataSourceOptions);

// Force initialization before export
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });
