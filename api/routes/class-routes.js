import express from "express";
import mongoose from "mongoose";
import Class from '../schemas/Class.js';
import { validateInput } from "../../src/utils/backend/validate-utils.js";

const router = express.Router();

/* CLASS RELATED ENDPOINTS */

// Get Classes
router.get('/classes', async (req, res) => {
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
router.get('/classes/:id', async (req, res) => {
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
router.post('/classes', async (req, res) => {
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
router.put('/classes/:id', async (req, res) => {
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
router.delete('/classes/:id', async (req, res) => {
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


/* CONVERSATION RELATED ENDPOINTS */

// Get Conversation classes
router.get("/conversations", async (req, res) => {
  try {
    const data = await Class.find({ level: "conversation" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Get Conversation by ID
router.get('/conversations/:id', async (req, res) => {
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
router.post('/conversations', async (req, res) => {
  try {
    const { ageGroup, instructor, schedule, image } = req.body;

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
        schedule,
        image
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
router.put('/conversations/:id', async (req, res) => {
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
router.delete('/conversations/:id', async (req, res) => {
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


/* IELTS RELATED ENDPOINTS */

// Get IELTS classes
router.get("/ielts", async (req, res) => {
  try {
    const data = await Class.find({ level: "ielts" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Get IETLS by ID
router.get('/ielts/:id', async (req, res) => {
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
router.post('/ielts', async (req, res) => {
  try {
    const { ageGroup, instructor, schedule, image } = req.body;

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
        schedule,
        image
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
router.put('/ielts/:id', async (req, res) => {
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
router.delete('/ielts/:id', async (req, res) => {
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