import multer from 'multer'
import * as fs from "node:fs";
import * as path from "node:path";
import {Handlinerror} from "../handling/handlinerror.js";
import {validation} from "../validation/validation.js";

const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const simpan=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,uploadDir)
    },
    filename:function (req,file,cb) {
        const uniquename=Date.now()+'_'+Math.round(Math.random()*1E9)
        const file_ext=path.extname(file.originalname)
        cb(null,file.fieldname+'_'+uniquename+file_ext)
    }
})
const filefilter = (req,file,cb) => {
    const allowedMimeTypes = [
        'application/pdf', // .pdf
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'text/plain' // .txt
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Terima file
    } else {
        // Tolak file dan kirim error
        cb(new Handlinerror(401,'Invalid file type. Only PDF, DOCX, and TXT are allowed.\''), false);
    }
}
const upload=multer({
    storage:simpan,
    fileFilter:filefilter,
    limits:{
        fileSize:5*1024*1024
    }
})
const uploaddoc=upload.fields([
    {
        name:'cv',
        maxCount:1
    },
    {
        name:'project_report',
        maxCount: 1
    }
])


export default {
    uploaddoc,
}