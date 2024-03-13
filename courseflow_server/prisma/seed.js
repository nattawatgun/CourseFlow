import { PrismaClient } from '@prisma/client'
import courses from './courses.js';
import courseLessons from './lessons.js';
import users from './users.js'

const prisma = new PrismaClient();

async function addCoursesToDatabase() {
  for (const course of courses) {
    try {
      const createdCourse = await prisma.course.create({
        data: course,
      });
      console.log(`Course added to the database: ${createdCourse.name}`);
    } catch (error) {
      console.error(`Error adding course to the database: ${error.message}`);
    }
  }
}

async function createLesson(lesson) {
  try {
    await prisma.lesson.create({
      data: lesson
    });
  } catch (error) {
    console.error(error)
  }
}

async function addLessonsToCourse() {
  for (const courseLesson of courseLessons) {
    for (const lesson of courseLesson) {
      await createLesson(lesson)
    }
  }
}

async function addUsersToDb() {
  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user
      }
    })
  }
}

async function addAssignment() {
  await prisma.assignment.create({
    data: {
      title: "What is an apple?",
      duration: 3,
      sublessonId: 3
    }
  })
}

async function enrollUser() {
  await prisma.courseEnrollment.create({
    data: {
      userId: "auth0|65cbe478365d79c2fb972a8e",
      courseId: 1
    }
  })
}



async function main() {

  await addCoursesToDatabase();
  await addLessonsToCourse();
  await addUsersToDb();
  await addAssignment();
  await enrollUser();


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
