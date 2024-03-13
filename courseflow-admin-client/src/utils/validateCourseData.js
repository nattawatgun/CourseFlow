const courseValidationRules = {
  name: (value) =>
    value
      ? null
      : 'Please give this course a name',
  price: (value) =>
    /^\d+(\.\d{1,2})?$/.test(value)
      ? null
      : 'Price must be a valid number with up to two decimal places',
  totalLearningTime: (value) =>
    value > 0 ? null : 'Learning time must be greater than 0',
  summary: (value) =>
    value
      ? null
      : 'The summary is required.',
  detail: (value) =>
    value
      ? null
      : 'Course detail is required.',
  coverImg: (value) => {
    // console.log(imageUrl);
    // check if both values are present
    return null;
  },
  trailerVid: (value) => {

    return null;
  },
};

export default courseValidationRules;