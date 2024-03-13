import { prisma } from "../app.js";

async function getAllCoursesDetail(req, res) {
  const keywords = req.query.keywords;
  const query = {};

  if (keywords) {
    query.name = { contains: keywords, mode: 'insensitive' };
  }

  try {
    const courses = await prisma.course.findMany({
      where: query,
      include: {
        _count: {
        select: { lessons: true },
    },
  },
    });

    return res.json(courses);
  }
  catch (error) {
    console.error(error);
    return res.json({ "message": "Internal server error" })
  }
}

async function getCourseDetail(req, res) {
  try {
    const courses = await prisma.course.findMany({
      where: { },
      include: {
        lessons: {
          include: {
            sublessons: true
          }
        }
      }
    });

    return res.json(courses);
  } catch (error) {
    console.error(error);
    return res.json({ "message": "Internal server error" })
  }
}

async function getCourseDetailsById(req, res) {
  const courseId = Number(req.params.courseId);
  const courseById = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      lessons: {
        select: {
          id: true,
          title: true,
          sublessons: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      }
    }
  })
  return res.json(courseById);
}

//create ตัวเก่าา ใช้งานได้ แต่ sublesson ไม่ขึ้น
async function createCourse(req, res) {
  console.log(req.body)
  console.log('lessonLa', req.body.lessons)
  const { name, price, totalLearningTime, summary, detail,coverImageUrl, coverImageResId, videoTrailerUrl, videoTrailerResId, lesson } = req.body;
  const newCourse = await prisma.course.create({
    data: {
      name,
      price: Number(price),
      totalLearningTime,
      summary,
      detail,
      coverImageUrl,
      coverImageResId,
      videoTrailerUrl,
      videoTrailerResId,
      lessons: {
        create: req.body.lessons.map((lesson) => ({
          title: lesson.title,
          sublessons: {
            create: lesson.subLessons,
          },
        })),
      },
    },
  });
  // console.log(course);
  return res.json({
    message: 'Course created succesfully',
    data: newCourse
  })
}

async function editCourse(req, res) {
  const courseId = req.params.courseId;
  const { name, price, totalLearningTime, summary, detail, coverImageUrl, coverImageResId, videoTrailerUrl, videoTrailerResId } = req.body;
  console.log(courseId)
  console.log('aaaa', req.body)
  try {
    const updatedCourse = await prisma.course.update({
      where: { id: Number(courseId) },
      data: {
        name,
        price: Number(price),
        totalLearningTime,
        summary,
        detail,
        coverImageUrl,
        coverImageResId,
        videoTrailerUrl,
        videoTrailerResId,
      },
    });
    res.json({
      message: 'Edited Success',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Could not update course' });
  }
}

async function deleteCourse(req, res) {
  const courseId = Number(req.params.courseId);

  // ลบ lessons ที่เกี่ยวข้องกับคอร์สนั้นๆ ก่อน
  await prisma.lesson.deleteMany({
    where: {
      courseId: courseId
    }
  });

  // ลบคอร์ส
  const deleteCourse = await prisma.course.delete({
    where: { id: courseId }
  });

  return res.json(deleteCourse);
}

export { getAllCoursesDetail, getCourseDetail, getCourseDetailsById, createCourse, editCourse, deleteCourse }
