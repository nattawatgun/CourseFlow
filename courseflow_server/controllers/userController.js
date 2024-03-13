import { prisma } from "../app.js";
import cloudinary from 'cloudinary';
import cdConfig from "../utils/cloudinary_config.js";
import courseLessons from "../prisma/lessons.js";

// ขอ desired course ทั้งหมด
// export async function getDesiredCourse(req, res) {
//   try {
//     const getDesiredCourse = await prisma.userDesiredCourse.findMany();
//     return res.status(200).json({
//       status: "success",
//       message: "SuccessFully fetch desired courses",
//       data: getDesiredCourse
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "error",
//       message: "Internal server error"
//     });
//   };
// };

export async function getUserProfile(req, res) {
  try {
    const userId = req.auth.payload.sub
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    }
    )
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const { name, dateOfBirth, educationalBackground, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name,
        dateOfBirth,
        educationalBackground,
        email
      }
    });

    return res.status(200).json({
      updatedUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}

export async function captureUserAvatarUrl(req, res) {
  const userId = req.auth.payload.sub;
  const avatarUrl = req.body.avatarUrl;
  try {
    const result = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatarUrl
      }
    })
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Unknown internal error" })
  }

}


export async function authorizePhotoUpload(req, res) {
  try {
    const trimmedUserId = req.auth.payload.sub.slice(6); // trim auth0| to make folder name URL
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: `avatar/${trimmedUserId}`
    }, cloudinary.config().api_secret);

    // Respond with necessary data for the upload
    return res.status(200).json({
      timestamp: timestamp,
      signature: signature,
      cloudname: cloudinary.config().cloud_name,
      apiKey: cloudinary.config().api_key
    });
  } catch (error) {
    console.error('Error authorizing photo upload:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteAvatar(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const trimmedUserId = userId.slice(6);

    // Delete avatar from cloudinary storage
    const deletion = await cloudinary.v2.api.delete_resources_by_prefix(`avatar/${trimmedUserId}`);
    console.log(deletion)

    // Update user's avatarUrl to null in the database
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatarUrl: null
      }
    });

    res.json({ message: "avatar deleted" });
  } catch (error) {
    console.log("Error deleting the resources", error)
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ขอ desired course ทั้งหมด ตาม userId นั้นๆ
export async function getDesiredCourseByUserId(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const getDesiredCourseByUserId = await prisma.userDesiredCourse.findMany({
      where: {
        userId: userId
      },
      include: { course: true }
    });
    return res.status(200).json({
      status: "success",
      message: "Desired courses fetched successfully",
      data: getDesiredCourseByUserId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  };
};

// ขอ desired course ของ userId นั้นๆ ตาม courseId นั้นๆ
export async function getDesiredCourseUserIdByCourse(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const courseId = req.params.courseId;
    const desiredCourse = await prisma.userDesiredCourse.findFirst({
      where: {
        userId,
        courseId: Number(courseId)
      }
    });
    res.json(desiredCourse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  };
};

// สร้าง desired course ให้กับ userId และ courseId นั้นๆ
export async function createDesireCourse(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const courseId = Number(req.body.courseId);
    const desireCourseUser = await prisma.userDesiredCourse.create({
      data: {
        userId,
        courseId: Number(courseId)
      }
    });
    return res.status(201).json({
      status: "success",
      message: "Desired course created successfully",
      data: desireCourseUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal sever error"
    });
  };
};

// ลบ desired course ตาม userId และ courseId นั้นๆ
export async function deleteDesiredCourse(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const courseId = Number(req.body.courseId);
    const deleteDesiredCourse = await prisma.userDesiredCourse.deleteMany({
      where: {
        userId,
        courseId
      }
    });
    return res.status(200).json({
      status: "success",
      message: "Your desired course has been deleted"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  };
};

// ลบ subscribed course ตาม userId และ courseId นั้นๆ
export async function deleteSubscribedCourse(req, res) {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;
    const deleteSubscribedCourse = await prisma.courseEnrollment.deleteMany({
      where: {
        userId,
        courseId
      }
    });
    return res.status(200).json({
      status: "success",
      message: "Your subscribed course has been deleted"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  };
};

// ขอ subscribed course ทั้งหมด
export async function getSubscribedCourse(req, res) {
  try {
    const getSubscribedCourse = await prisma.courseEnrollment.findMany();
    return res.status(200).json({
      status: "success",
      message: "Successfully fetched subscribed courses",
      data: getSubscribedCourse
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  };
};

// ขอ subscribed course ทั้งหมดตาม userId นั้นๆ
export async function getSubscribedCourseByUserId(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const courseSubscriptions = await prisma.courseEnrollment.findMany({
      where: {
        userId
      }, include: {
        course: true
      }
    });
    return res.status(200).json(courseSubscriptions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  };
};

// ขอ subscribed course ของ userId นั้นๆ ตาม courseId นั้นๆ
export async function getSubscribedCourseUserIdByCourse(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const { courseId } = req.params;
    const courseSubscription = await prisma.courseEnrollment.findFirst({
      where: {
        userId,
        courseId: Number(courseId)
      }
    });
    res.json(courseSubscription)
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  };
};

// สร้าง subscribed course ให้กับ userId และ courseId นั้นๆ
export async function createSubscribedCourse(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const { courseId } = req.params;

    const userSubscription = await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId: Number(courseId)
      }
    });
    return res.json(userSubscription);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal sever error"
    });
  };
};


