const express = require("express");
const router = express.Router();
const Translation = require("../schemas/Translation");

// Get Translation
router.get('/:lng/:ns', async (req, res) => {
  try {
    const { lng, ns } = req.params;
    const data = await Translation.find({ lng, ns });
    console.log(data);

    const translations = {}
    data.forEach(kv => {
      translations[kv.key] = kv.value;
    });
    res.json(translations);
  } catch (error) {
    console.error("Failed to get translation:", error)
  }
})

// Move all i18nexus translations to MongoDB
router.post('/transfer-translations/', async (req, res) => {
  try {
    const response = await fetch(`https://api.i18nexus.com/project_resources/translations.json?api_key=${process.env.I18NEXUS_API_KEY}`)
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Failed to fetch translations' });
    }

    const translations = await response.json();

    const translationsToInsert = [];
    for (const [lng, namespaces] of Object.entries(translations)) {
      for (const [ns, keys] of Object.entries(namespaces)) {
        for (const [key, value] of Object.entries(keys)) {
          translationsToInsert.push({
            lng,
            ns,
            key,
            value
          });
        }
      }
    }

    await Translation.deleteMany({});
    await Translation.insertMany(translationsToInsert);

    return res.status(200).json({ message: "Successfully inserted translations" })
  } catch (error) {
    res.status(500).json({ message: 'Error transferring translations' })
  }
})

module.exports = router;