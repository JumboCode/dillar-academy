import mongoose from 'mongoose';

const { Schema } = mongoose;

// Schedule Schema
// timezone is automatically UTC
const ScheduleSchema = new Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timezone: { type: String, required: true, default: "Etc/UTC" } // store in IANA timezone format
});

// Class Schema
const ClassSchema = new Schema({
  level: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: val => typeof val === 'number' || typeof val === 'string',
      message: 'Level must be a number or a string'
    }
  },
  ageGroup: { type: String, required: true },
  instructor: { type: String, required: true },
  link: { type: String, default: "" },
  schedule: { type: [ScheduleSchema], default: [] },
  roster: { type: [Schema.Types.ObjectId], default: [] },
  isEnrollmentOpen: { type: Boolean, default: true }
}, { collection: 'classes' });

const Class = mongoose.model("Class", ClassSchema);

export default Class;