import express from "express";
import mongoose from "mongoose";
import Level from "../schemas/Level.js";
import { validateInput } from "../utils/validate-utils.js";
import { deleteLevelTranslations, createLevelTranslations } from "../utils/translation-utils.js";

const router = express.Router();

// Get Levels
router.get("/", async (req, res) => {
  try {
    const allowedFields = ['level'];
    const filters = validateInput(req.query, allowedFields);

    const data = await Level.find(filters);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
})

// Get level by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const data = await Level.findOne({ _id: id });
    res.json(data)

  } catch (err) {
    res.status(500).send(err);
  }
})

// Create Level 
router.post('/', async (req, res) => {
  try {
    const { level, name, description, skills } = req.body;

    // Check if level already exists
    const query = { level };
    const existingLevel = await Level.findOne(query);

    if (existingLevel) {
      return res.status(409).json({
        message: 'Level with this number already exists',
        level: existingLevel
      });
    } else {
      const newLevel = new Level({
        level,
        name,
        description,
        skills,
      });
      await newLevel.save();

      // Add level translations to i18nexus
      await createLevelTranslations(newLevel);
      // translations transferred to MongoDB in createLevel wrapper

      return res.status(201).json({
        message: 'Level created successfully',
        level: newLevel
      });
    }
  } catch (error) {
    console.error('Error creating:', error);
    return res.status(500).json({ message: 'Failed to create level' });
  }
});

// Edit Level
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const existingLevel = await Level.findOne({ level: updates.level });
    if (existingLevel && existingLevel._id.toString() !== id.toString()) {
      return res.status(409).json({
        message: 'Level with this number already exists',
        level: existingLevel
      })
    }

    const currentLevel = await Level.findOne({ _id: id });

    const updatedLevel = await Level.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    // Update translations
    // delete existing translations 
    await deleteLevelTranslations(currentLevel);
    // create new translations
    await createLevelTranslations(updatedLevel);
    // translations transferred to MongoDB in updateLevel wrapper

    if (!updatedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }

    res.status(200).json(updatedLevel);
  } catch (error) {
    console.error('Failed to update level details:', error);
    res.status(500).json({ message: 'Failed to update level details' });
  }
});

// Delete Level
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deletedLevel = await Level.findById(id);
    if (!deletedLevel) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // Delete level's translations
    await deleteLevelTranslations(deletedLevel);

    await Level.findByIdAndDelete(id);

    res.status(204).json({ message: 'Level deleted successfully' });
  } catch (error) {
    console.error('Failed to delete level:', error);
    res.status(500).json({ message: 'Failed to delete level' });
  }
});

export default router;