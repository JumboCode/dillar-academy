import Translation from "../schemas/Translation.js";

const formattedSkillKey = (skill) => `level_skill_${skill.toLowerCase().replace(/ /g, "_")}`;

export const deleteLevelTranslations = async (levelData) => {
  try {
    await Translation.deleteMany({ key: `level_name_${levelData._id}` });
    await Translation.deleteMany({ key: `level_desc_${levelData._id}` });
    for (const skill of levelData.skills) {
      const key = `${formattedSkillKey(skill)}_${levelData._id}`;
      await Translation.deleteMany({ key });
    }
  } catch (error) {
    console.error("Failed to delete level translations", error);
    throw new Error("Failed to delete level translations");
  }
};

export const createLevelTranslations = async (levelData) => {
  try {
    // name translation
    const response = await fetch(`https://api.i18nexus.com/project_resources/base_strings.json?api_key=${process.env.I18NEXUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.I18NEXUS_PAT}`
      },
      body: JSON.stringify({
        key: `level_name_${levelData._id}`,
        value: levelData.name,
        namespace: "levels"
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Failed to create translation", data);
    }
    // description translation
    await fetch(`https://api.i18nexus.com/project_resources/base_strings.json?api_key=${process.env.I18NEXUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.I18NEXUS_PAT}`
      },
      body: JSON.stringify({
        key: `level_desc_${levelData._id}`,
        value: levelData.description,
        namespace: "levels"
      })
    });
    // skill translations
    for (const skill of levelData.skills) {
      const key = `${formattedSkillKey(skill)}_${levelData._id}`;
      await fetch(`https://api.i18nexus.com/project_resources/base_strings.json?api_key=${process.env.I18NEXUS_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.I18NEXUS_PAT}`
        },
        body: JSON.stringify({
          key,
          value: skill,
          namespace: "levels"
        })
      });
    }
  } catch (error) {
    throw new Error("Failed to create level translations");
  }
}