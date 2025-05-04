import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import User from "../schemas/User.js";
import Class from "../schemas/Class.js";
import { clerkClient } from "@clerk/express";
import { validateInput } from "../../src/utils/backend/validate-utils.js";

const router = express.Router();

// Sign up
router.post('/sign-up', async (req, res) => {
  try {
    const { firstName, lastName, email, whatsapp, clerkId } = req.body;

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


// Get Student's classes by ID
router.get('/students-classes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await User.findOne({ _id: id }, { enrolledClasses: 1, _id: 0 });
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Edit user
router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete User
router.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedUser = await User.findOne({ _id: id });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // remove student from enrolled classes' roster
    await Promise.all(
      deletedUser.enrolledClasses.map(async (classId) => {
        try {
          const classDoc = await Class.findById(classId);

          if (classDoc) {
            await Class.findByIdAndUpdate(classId, { $pull: { roster: id } });
          } else {
            await Conversation.findByIdAndUpdate(classId, { $pull: { roster: id } });
          }
        } catch (err) {
          throw err;
        }
      })
    );

    // delete user
    await clerkClient.users.deleteUser(deletedUser.clerkId);
    await User.findByIdAndDelete(id);

    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
