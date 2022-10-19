import { createHash } from "crypto";
import { join } from "path"
import fs from "fs";

export function Hash(password) {
    const hash = createHash('sha256').update(password ?? "").digest('base64');
    return hash;
}

export async function UploadImage(filename, buffer) {
    const pathFileName = join('src', 'uploads', 'images', filename);
    fs.writeFileSync(pathFileName, buffer)
}