import { Router } from "express";
import { getAllCoursesDetail, getCourseDetailsById, getCourseDetail, createCourse, deleteCourse, editCourse } from "../controllers/courseController.js";




const courseRouter = Router();

courseRouter.get('/:courseId', getCourseDetailsById);
courseRouter.get('/', getAllCoursesDetail);
courseRouter.get('/detail/test', getCourseDetail);

courseRouter.post('/', createCourse);
courseRouter.delete('/:courseId', deleteCourse);
courseRouter.put('/:courseId', editCourse);

export default courseRouter;