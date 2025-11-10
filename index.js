import express from "express";
import cors from "cors";
import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const app = express();
app.use(express.json());

// ✅ Permitir tu frontend
app.use(cors({
  origin: "https://wedding6.onrender.com"
}));

function readInvitados() {
  const file = fs.readFileSync("invitados.csv");
  return parse(file, { columns: true, skip_empty_lines: true }).map(row => ({
    id: row.id,
    familia: row.familia,
    personas: Number(row.personas),
    nombres: row.nombres.split(";"),
  }));
}

function readRespuestas() {
  if (!fs.existsSync("respuestas.csv")) return [];
  const file = fs.readFileSync("respuestas.csv");
  return parse(file, { columns: true, skip_empty_lines: true });
}

// ✅ Combina invitados + respuestas
function mergeData() {
  const invitados = readInvitados();
  const respuestas = readRespuestas();

  return invitados.map(inv => {
    const match = respuestas.find(r => r.id === inv.id);
    return {
      ...inv,
      respondio: !!match,
      respuesta: match ? match.respuesta : null
    };
  });
}

// ✅ API → Obtener invitado por ID
app.get("/invitado/:id", (req, res) => {
  const invitados = mergeData();
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

  const row = [
    id,
    invitado.familia,
    invitado.personas,
    invitado.nombres.join(";"),
    respuesta,
    asistentes,
    nombres_confirmados.join(";"),
    new Date().toLocaleString("es-MX")
  ];

  const exists = fs.existsSync("respuestas.csv");
  const csvRow = stringify([row]);

  if (!exists) {
    fs.writeFileSync("respuestas.csv",
      "id,familia,personas,nombres,respuesta,asistentes,nombres_confirmados,fecha\n" + csvRow
    );
  } else {
    fs.appendFileSync("respuestas.csv", csvRow);
  }

  res.json({ ok: true });
});

// ✅ Puerto Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ API lista en puerto ${PORT}`));