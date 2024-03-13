export default async function fetchUserProgress(courseId, axiosInstance) {
  // fetch the lesson/sublessons data from the server
  try {
    const progress = await axiosInstance(`/learning/progress/${courseId}`);
    return progress;
  } catch (error) {
    console.error(error);
  }

}
