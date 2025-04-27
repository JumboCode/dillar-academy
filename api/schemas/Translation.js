import mongoose from 'mongoose';

const { Schema } = mongoose;

const TranslationSchema = new Schema({
    lng: { type: String, required: true },
    ns: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: String, required: true },
}, { collection: 'translations' });

const Translation = mongoose.model('Translation', TranslationSchema);

export default Translation;