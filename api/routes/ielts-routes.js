import express from "express";
import mongoose from "mongoose";
import Class from '../schemas/Class.js';

const router = express.Router();

// Get IELTS classes
router.get("/", async (req, res) => {
  try {
    const data = await Class.find({ level: "ielts" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Get IETLS by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await Class.findOne({ _id: id, level: "ielts" });
    res.json(data)
  } catch (err) {
    res.status(500).send(err);
  }
})

// Create IETLS
router.post('/', async (req, res) => {
  try {
    const { ageGroup, instructor, schedule } = req.body;

    // Check if IELTS already exists
    const existingIelts = await Class.find({ level: "ielts", ageGroup, instructor });
    const matchingSchedules = existingIelts.filter(ielts =>
      ielts.schedule.length === schedule.length &&
      ielts.schedule.every(itemA =>
        schedule.some(itemB =>
          itemA.day === itemB.day &&
          itemA.startTime === itemB.startTime &&
          itemA.endTime === itemB.endTime
        )
      )
    );

    if (matchingSchedules.length > 0) {
      return res.status(409).json({
        message: 'IELTS class already exists',
        class: matchingSchedules[0]
      });
    } else {
      const newIelts = new Class({
        level: "ielts",
        ageGroup,
        instructor,
        schedule
      });

      await newIelts.save();
      return res.status(201).json({
        message: 'IELTS class created successfully',
        class: newIelts
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create IELTS class' });
  }
});

// Edit IELTS
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid IELTS Class ID' });
    }

    const existingIelts = await Class.find({ level: "ielts", ageGroup: updates.ageGroup, instructor: updates.instructor });
    if (existingIelts.length !== 0) {
      const matchingSchedules = existingIelts.filter(ielts =>
        ielts.schedule.length === updates.schedule.length &&
        ielts.schedule.every(itemA =>
          updates.schedule.some(itemB =>
            itemA.day === itemB.day &&
            itemA.startTime === itemB.startTime &&
            itemA.endTime === itemB.endTime
          )
        )
      );
      const duplicate = matchingSchedules.find(ielts => ielts._id.toString() !== id.toString());

      if (duplicate) {
        return res.status(409).json({
          message: 'IELTS class already exists',
          class: duplicate
        });
      }
    }

    const updateDIelts = await Class.findOneAndUpdate(
      { _id: id, level: "ielts" },
      updates,
      { new: true, runValidators: true }
    );

    if (!updateDIelts) {
      return res.status(404).json({ message: 'IELTS class not found' });
    }

    res.status(200).json(updateDIelts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update IELTS class' });
  }
});

// Delete IELTS
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedIelts = await Class.findOne({ _id: id, level: "ielts" });
    if (!deletedIelts) {
      return res.status(404).json({ message: 'IELTS class not found' });
    }

    // remove class from student's enrolled classes
    await Promise.all(
      deletedIelts.roster.map(studentId =>
        User.findByIdAndUpdate(studentId, { $pull: { enrolledClasses: id } })
          .catch(err => console.error(`Failed to update student ${studentId}:`, err)) // TODO: throw error?
      )
    );

    // delete conversation
    await Class.findByIdAndDelete(id);

    res.status(204).json({ message: 'IELTS class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete IELTS class' });
  }
});

export default router;
