import fs from "fs";

export const config = {
    api: { bodyParser: false }, // lemos o body bruto
};

export default async function handler(req, res) {
    const filePath = "/tmp/image.jpg";

    // GET para visualizar a imagem: /api/image?show=1
    if (req.method === "GET" && req.query.show) {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Nenhuma imagem salva." });
        }
        const image = fs.readFileSync(filePath);
        res.setHeader("Content-Type", "image/jpeg");
        return res.send(image);
    }

    // Apenas POST para upload
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Use POST para enviar a imagem." });
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    try {
        fs.writeFileSync(filePath, buffer);
        const proto = req.headers["x-forwarded-proto"] || "https";
        const host = req.headers.host;
        const publicUrl = `${proto}://${host}/api/image?show=1`;

        return res.status(200).json({
            message: "Imagem salva (substituiu a anterior).",
            url: publicUrl,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Falha ao salvar a imagem." });
    }
}
