import mongoose from 'mongoose';

const { Schema } = mongoose;

// Schedule Schema
// timezone is automatically UTC
const ScheduleSchema = new Schema({
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});

// Class Schema
const ClassSchema = new Schema({
    level: { type: Number, required: true },
    ageGroup: { type: String, required: true },
    instructor: { type: String, required: true },
    classroomLink: { type: String, default: "" },
    schedule: { type: [ScheduleSchema], default: [] },
    roster: { type: [Schema.Types.ObjectId], default: [] },
    isEnrollmentOpen: { type: Boolean, default: true }
}, { collection: 'classes' });

const Class = mongoose.model("Class", ClassSchema);


// Conversation Schema
const ConversationSchema = new Schema({
    level: { type: String, required: true, default: "conversation" },
    instructor: { type: String, required: true },
    ageGroup: { type: String, required: true },
    schedule: { type: [ScheduleSchema], default: [] },
    roster: { type: [Schema.Types.ObjectId], default: [] }
}, { collection: 'conversations' });

const Conversation = mongoose.model("Conversation", ConversationSchema);

export { Class, Conversation };