// ขอ subscribed course ตาม userId นั้น ๆ พร้อมข้อมูลของแต่ละคอร์ส
export async function getSubscribedCourseByUserIdWithDetails(req, res) {
  try {
    const userId = req.auth.payload.sub;
    const enrolledCourses = await prisma.courseEnrollment.findMany({
      where: {
        userId
      },
      include: {
        course: true
      }
    })

    const coursesWithLessonCounts = await Promise.all(enrolledCourses.map(async (enrollment) => {
      const totalLessons = await prisma.lesson.count({
        where: {
          courseId: enrollment.course.id,
        },
      });
      return {
        ...enrollment.course,
        totalLessons,
      };
    }));

    return res.json({
      status: "success",
      message: "Subscribed courses fetched successfully",
      data: coursesWithLessonCounts
    });
  } catch (error) {
    res.status(500).json({ error: "Unexpected error." })
    return console.log(error)
  };
}


export async function getUserAssignments(req, res) {
  const userId = req.auth.payload.sub
  try {
    const getSubscribedCourseByUserIdWithDetails = await prisma.userAssignment.findMany({
      where: {
        userId
      },
      include: {
        assignment: true,
        course: {
          select: {
            name: true,
            id: true
          }
        }
      }
    });
    return res.json({
      status: "success",
      message: "Subscribed courses fetched successfully",
      data: getSubscribedCourseByUserIdWithDetails
    });
  } catch (error) {
    return console.log(error)
  };
};

export async function createAssignmentSubmission(req, res) {
  const userId = req.auth.payload.sub;
  const { assignmentId, answer, userAssignmentId } = req.body;
  if (!assignmentId) {
    res.status(400).json({
      success: false,
      error: "Missing assignment ID"
    })
    return
  }
  if (!answer) {
    res.status(400).json({
      success: false,
      error: "Missing answer"
    })
    return
  }

  try {
    const updatedSubmission = await prisma.userAssignment.update({
      where: {
        id: userAssignmentId,
      },
      data: {
        answer,
        isSubmitted: true,
        submittedDate: new Date(),
      },
    });

    if (!updatedSubmission) {
      res.status(404).json({
        success: false,
        error: "User assignment not found",
      });
      return;
    }

    res.json({
      success: true,
      updatedSubmission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Error updating user assignment",
    });
  }
}
