import Joi from "joi";

const createevaluationmodel=Joi.object({
    cvPath:Joi.string().required().messages({
        'string.empty': 'CV path is required.',
        'any.required': 'CV path is required.'
    }),
    projectReportPath:Joi.string().required().messages({
        'string.empty': 'Project Report path is required.',
        'any.required': 'Project Report path is required.'
    })
})
const getresultmodel=Joi.string().uuid().required().messages({ // Memastikan ID adalah UUID yang valid
    'string.guid': 'Job ID must be a valid UUID.',
    'any.required': 'Job ID is required.'
})
export default {
    createevaluationmodel,
    getresultmodel
}