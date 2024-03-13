/*
  Warnings:

  - A unique constraint covering the columns `[subLessonId,courseEnrollmentId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Progress_subLessonId_courseEnrollmentId_key" ON "Progress"("subLessonId", "courseEnrollmentId");
