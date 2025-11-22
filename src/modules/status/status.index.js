// IMPORTS
import { StatusModel } from "./status.mongoose.js";

// CONTROLADOR (HANDLERS)
//getStatus
export const getStatus = (req, res) => {
  res.json({ message: "OK" });
};

//getPingHistory
export const getPingHistory = async (req, res) => {
  try {
    const history = await StatusModel.find().sort({ timestamp: -1 }).limit(50);

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "no se pudo obtener el historial" });
  }
};

//pingStatus
export const pingStatus = async (req, res) => {
  try {
    const start = Date.now();

    await new Promise((resolve) => setTimeout(resolve, 0));

    const end = Date.now();
    const responseTime = end - start;

    const doc = await StatusModel.create({
      responseCode: 200,
      responseTime,
      timestamp: new Date(),
    });

    res.json({ ok: true, saved: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error guardando el ping" });
  }
};

// ping automático cada 5 minutos
setInterval(async () => {
  try {
    const start = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const end = Date.now();
    const responseTime = end - start;

    await StatusModel.create({
      responseCode: 200,
      responseTime,
      timestamp: new Date(),
    });

    console.log("ping auto guardado");
  } catch (e) {
    console.error("error en ping auto", e);
  }
}, 5 * 60 * 1000);
