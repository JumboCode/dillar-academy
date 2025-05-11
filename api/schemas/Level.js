import mongoose from 'mongoose';

const { Schema } = mongoose;

const LevelSchema = new Schema({
    level: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true, default: "level_img_0.webp" },
    skills: { type: [String], default: [] }
}, { collection: 'levels' });

const Level = mongoose.model("Level", LevelSchema);

export default Level;