import { Router } from "express";
import { getAssignment, getAssignmentById, postAssignment, editAssignment, deleteAssignment } from "../controllers/assignmentController.js";

const assignmentRouter = Router();

assignmentRouter.get('/', getAssignment);
assignmentRouter.get('/:assignmentId', getAssignmentById);
assignmentRouter.post('/', postAssignment);
assignmentRouter.put('/:assignmentId/edit', editAssignment);
assignmentRouter.delete('/:assignmentId/delete', deleteAssignment);

export default assignmentRouter;