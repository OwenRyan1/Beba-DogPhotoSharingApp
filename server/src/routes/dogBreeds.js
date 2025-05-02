const express = require("express");
const axios = require("axios");
const router = express.Router();

const DOG_API_URL = "https://api.thedogapi.com/v1/breeds";
const API_KEY = process.env.DOG_API_KEY;

/**
 * @route GET /api/users/breeds
 * @description Uses The Dog Api to get a list of dog breed options for the user to select
 * @returns {Object} 200 - Successfully got list of breeds
 * @returns {Object} 500 - Failed to get dog breeds info
 */
router.get("/breeds", async (req, res) => {
    try {
    const response = await axios.get(DOG_API_URL, {
        headers: { "x-api-key": API_KEY },
    });

    let breeds = response.data.map(breed => breed.name); // Extract breed names
    breeds.push("Other");

    res.status(200).json(breeds);
    } catch (error) {
        console.error("Error fetching dog breeds:", error);
        res.status(500).json({ message: "Failed to fetch dog breeds" });
    }
});

module.exports = router;
