-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_sublessonId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_courseEnrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_subLessonId_fkey";

-- DropForeignKey
ALTER TABLE "Sublesson" DROP CONSTRAINT "Sublesson_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "UserAssignment" DROP CONSTRAINT "UserAssignment_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "UserAssignment" DROP CONSTRAINT "UserAssignment_sublessonId_fkey";

-- DropForeignKey
ALTER TABLE "UserDesiredCourse" DROP CONSTRAINT "UserDesiredCourse_courseId_fkey";

-- AlterTable
ALTER TABLE "CourseEnrollment" ALTER COLUMN "courseCompletion" SET DEFAULT 'IN_PROGRESS';

-- AddForeignKey
ALTER TABLE "UserDesiredCourse" ADD CONSTRAINT "UserDesiredCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssignment" ADD CONSTRAINT "UserAssignment_sublessonId_fkey" FOREIGN KEY ("sublessonId") REFERENCES "Sublesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_subLessonId_fkey" FOREIGN KEY ("subLessonId") REFERENCES "Sublesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_courseEnrollmentId_fkey" FOREIGN KEY ("courseEnrollmentId") REFERENCES "CourseEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sublesson" ADD CONSTRAINT "Sublesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_sublessonId_fkey" FOREIGN KEY ("sublessonId") REFERENCES "Sublesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
