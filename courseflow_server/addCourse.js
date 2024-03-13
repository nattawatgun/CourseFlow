import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const courseData = {
  name: "Demo course",
  detail: "It's really a demo course. Nothing much else to say.",
  summary: "This is a demo course",
  coverImageUrl: "https://placehold.co/400",
  coverImageResId: "demoid5555",
  videoTrailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  videoTrailerResId: "demores1111",
  totalLearningTime: "12 hours",
  price: 999,
  lessons: [
    {
      title: "Introduction to Philosophy of Technology",
      sublessons: [
        {
          title: "Defining Technology and Its Impact",
          videoUrl: "https://example.com/video21",
        },
        {
          title: "Historical Perspectives on Technology",
          videoUrl: "https://example.com/video22",
        },
      ],
    },
    {
      title: "Why Technology",
      sublessons: [
        {
          title: "Impact of Technology",
          videoUrl: "https://example.com/video21",
        },
        {
          title: "All People Seems to Need Data Processing",
          videoUrl: "https://example.com/video22",
        },
      ],
    },
  ]
}



async function createCourse(courseData, lessonsData) {
  const course = await prisma.course.create({
    data: {
      ...courseData,
      lessons: {
        create: courseData.lessons.map((lesson) => ({
          title: lesson.title,
          sublessons: {
            create: lesson.sublessons,
          },
        })),
      },
    },
  });
  console.log(course);
}

createCourse(courseData, lessons)
  .then(() => console.log('Course created successfully.'))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });