import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String },
    age: { type: Number },
    email: { type: String, required: true, unique: true },
    whatsapp: { type: String },
    privilege: { type: String, default: "student", enum: ["admin", "instructor", "student"] },
    clerkId: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    enrolledClasses: { type: [Schema.Types.ObjectId], default: [] }
}, { collection: 'users' });

const User = mongoose.model("User", UserSchema);

export default User;