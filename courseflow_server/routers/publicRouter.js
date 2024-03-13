import { Router } from "express";
import createNewUser from "../controllers/registrationController.js";
import validateUser from "../middlewares/validators/validateUser.js";

const publicRouter = Router();

publicRouter.post('/user', validateUser, createNewUser);

export default publicRouter;