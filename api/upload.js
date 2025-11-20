export const config = {
    api: {
        bodyParser: false
    }
};

import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
    // LIBERA CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const form = new IncomingForm({
        keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Erro no formidable:", err);
            return res.status(500).json({ error: "Erro ao processar upload" });
        }

        if (!files.file) {
            return res.status(400).json({ error: "Arquivo não enviado" });
        }

        const uploadedFile = files.file[0];
        const tempPath = uploadedFile.filepath;

        const fileName = "foto.jpg"; // Sempre sobrescreve
        const uploadDir = path.join(process.cwd(), "public");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const newPath = path.join(uploadDir, fileName);

        fs.copyFileSync(tempPath, newPath);

        return res.status(200).json({
            url: `https://${req.headers.host}/${fileName}`
        });
    });
}
