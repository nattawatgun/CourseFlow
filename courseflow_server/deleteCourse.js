import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



async function deleteCourse(courseId) {
  try {
    const result = await prisma.course.delete({
      where: {
        id: courseId
      }
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
  finally {
    await prisma.$disconnect();
  }

}

console.log(await deleteCourse(7));
