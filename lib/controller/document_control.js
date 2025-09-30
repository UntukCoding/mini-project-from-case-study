
import * as fs from "node:fs";

const uploaddocumentcontrol = async (req,res,next) => {
    try {
        if (!req.files || !req.files.cv || !req.files.project_report){
            res.status(401).send({
                "status":"error",
                "message":"Both CV and Project Report files are required."
            })
        }
        const cvPath = req.files.cv[0].path
        const projectReportPath =req.files.project_report[0].path
        res.status(201).json({
            status: 'success',
            message: 'Files uploaded successfully. Please proceed to evaluation.',
            data: {
                cvPath: cvPath,
                projectReportPath: projectReportPath
            }
        });
    }catch (e) {
        next(e)
    }
}

export default {
    uploaddocumentcontrol,
}