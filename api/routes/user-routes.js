import "dotenv/config";
import express from "express";
import User from "../schemas/User.js";
import { validateInput } from "../utils/validate-utils.js";

const router = express.Router();

// Sign up
router.post('/sign-up', async (req, res) => {
  try {
    const { firstName, lastName, email, whatsapp, password, clerkId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Create new user with separate first/last name fields
    const newUser = new User({
      firstName,
      lastName,
      email,
      whatsapp,
      password,
      clerkId
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (error) {
    console.error('Failed to sign up:', error);
    res.status(500).json({ message: 'Failed to sign up' });
  }
})

// Get Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
})


// Get User
router.get('/user', async (req, res) => {
  const allowedFields = ['_id', 'email', 'whatsapp']
  const filters = validateInput(req.query, allowedFields)

  if (Object.keys(filters).length === 0) {
    res.status(404).send('Error: user not found', err);
  }

  try {
    const user = await User.findOne(filters);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
})

export default router;
