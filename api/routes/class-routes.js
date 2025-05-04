import express from "express";
import mongoose from "mongoose";
import Class from '../schemas/Class.js';
import { validateInput } from "../utils/validate-utils.js";

const router = express.Router();

// Get Classes
router.get('/', async (req, res) => {
  try {
    if ('level' in req.query) {
      req.query.level = Number(req.query.level);
    }
    const allowedFields = ['level', 'instructor', 'ageGroup'];
    const filters = validateInput(req.query, allowedFields);

    if (filters.level !== undefined) {
      filters.level = { $eq: filters.level, $type: 'number' };
    } else {
      filters.level = { $type: 'number' };
    }

    //apply the filters directly to the database query
    const data = await Class.find(filters);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Get class by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await Class.findOne({ _id: id });
    res.json(data)

  } catch (err) {
    res.status(500).send(err);
  }
})

// Create Class
router.post('/', async (req, res) => {
  try {
    const { level, ageGroup, instructor, schedule } = req.body;

    // Check if class already exists
    const existingClasses = await Class.find({ level, ageGroup, instructor });
    const matchingSchedules = existingClasses.filter(cls =>
      cls.schedule.length === schedule.length &&
      cls.schedule.every(itemA =>
        schedule.some(itemB =>
          itemA.day === itemB.day &&
          itemA.startTime === itemB.startTime &&
          itemA.endTime === itemB.endTime
        )
      )
    );

    if (matchingSchedules.length > 0) {
      return res.status(409).json({
        message: 'Class already exists',
        class: matchingSchedules[0]
      });
    } else {
      const newClass = new Class({
        level,
        ageGroup,
        instructor,
        schedule,
      });

      await newClass.save();
      return res.status(201).json({
        message: 'Class created successfully',
        class: newClass
      });
    }
  } catch (error) {
    console.error('Failed to create class:', error);
    return res.status(500).json({ message: 'Failed to create class' });
  }
});

// Edit Class
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { level, ageGroup, instructor, schedule } = updates;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const existingClasses = await Class.find({ level: level, ageGroup: ageGroup, instructor: instructor });
    if (existingClasses.length !== 0) {
      const matchingSchedules = existingClasses.filter(cls =>
        cls.schedule.length === schedule.length &&
        cls.schedule.every(itemA =>
          schedule.some(itemB =>
            itemA.day === itemB.day &&
            itemA.startTime === itemB.startTime &&
            itemA.endTime === itemB.endTime
          )
        )
      );
      const duplicate = matchingSchedules.find(cls => cls._id.toString() !== id.toString());

      if (duplicate) {
        return res.status(409).json({
          message: 'Class already exists',
          class: duplicate
        });
      }
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error('Failed to update class details:', error);
    res.status(500).json({ message: 'Failed to update class details' });
  }
});

// Delete Class
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedClass = await Class.findOne({ _id: id });
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // remove class from student's enrolled classes
    await Promise.all(
      deletedClass.roster.map(studentId =>
        User.findByIdAndUpdate(studentId, { $pull: { enrolledClasses: id } })
          .catch(err => console.error(`Failed to update student ${studentId}:`, err)) // TODO: throw error?
      )
    );

    // delete class
    await Class.findByIdAndDelete(id);

    res.status(204).json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Failed to delete class:', error);
    res.status(500).json({ message: 'Failed to delete class' });
  }
});

export default router;