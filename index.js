import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve("./");
const INVITADOS_CSV = path.join(DATA_DIR, "invitados.csv");
const RESPUESTAS_CSV = path.join(DATA_DIR, "respuestas.csv");

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    if (!fs.existsSync(filePath)) return resolve([]);
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
}

function appendCSV(filePath, headers, row) {
  return new Promise((resolve, reject) => {
    const exists = fs.existsSync(filePath);
    const stringifier = stringify({ header: !exists, columns: headers });
    const writable = fs.createWriteStream(filePath, { flags: "a" });
    stringifier.on("error", reject);
    writable.on("error", reject);
    writable.on("finish", resolve);
    stringifier.pipe(writable);
    stringifier.write(row);
    stringifier.end();
  });
}

async function ensureRespuestasFile() {
  if (!fs.existsSync(RESPUESTAS_CSV)) {
    await appendCSV(RESPUESTAS_CSV,
      ["id","familia","personas","nombres","respuesta","asistentes","nombres_confirmados","fecha_iso"],
      { id:"", familia:"", personas:"", nombres:"", respuesta:"", asistentes:"", nombres_confirmados:"", fecha_iso:"" }
    );
    const rows = await readCSV(RESPUESTAS_CSV);
    const clean = rows.filter(r => r.id);
    const columns = ["id","familia","personas","nombres","respuesta","asistentes","nombres_confirmados","fecha_iso"];
    const out = stringify(clean, { header: true, columns });
    fs.writeFileSync(RESPUESTAS_CSV, out);
  }
}

app.get("/invitado/:id", async (req, res) => {
  const { id } = req.params;
  const invitados = await readCSV(INVITADOS_CSV);
  const inv = invitados.find(r => (r.id || "").toUpperCase() === id.toUpperCase());
  if (!inv) return res.status(404).json({ error: "Invitado no encontrado" });

  const respuestas = await readCSV(RESPUESTAS_CSV);
  const ya = respuestas.find(r => (r.id || "").toUpperCase() === id.toUpperCase());

  const nombresLista = (inv.nombres || "").split(";").map(n => n.trim()).filter(Boolean);

  res.json({
    id: inv.id,
    familia: inv.familia,
    personas: Number(inv.personas || nombresLista.length),
    nombres: nombresLista,
    respondio: Boolean(ya),
    respuesta: ya?.respuesta || null,
  });
});

app.post("/confirmar", async (req, res) => {
  await ensureRespuestasFile();
  const { id, respuesta, asistentes, nombres_confirmados } = req.body;

  const invitados = await readCSV(INVITADOS_CSV);
  const inv = invitados.find(r => (r.id || "").toUpperCase() === id.toUpperCase());
  if (!inv) return res.status(404).json({ error: "Invitado no encontrado" });

  const respuestas = await readCSV(RESPUESTAS_CSV);
  if (respuestas.find(r => (r.id || "").toUpperCase() === id.toUpperCase())) {
    return res.status(409).json({ error: "Ya respondió" });
  }

  const fecha_iso = new Date().toISOString();
  await appendCSV(
    RESPUESTAS_CSV,
    ["id","familia","personas","nombres","respuesta","asistentes","nombres_confirmados","fecha_iso"],
    {
      id: inv.id,
      familia: inv.familia,
      personas: inv.personas,
      nombres: inv.nombres,
      respuesta,
      asistentes,
      nombres_confirmados: (nombres_confirmados || []).join(";"),
      fecha_iso
    }
  );

  res.json({ ok: true });
});

app.listen(PORT, () => console.log("✅ API corriendo en puerto " + PORT));
