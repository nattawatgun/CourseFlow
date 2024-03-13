import { matchedData } from "express-validator";
import management from "../utils/auth0_management.js";
import { prisma } from "../app.js";


export default async function createNewUser(req, res) {
  const formData = matchedData(req);
  console.log(formData);
  try {
    // todo: use Auth0 Management API to create a new user.
    // todo: add Learner role to this user
    // todo: return 409 conflict if email is already registered
    // Create an account on Auth0
    const userCreate = await management.users.create({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      verify_email: false,
      connection: "Username-Password-Authentication"
    })


    // Assign the user the "Learner" role.
    const userRollAssign = await management.roles.assignUsers({ id: 'rol_IptbyAo7W6qnf8BB' }, { users: [userCreate.data.user_id] });

    // Add the user to Courseflow's User table.
    const result = await prisma.user.create({
      data: {
        id: userCreate.data.user_id,
        email: formData.email,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        educationalBackground: formData.educationalBackground
      }
    })
    return res.status(200).json({ message: "User created successfully." })
  }
  catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({ error: "A user with this email already exists." })
    }
    console.log(error)
    return res.status(500).json({ error: 'An internal server error occurred' });
  }
};