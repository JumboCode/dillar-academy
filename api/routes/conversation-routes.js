import express from "express";
import mongoose from "mongoose";
import Class from '../schemas/Class.js';

const router = express.Router();

// Get Conversation classes
router.get("/", async (req, res) => {
  try {
    const data = await Class.find({ level: "conversation" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Get Conversation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await Class.findOne({ _id: id, level: "conversation" });
    res.json(data)
  } catch (err) {
    res.status(500).send(err);
  }
})

// Create Conversation
router.post('/', async (req, res) => {
  try {
    const { ageGroup, instructor, schedule } = req.body;

    // Check if conversation already exists
    const existingConversations = await Class.find({ level: "conversation", ageGroup, instructor });
    const matchingSchedules = existingConversations.filter(convo =>
      convo.schedule.length === schedule.length &&
      convo.schedule.every(itemA =>
        schedule.some(itemB =>
          itemA.day === itemB.day &&
          itemA.startTime === itemB.startTime &&
          itemA.endTime === itemB.endTime
        )
      )
    );

    if (matchingSchedules.length > 0) {
      return res.status(409).json({
        message: 'Conversation class already exists',
        class: matchingSchedules[0]
      });
    } else {
      const newConversation = new Class({
        level: "conversation",
        ageGroup,
        instructor,
        schedule
      });

      await newConversation.save();
      return res.status(201).json({
        message: 'Conversation created successfully',
        class: newConversation
      });
    }
  } catch (error) {
    console.error('Error creating:', error);
    return res.status(500).json({ message: 'Failed to create conversation class' });
  }
});

// Edit Conversation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Conversation Class ID' });
    }

    const existingConversations = await Class.find({ level: "conversation", ageGroup: updates.ageGroup, instructor: updates.instructor });
    if (existingConversations.length !== 0) {
      const matchingSchedules = existingConversations.filter(convo =>
        convo.schedule.length === updates.schedule.length &&
        convo.schedule.every(itemA =>
          updates.schedule.some(itemB =>
            itemA.day === itemB.day &&
            itemA.startTime === itemB.startTime &&
            itemA.endTime === itemB.endTime
          )
        )
      );
      const duplicate = matchingSchedules.find(convo => convo._id.toString() !== id.toString());

      if (duplicate) {
        return res.status(409).json({
          message: 'Conversation class already exists',
          class: duplicate
        });
      }
    }

    const updatedConversation = await Class.findOneAndUpdate(
      { _id: id, level: "conversation" },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ message: 'Conversation class not found' });
    }

    res.status(200).json(updatedConversation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update conversation class' });
  }
});

// Delete Conversation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedConversation = await Class.findOne({ _id: id, level: "conversation" });
    if (!deletedConversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // remove class from student's enrolled classes
    await Promise.all(
      deletedConversation.roster.map(studentId =>
        User.findByIdAndUpdate(studentId, { $pull: { enrolledClasses: id } })
          .catch(err => console.error(`Failed to update student ${studentId}:`, err)) // TODO: throw error?
      )
    );

    // delete conversation
    await Class.findByIdAndDelete(id);

    res.status(204).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete conversation class' });
  }
});

export default router;