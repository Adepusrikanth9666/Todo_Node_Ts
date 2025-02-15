import { body,ValidationChain } from "express-validator";
import { Priority } from "../enums/Priority";
import { Status } from "../enums/Status";
export const createValidator: ValidationChain[] = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("The Task title is mandatory")
    .trim()
    .isString()
    .withMessage("Title needs to be in text format"),
  body("date")
    .not()
    .isEmpty()
    .withMessage("The task date is mandatory")
    .isString()
    .withMessage("The date needs to be a valid data format"),
  body("description")
    .trim()
    .isString()
    .withMessage("Description needs to be in text format"),
  body("priority")
    .trim()
    .isIn([Priority.normal, Priority.low, Priority.high])
    .withMessage("Priority can be only normal low and high"),
  body("status")
    .trim()
    .isIn([Status.completed, Status.todo, Status.inprogress])
    .withMessage("Status can only be todo,inprogress or complete"),
];


export const updateValidator =[

  body('id').not().isEmpty().withMessage('The Task id is mandatory').trim().isString().withMessage('ID needs to be a valid uuid format'),
  body("status")
    .trim()
    .isIn([Status.completed, Status.todo, Status.inprogress])
    .withMessage("Status can only be todo,inprogress or complete")]