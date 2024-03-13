import { prisma } from "../app.js";

export async function getSubscribedCourseContent(req, res) {
  console.log(req.body)
  try {
    const courseId = Number(req.params.courseId);
    const userId = req.auth.payload.sub;
    // check if user is subscribed to the course
    const userEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId,
        courseId
      }
    });

    // query the course data if there is a subscription.
    if (userEnrollment) {
      const courseContent = await prisma.course.findFirst({
        where: {
          id: courseId
        },
        include: {
          lessons: {
            include: {
              sublessons: true
            }
          }
        }
      });

      if (courseContent) {
        courseContent.enrollmentId = userEnrollment.id;
        res.json(courseContent);
      } else {
        // Course not found or no content available
        res.status(404).json({ message: "Course content not found." });
      }
    } else {
      res.status(401).json({ message: "User is not subscribed to this course." });
    }
  } catch (error) {
    console.error("Failed to retrieve course content:", error);
    // Generic error message for the client
    res.status(500).json({ message: "An error occurred while retrieving course content." });
  }
}

// how do i tell if this is a course is finished ...
// you can't tell from here, but you can check if an assignment is required after submitting video progress.
// if an assignment is required don't mark it finished.
// mark it finish once an assignment is submitted.
export async function getUserCourseProgress(req, res) {
  try {
    // Ensure courseId is a valid number
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const userId = req.auth.payload.sub;

    // Attempt to find the course enrollment and its progress
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId,
        courseId
      },
      include: {
        progress: {
          include: {
            sublesson: {
              include: {
                UserAssignment: {
                  where: {
                    userId
                  },
                  include: {
                    assignment: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Check if the enrollment or its progress exists
    if (!enrollment || !enrollment.progress) {
      return res.status(404).json({ message: "Course progress not found." });
    }

    // Respond with the found progress
    res.json(enrollment.progress);
  } catch (error) {
    console.error("Error fetching course progress:", error);
    // Respond with a generic error message
    res.status(500).json({ message: "An error occurred while fetching course progress." });
  }
}

// Record user video progress and hand out assignment after watching the video.
export async function updateVideoProgress(req, res) {
  try {
    const userId = req.auth.payload.sub; // Assuming this is correctly set from authentication middleware
    const { sublessonId, courseEnrollmentId, videoCompletion, courseId } = req.body;
    console.log('incoming request body', req.body)

    // Validate input parameters
    if (!sublessonId || !courseEnrollmentId) {
      return res.status(400).json({ message: "Sublesson ID and Course Enrollment ID are required." });
    }

    if (!["IN_PROGRESS", "COMPLETED"].includes(videoCompletion)) {
      return res.status(400).json({ message: "Invalid video status." });
    }

    // See if the sublesson we're updating exists and get its assignments
    const sublesson = await prisma.sublesson.findUnique({
      where: { id: sublessonId },
      include: { assignments: true }
    });

    if (!sublesson) {
      return res.status(404).json({ message: "Sublesson not found." });
    }

    let updates = { videoCompletion };

    // Check conditions to mark isComplete as COMPLETED
    // NO LONGER TRACKED IN THE PROGRESS MODEL, COMPUTE THIS IN THE FRONT END.
    // USING videoCompletion and UserAssignments

    // If videoCompleted is true and the the lesson has an assignment, return the assignment.

    // Find existing progress record or create a new one
    const existingProgress = await prisma.progress.findFirst({
      where: {
        courseEnrollmentId,
        subLessonId: sublessonId,
      },
    });



    if (existingProgress) {
      // check if the same video progress is sent to avoid extra database operation
      if (existingProgress.videoCompletion === videoCompletion || existingProgress.videoCompletion === 'COMPLETED') {
        return res.json({ message: `sublesson ${sublessonId}'s video is already ${existingProgress.videoCompletion}` })
      }
      console.log('about to update progress id', existingProgress.id)
      await prisma.progress.update({
        where: { id: existingProgress.id },
        data: updates,
      });

    } else {
      const progress = await prisma.progress.create({
        data: {
          courseEnrollmentId,
          subLessonId: sublessonId,
          ...updates,
        },
      });
      console.log('created a progress with id', progress.id)
    }

    // add assignments to homework book and tell the client to fetch them
    if (videoCompletion === 'COMPLETED') {
      if (sublesson.assignments.length > 0) {
        const userAssignmentData = sublesson.assignments.map(assignment => {
          const { id: assignmentId, sublessonId, duration } = assignment;
          // current unix timestamp + n days in milliseconds.
          const completeByDate = duration
            ? new Date(new Date().getTime() + (duration * 24 * 60 * 60 * 1000))
            : null;
          return {
            userId,
            assignmentId,
            courseId,
            sublessonId,
            completeByDate,
          }
        })
        await prisma.userAssignment.createMany({
          data: userAssignmentData,
          skipDuplicates: true,
        })
        // fetch the userAssignments (I know we could use userAssignmentData, but I need its db-generated id)
        const assignments = await prisma.userAssignment.findMany({
          where: {
            userId,
            sublessonId
          },
          include: {
            assignment: true
          }
        })
        return res.json({ procedure: "render-assignments", message: "This sublesson has assignment(s)", assignments })
      }
      else {
        return res.json({ procedure: "mark-finished", message: "This sublesson is finished" })
      }
    }
    else {
      return res.json({ procedure: "mark-inprogress", message: "This sublesson is in progress." })
    }

  } catch (error) {
    console.error("Error updating video progress:", error);
    return res.status(500).json({ message: "An error occurred while updating video progress." });
  }
}

