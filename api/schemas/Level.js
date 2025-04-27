import mongoose from 'mongoose';

const { Schema } = mongoose;

const LevelSchema = new Schema({
    level: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] }
}, { collection: 'levels' });

const Level = mongoose.model("Level", LevelSchema);

export default Level;