import { Router } from "express";
import { getSubscribedCourseContent, getUserCourseProgress, updateVideoProgress } from "../controllers/learningController.js";

const learningRouter = Router();

learningRouter.get('/course/:courseId', getSubscribedCourseContent)
learningRouter.get('/progress/:courseId', getUserCourseProgress)
learningRouter.patch('/video-progress', updateVideoProgress)

export default learningRouter;