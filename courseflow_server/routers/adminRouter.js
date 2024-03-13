import { Router } from "express";
import { authorizeMaterialUpload, getCourseDataById, updateCourse } from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.post('/authorize-upload', authorizeMaterialUpload);
adminRouter.get('/course/:courseId', getCourseDataById);
adminRouter.put('/course', updateCourse)
// adminRouter.put('/course/:courseId', updateCourse);

export default adminRouter;