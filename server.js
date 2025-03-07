const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const WEBHOOK_URL = process.env.WEBHOOK_URL; // Set this in Koyeb

app.post("/webhook", async (req, res) => {
    try {
        await axios.post(WEBHOOK_URL, req.body);
        res.status(200).send("Sent to Discord!");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
