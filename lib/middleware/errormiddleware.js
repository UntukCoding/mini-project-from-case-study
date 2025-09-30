import {Handlinerror} from "../handling/handlinerror.js";

export const errormiddleware =  (err,req,res,next) => {
    if (!err){
        next();
        return;
    }
    if (err instanceof Handlinerror){
        res.status(err.status).json({
            errors:err.message
        }).end()
    }else{
        res.status(500).json({
            errors:err.message
        }).end()
    }
}