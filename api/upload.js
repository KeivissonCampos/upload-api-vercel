import { put } from '@vercel/blob';
import multiparty from 'multiparty';

export const config = {
    api: { bodyParser: false }
};

export default function handler(req, res) {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        const file = files.file[0];

        // salva no Blob Storage da Vercel, arquivo sempre sobrescrito:
        const blob = await put("foto-temporaria.jpg", file, {
            access: "public",
            addRandomSuffix: false  // sobrescreve
        });

        res.status(200).json({
            url: blob.url
        });
    });
}
