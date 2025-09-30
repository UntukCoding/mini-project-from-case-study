
import pdf from 'pdf-parse-new'
import mammoth from "mammoth";
import fs2 from "node:fs/promises";
import fs from "node:fs";
import read_file_service from "../service/read_file_service.js";
import {expect} from "@jest/globals";

jest.mock('node:fs/promises')
jest.mock('pdf-parse-new')
jest.mock('mammoth')

describe('shoubd ded', () => {
    it('should be fine', async () => {
        await fs2.readFile(Buffer.from('asdasda'))
        await pdf.mockResolvedValue({text:"asdasdasd"})
        const content=await read_file_service.parsedata('path/to/file.pdf')
        expect(content).toBe('asdasdasd')
    });
    it('should be fine2', async () => {
        await fs2.readFile.mockResolvedValue(Buffer.from('asdasdadadsa'))
        await mammoth.extractRawText.mockResolvedValue({value:"asdasdasdasd"})

        const parse=await read_file_service.parsedata('path/to/file.docx')
        expect(parse).toBe('asdasdasdasd')
    });
    it('should be good', async () => {
        await fs2.readFile.mockResolvedValue(Buffer.from('asdasdadadsa'))
        const result=await read_file_service.parsedoc('path/to/file.zip')
        expect(result).toThrow('Unsupported file type');
    });
});

