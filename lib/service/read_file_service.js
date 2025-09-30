import pdf from 'pdf-parse-new'
import mammoth from "mammoth";
import fs from 'node:fs/promises'
import * as path from "node:path";
import url from "node:url";
import {loggerwinston} from "../config/loggerwinston.js";

const parsedoc =async (filepath) => {
    const __filename=url.fileURLToPath(import.meta.url)
    const __dirname=path.dirname(__filename)
    const projectRoot = path.join(__dirname, '..');
    const pisahkannamafile=filepath.split('/')
    const wherefile=path.join(projectRoot,pisahkannamafile[0],pisahkannamafile[1],pisahkannamafile[2])
    const extension=path.extname(wherefile).toLowerCase()
    const buffer=await fs.readFile(wherefile)
    if (extension === '.pdf') {
        return {
            mimetype:'application/pdf',
            buffervalue:buffer.toString('base64')
        }
    }  else if (extension === '.txt') {
        return {
            mimetype:'text/plain',
            buffervalue:buffer.toString('base64')
        }
    } else {
        throw new Error('Unsupported file type');
    }
}
const parsedata =async (filepath) => {
    const __filename=url.fileURLToPath(import.meta.url)
    const __dirname=path.dirname(__filename)
    const projectRoot = path.join(__dirname, '..');
    const pisahkannamafile=filepath.split('/')
    const wherefile=path.join(projectRoot,pisahkannamafile[0],pisahkannamafile[1],pisahkannamafile[2])
    const extension=path.extname(wherefile).toLowerCase()
    const buffer=await fs.readFile(wherefile)
    if (extension === '.pdf') {
        const data = await pdf(buffer);
        return data.text; // <-- Pastikan Anda mengembalikan data.text, BUKAN hanya data
    }

    if (extension === '.docx') {
        const { value } = await mammoth.extractRawText({ buffer });
        return value; // <-- Pastikan Anda mengembalikan value, BUKAN seluruh objeknya
    }

    if (extension === '.txt') {
        return buffer.toString('utf-8'); // <-- Ini sudah benar
    }
}
export default {
    parsedoc,
    parsedata
}