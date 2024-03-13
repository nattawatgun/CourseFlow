import { Router } from "express";
import {
  getDesiredCourseByUserId,
  getDesiredCourseUserIdByCourse,
  createDesireCourse,
  deleteDesiredCourse,
  getSubscribedCourseByUserId,
  getSubscribedCourseUserIdByCourse,
  createSubscribedCourse,
  getUserAssignments,
  createAssignmentSubmission,
  authorizePhotoUpload,
  getUserProfile,
  updateUserProfile,
  captureUserAvatarUrl,
  deleteAvatar,
  getSubscribedCourseByUserIdWithDetails
} from '../controllers/userController.js';


const userRouter = Router();




// Desired Course Operations

// Route for getting a desired course by courseId
userRouter.get('/desired-course/:courseId', getDesiredCourseUserIdByCourse);

// Route for getting all desired courses for a user
userRouter.get('/desired-course', getDesiredCourseByUserId);
userRouter.post('/desired-course', createDesireCourse);
userRouter.delete('/desired-course', deleteDesiredCourse);

// Subscribed Course Operations.
// userRouter.get('/subscribed-course', getSubscribedCourse); //ดู subscribedCourse ทั้งหมด ทั้ง userId courseId
userRouter.get('/subscribed-course', getSubscribedCourseByUserIdWithDetails); //ดู subscribedCourse ทั้งหมดของ user ตาม Id นั้นๆ
userRouter.get('/subscribed-course/:courseId', getSubscribedCourseUserIdByCourse); //ดู subscribedCourse ทั้งหมดของ userId และ courseId นั้นๆ
userRouter.post('/subscribed-course/:courseId', createSubscribedCourse);
// userRouter.delete('/subscribed-course/:userId', deleteSubscribedCourse);

userRouter.get('/assignments', getUserAssignments)
userRouter.put('/assignment', createAssignmentSubmission)
// userRouter.get('/assignments', getUserAssignments)

// By panat
userRouter.get('/subscribed-course-detail/:userId/course', getSubscribedCourseByUserIdWithDetails);

// By panat
userRouter.get('/subscribed-course-detail/:userId/course', getSubscribedCourseByUserIdWithDetails); // เอาข้อมูล Subscribed Course ทั้งหมด ตาม User id

// Jimmy: Get signature for client-side Cloudinary upload.
userRouter.get('/authorize-upload', authorizePhotoUpload)

// Jimmy: User Profile Operations
userRouter.get('/profile', getUserProfile)
userRouter.put('/profile', updateUserProfile)
userRouter.delete('/avatar', deleteAvatar)
userRouter.post('/profile/capture_url', captureUserAvatarUrl)

export default userRouter;