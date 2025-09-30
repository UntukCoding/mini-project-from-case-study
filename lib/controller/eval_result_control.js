import eval_and_result_service from "../service/eval_and_result_api_service.js";

const cretaeeval1_control = async (req,res,next) => {
    try {
        const request=await eval_and_result_service.createeval1_service(req.body)
        res.status(201).json(request)
    }catch (e) {
        console.log(e)
        next(e)
    }
}
const getresult_control = async (req,res,next) => {
    try {
        const result=await eval_and_result_service.getresult_service(req.query.id)
        res.status(200).json(result)
    }catch (e) {
        next(e)
    }
}

export default {
    cretaeeval1_control,
    getresult_control
}