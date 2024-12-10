import joi from "joi";

const bookSchema = joi.object({
    id: joi.string().required(),
    title: joi.string().required(),
    author: joi.string().required(),
    genre: joi.string().optional(),
    condition: joi.string().valid("new", "good", "worn").required(),
    owner: joi.string().required(),
    price: joi.number().required(),
});

export default bookSchema;
