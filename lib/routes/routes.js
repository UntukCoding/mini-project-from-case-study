import express from "express";
import evaluationservice from "../service/multer_service.js";
import document_control from "../controller/document_control.js";
import {multermiddleware} from "../middleware/multermiddleware.js";
import eval_result_control from "../controller/eval_result_control.js";

export const routes=express.Router()

routes.use(multermiddleware)
routes.post('/uploaddoc',evaluationservice.uploaddoc,document_control.uploaddocumentcontrol)
routes.post('/evaluatedoc',eval_result_control.cretaeeval1_control)
routes.get('/results',eval_result_control.getresult_control)