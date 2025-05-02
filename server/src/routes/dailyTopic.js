const express = require('express');
const router = express.Router();
const generalInfo = require('../models/generalInfo');
const photoIdeas = require('../data/dailyPrompts.json');

/**
 * @route GET /api/prompt/dailyTopic
 * @description Fetches a random photo idea prompt from a predefined list after seeing if database does not already have a prompt for today 
 * @returns {Object} 200 - A JSON object containing a random photo idea prompt.
 * @returns {Object} 500 - Server error if there is an issue with fetching or processing the data.
 */
router.get('/dailyTopic', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD string
    const data = await generalInfo.findOne().select('dailyPrompt').lean();
    
    if (data?.dailyPrompt?.length > 0) {
      const storedDate = new Date(data.dailyPrompt[0].time).toISOString().split('T')[0];

      if (storedDate === today) {
        return res.status(200).json(data);
      }
    }

    // If no prompt for today, generate a new prompt
    function getRandomPhotoIdea() {
      const randomIndex = Math.floor(Math.random() * photoIdeas.length);
      return photoIdeas[randomIndex];
    }
    const randomIdea = getRandomPhotoIdea();

    // Update or create one
    const updatedGeneralInfo = await generalInfo.findOneAndUpdate(
      {},
      { 
        $set: { 
          dailyPrompt: [{ prompt: randomIdea, time: new Date() }]
        } 
      },
      { upsert: true, new: true }
    );

    return res.status(200).json(updatedGeneralInfo);
  } catch (err) {
    console.error("Error fetching or saving daily prompt:", err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;