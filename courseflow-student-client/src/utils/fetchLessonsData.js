export default async function fetchLessonsData(courseId, axiosInstance) {
  // fetch the lesson/sublessons data from the server
  try {
    const lessons = await axiosInstance(`/learning/course/${courseId}`);
    return lessons;
  } catch (error) {
    console.error(error);
  }

}

