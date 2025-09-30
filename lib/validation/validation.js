import {Handlinerror} from "../handling/handlinerror.js";

export const validation = (schema,request) => {
    const report=schema.validate(request)
    if (report.error) {
        throw new Handlinerror(404,report.error.message);
    }else{
        return report.value
    }
}