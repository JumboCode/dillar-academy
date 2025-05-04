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
    level: { type: Number, required: true },
    ageGroup: { type: String, required: true },
    instructor: { type: String, required: true },
    link: { type: String, default: "" },
    schedule: { type: [ScheduleSchema], default: [] },
    roster: { type: [Schema.Types.ObjectId], default: [] },
    isEnrollmentOpen: { type: Boolean, default: true }
}, { collection: 'classes' });

const Class = mongoose.model("Class", ClassSchema);


// Conversation Schema
const ConversationSchema = new Schema({
    level: { type: String, required: true, default: "conversation" },
    ageGroup: { type: String, required: true },
    instructor: { type: String, required: true },
    schedule: { type: [ScheduleSchema], default: [] },
    roster: { type: [Schema.Types.ObjectId], default: [] },
    isEnrollmentOpen: { type: Boolean, default: true }
}, { collection: 'conversations' });

const Conversation = mongoose.model("Conversation", ConversationSchema);

export { Class, Conversation };