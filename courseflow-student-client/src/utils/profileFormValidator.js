function getProfileFormValidator(withPassword = false) {
  const validator = {
    name: (value) => (value === '' ? 'Enter your name' : /^[a-zA-Z' -]+$/.test(value) ? null : 'Cannot use other special characters or numbers'),
    dateOfBirth: (value) => {
      const currentDate = new Date();
      const sixYearsAgo = new Date(currentDate.getFullYear() - 6, currentDate.getMonth(), currentDate.getDate());
      if (value === '') {
        return 'Please select your birth date.';
      } else if (value > sixYearsAgo) {
        return 'User must be more than 6 years old';
      } else {
        return null;
      }
    },
    educationalBackground: (value) => (value === '' ? 'Enter your education background' : null),
    email: (value) => (value === '' ? 'Enter your email' : /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email'),
  };

  if (withPassword) {
    validator.password = (value) => (value === '' ? 'Enter your password' : value.length <= 12 ? 'Password must have at least 13 letters' : null);
  }

  return validator;
}

export default getProfileFormValidator;