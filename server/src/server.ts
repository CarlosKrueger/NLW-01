import express from "express";
import path from "path";
import routes from "./routes";
import cors from "cors";
import { erros } from "celebrate";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(routes);

app.get("/", (request, response) => response.sendStatus(200));

app.use(erros());

app.listen(3333);
