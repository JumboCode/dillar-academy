const express = require("express");
const router = express.Router();
const Translation = require("../schemas/Translation");

// Get Translation
router.get('/:lng/:ns', async (req, res) => {
  try {
    const { lng, ns } = req.params;
    const data = await Translation.find({ lng, ns });

    const translations = {}
    data.forEach(kv => {
      translations[kv.key] = kv.value;
    });
    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: "Failed to get translation" })
  }
})

// Edit Translation
router.put('/:lng/:ns/:key/', async (req, res) => {
  const { lng, ns, key } = req.params;
  const { newTranslation } = req.body;

  try {
    const updated = await Translation.findOneAndUpdate(
      { lng, ns, key },
      { $set: { value: newTranslation } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Translation key not found' });
    }

    res.status(200).json({ message: 'Successfully updated translation', translation: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update translation" });
    console.error(error)
  }
})

router.post('/create', async (req, res) => {
  const { lng, ns, key, value } = req.body;

  try {
    const translation = new Translation({
      lng,
      ns,
      key,
      value
    })

    await translation.save();
    return res.status(201).json({ message: 'Translation created successfully', data: translation })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create translation' });
  }
})

// Move all i18nexus translations to MongoDB
router.post('/transfer-translations', async (req, res) => {
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

          // delete translation from i18nexus
          await fetch(`https://api.i18nexus.com/project_resources/base_strings.json?api_key=${process.env.I18NEXUS_API_KEY}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.I18NEXUS_PAT}`
            },
            body: JSON.stringify({
              "id": {
                "key": key,
                "namespace": ns,
              }
            })
          });
        }
      }
    }

    // await Translation.deleteMany({});
    await Translation.insertMany(translationsToInsert);

    return res.status(200).json({ message: "Successfully inserted translations" })
  } catch (error) {
    res.status(500).json({ message: 'Error transferring translations' })
  }
})

module.exports = router;