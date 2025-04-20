const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TranslationSchema = new Schema({
    lng: { type: String, required: true },
    ns: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: String, required: true }
}, { collection: 'translations' })

module.exports = mongoose.model("Translation", TranslationSchema)