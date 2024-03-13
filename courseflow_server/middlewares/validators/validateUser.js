import { checkSchema, validationResult } from "express-validator";

function validateUser(req, res, next) {
  const userCreationSchema = {
    name: {
      notEmpty: {
        errorMessage: 'Name cannot be empty',
      },
      isString: {
        errorMessage: 'Name must be a string',
      },
    },
    email: {
      errorMessage: 'Invalid email',
      isEmail: true,
    },
    password: {
      isLength: {
        options: { min: 12 },
        errorMessage: 'Password should be at least 12 chars',
      },
    },
    dateOfBirth: {

      custom: {
        options: (value) => {
          const birthDate = new Date(value);
          const currentDate = new Date();
          const sixYearsAgo = new Date(currentDate.getFullYear() - 6, currentDate.getMonth(), currentDate.getDate());

          // Check if the date is valid
          if (isNaN(birthDate.getTime())) {
            throw new Error('Invalid date of birth');
          }

          if (birthDate > currentDate) {
            throw new Error('Date of birth must be in the past');
          }
          if (birthDate > sixYearsAgo) {
            throw new Error('User must be more than 6 years old');
          }
          return true;
        },
      }
    },
    educationalBackground: {
      exists: {
        errorMessage: 'Educational background is required',
      },
      notEmpty: {
        errorMessage: 'Educational background cannot be empty',
      },
      isString: {
        errorMessage: 'Educational background must be a string',
      },
    }

  }

  const validations = checkSchema(userCreationSchema);

  // Run validations
  Promise.all(validations.map(validation => validation.run(req)))
    .then(() => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // If no errors, proceed to next middleware
      next();
    })
    .catch(next); // handle any unexpected errors


}


export default validateUser;