export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Preflight OPTIONS ↓↓↓
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Use POST" });
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const fs = require("fs");
    const filePath = "/tmp/upload.jpg";

    try {
        fs.writeFileSync(filePath, buffer);

        const proto = req.headers["x-forwarded-proto"] || "https";
        const host = req.headers.host;

        return res.status(200).json({
            url: `${proto}://${host}/api/upload?show=1`,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao salvar" });
    }
}
