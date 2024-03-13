-- CreateEnum
CREATE TYPE "Completion" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "educationalBackground" TEXT NOT NULL,
    "avatarUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDesiredCourse" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "UserDesiredCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseEnrollment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "courseCompletion" "Completion" NOT NULL DEFAULT 'NOT_STARTED',

    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssignment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "sublessonId" INTEGER NOT NULL,
    "answer" TEXT,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "completeByDate" TIMESTAMP(3),
    "submittedDate" TIMESTAMP(3),

    CONSTRAINT "UserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" SERIAL NOT NULL,
    "subLessonId" INTEGER NOT NULL,
    "courseEnrollmentId" INTEGER NOT NULL,
    "videoCompletion" "Completion" NOT NULL DEFAULT 'NOT_STARTED',

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "materialsId" TEXT,
    "coverImageUrl" TEXT NOT NULL,
    "coverImageResId" TEXT,
    "videoTrailerUrl" TEXT NOT NULL,
    "videoTrailerResId" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "totalLearningTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAttachment" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "fileUrl" TEXT,

    CONSTRAINT "CourseAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "index" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sublesson" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "index" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "videoResId" TEXT,
    "assignmentRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Sublesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "sublessonId" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAssignment_userId_assignmentId_key" ON "UserAssignment"("userId", "assignmentId");

-- AddForeignKey
ALTER TABLE "UserDesiredCourse" ADD CONSTRAINT "UserDesiredCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDesiredCourse" ADD CONSTRAINT "UserDesiredCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_sublessonId_fkey" FOREIGN KEY ("sublessonId") REFERENCES "Sublesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_subLessonId_fkey" FOREIGN KEY ("subLessonId") REFERENCES "Sublesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_courseEnrollmentId_fkey" FOREIGN KEY ("courseEnrollmentId") REFERENCES "CourseEnrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAttachment" ADD CONSTRAINT "CourseAttachment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sublesson" ADD CONSTRAINT "Sublesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_sublessonId_fkey" FOREIGN KEY ("sublessonId") REFERENCES "Sublesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
