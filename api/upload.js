import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const { filename, base64 } = req.body;

        if (!filename || !base64) {
            return res.status(400).json({ error: "Envie filename e base64" });
        }

        // Remove prefixo "data:image/jpeg;base64,"
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const uploadDir = path.join(process.cwd(), "public", "uploads");

        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        writeFileSync(filePath, buffer);

        const url = `https://${req.headers.host}/uploads/${filename}`;

        return res.status(200).json({
            success: true,
            url
        });

    } catch (err) {
        return res.status(500).json({ error: String(err) });
    }
}
