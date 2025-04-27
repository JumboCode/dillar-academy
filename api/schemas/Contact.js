import mongoose from 'mongoose';

const { Schema } = mongoose;

const ContactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
}, { collection: 'contacts' });

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;