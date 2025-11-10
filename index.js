import express from "express";
import cors from "cors";
import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const app = express();
app.use(express.json());

// ✅ PERMITIR ACCESO desde tu sitio
app.use(cors({
  origin: "https://wedding6.onrender.com"
}));

// ✅ Leer invitados desde CSV
function readInvitados() {
  const file = fs.readFileSync("invitados.csv");
  return parse(file, { columns: true, skip_empty_lines: true }).map(row => ({
    id: row.id,
    familia: row.familia,
    personas: Number(row.personas),
    nombres: row.nombres.split(";"),
    respondio: row.respondio === "SI" || row.respondio === "NO",
    respuesta: row.respondio || null
  }));
}

// ✅ Guardar confirmaciones en respuestas.csv
function saveRespuesta(data) {
  const exists = fs.existsSync("respuestas.csv");
  const newRow = [
    data.id,
    data.familia,
    data.personas,
    data.nombres.join(";"),
    data.respuesta,
    data.asistentes,
    data.nombres_confirmados.join(";"),
    new Date().toLocaleString("es-MX")
  ];

  const csvData = stringify([newRow]);
  fs.appendFileSync("respuestas.csv", exists ? csvData : 
    "id,familia,personas,nombres,respuesta,asistentes,nombres_confirmados,fecha\n" + csvData);
}

// ✅ Obtener invitado por ID
app.get("/invitado/:id", (req, res) => {
  const invitados = readInvitados();
  const invitado = invitados.find(i => i.id === req.params.id);

  if (!invitado) return res.json({ error: "Invitado no encontrado" });

  res.json(invitado);
});

// ✅ Guardar confirmación
app.post("/confirmar", (req, res) => {
  const { id, respuesta, asistentes, nombres_confirmados } = req.body;
  const invitados = readInvitados();
  const invitado = invitados.find(i => i.id === id);

  if (!invitado) return res.status(400).json({ error: "ID inválido" });

  saveRespuesta({
    id,
    familia: invitado.familia,
    personas: invitado.personas,
    nombres: invitado.nombres,
    respuesta,
    asistentes,
    nombres_confirmados
  });

  res.json({ ok: true });
});

// ✅ Puerto para Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ API corriendo en puerto ${PORT}`));
