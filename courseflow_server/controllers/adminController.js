import { prisma } from "../app.js";
import cloudinary from 'cloudinary';
import cdConfig from "../utils/cloudinary_config.js";

export async function authorizeMaterialUpload(req, res) {
  try {
    console.log(req.body)
    const { materialsId, materialType } = req.body;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: `${materialsId}/`,
      tags: `temporary ${materialType}`
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

export async function getCourseDataById(req, res) {
  const courseId = Number(req.params.courseId);
  try {
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

    return res.json(courseContent)
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCourse(req, res) {
  console.log(req.body)
  const {
    id, // Course ID
    name,
    detail,
    summary,
    price,
    totalLearningTime,
    coverImg,
    trailerVid,
    lessons,
    deletedLessons,
    deletedSublessons,
  } = req.body;

  try {
    const txReesult = await prisma.$transaction(async (tx) => {
      // Step 2: Update the Course
      await tx.course.update({
        where: { id },
        data: {
          name,
          detail,
          summary,
          price: parseFloat(price),
          totalLearningTime,
          coverImageUrl: coverImg.url,
          coverImageResId: coverImg.publicId,
          videoTrailerUrl: trailerVid.url,
          videoTrailerResId: trailerVid.publicId,
        },
      });

      // Step 3: Delete specified Lessons and Sublessons
      if (deletedLessons.length > 0) {
        await tx.lesson.deleteMany({
          where: { id: { in: deletedLessons } },
        });
      }

      if (deletedSublessons.length > 0) {
        await tx.sublesson.deleteMany({
          where: { id: { in: deletedSublessons } },
        });
      }

      // Step 4: Update or Create Lessons and Sublessons
      for (const lesson of lessons) {
        let lessonId;
        let lessonUpdateData = {
          index: lesson.index,
          title: lesson.title,
        };

        if (lesson.id) {
          // Update existing lesson
          await tx.lesson.update({
            where: { id: lesson.id },
            data: lessonUpdateData,
          });
        } else {
          // Create new lesson
          const createdLesson = await tx.lesson.create({
            data: {
              ...lessonUpdateData,
              courseId: id, // Set course ID
            },
          });
          lessonId = createdLesson.id;
        }

        // Repeat similar logic for sublessons within each lesson
        for (const sublesson of lesson.sublessons) {
          let sublessonUpdateData = {
            title: sublesson.title,
            index: sublesson.index,
            videoUrl: sublesson.videoUrl,
            videoResId: sublesson.videoResId,
          };

          if (sublesson.id) {
            // Update existing sublesson
            await tx.sublesson.update({
              where: { id: sublesson.id },
              data: sublessonUpdateData,
            });
          } else {
            // Create new sublesson
            await tx.sublesson.create({
              data: {
                ...sublessonUpdateData,
                lessonId: lessonId,
              },
            });
          }
        }
      }


      return res.json({ success: true, message: "Course updated successfully" });
    }).catch((error) => {
      // Handle errors, rollback changes
      console.error(error);
      return res.status(500).json({ success: false, message: "Failed to update course", error });
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" })
  }
}

export async function deleteCourse(req, res) {
  const courseId = req.params.courseId;

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId
      }
    });
    if (!course) {
      return res.status(404).json({ error: `Course with ID:${courseId} not found` });
    }
  }
  catch (error) {
    return res.status(500).json({ error: 'Unknown error' })
  }

  try {
    const result = await prisma.course.delete({
      where: {
        id: courseId
      }
    });
    return res.json({ status: 'deleted', message: `Deleted course with ID:${courseId}` })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Couldn't delete course with id " + courseId })
  }

}

export async function deleteCldResource(req, res) {

}