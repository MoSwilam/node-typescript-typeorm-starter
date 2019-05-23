import express from "express";
import { createConnection } from "typeorm";
import {
  handleUserLogin,
  handleUserSignup,
  authenticateMiddleware
} from "./controllers/user";
import { getStockList, getStock, postStock } from "./controllers/stock";
const app = express();
app.use(express.json(), express.urlencoded());

const port = process.env.PORT || 3000; // default port to listen

(async () => {
  const connection = await createConnection({
    type: "sqlite",
    database: "temp/sqlitedb.db",
    synchronize: true,
    logging: false,
    entities: ["src/models/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"]
  });

  app.post("/login", handleUserLogin);
  app.post("/signup", handleUserSignup);
  app.route("/stock").get(getStockList);
  app.post("/stock", postStock);
  app.use("/stock/:name", authenticateMiddleware);
  app.get("/stock/:name", getStock);

  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
})();
