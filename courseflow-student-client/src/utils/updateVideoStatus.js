// Generic function to update video status
export default function updateVideoStatus(
  sublessonId,
  courseEnrollmentId,
  videoCompletion,
  courseId,
  axiosInstance
) {
  // Ensure videoStatus is one of the allowed values
  if (!['IN_PROGRESS', 'COMPLETED'].includes(videoCompletion)) {
    throw new Error(
      'Invalid video status. Must be \'IN_PROGRESS\' or \'COMPLETED\'.'
    );
  }

  return axiosInstance
    .patch('/learning/video-progress', {
      sublessonId,
      courseEnrollmentId,
      videoCompletion,
      courseId
    })
    .then((response) => {
      console.log(`Progress updated to ${videoCompletion}`, response.data);
      return response;
    })
    .catch((error) => {
      console.error(`Error updating progress to ${videoCompletion}`, error);
    });
}
