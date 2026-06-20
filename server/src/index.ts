import express from "express";
import cors from "cors";
import { router } from "./routes.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`🧭 Línea de pensamiento — API escuchando en http://localhost:${PORT}`);
});
