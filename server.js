const express = require("express");
const axios = require("axios");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Webhook URL from environment variables
const WEBHOOK_URL = process.env.WEBHOOK_URL; // Set this in Koyeb

// Rate limiter to allow a maximum of 10 requests per minute
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 10, // Limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again later.", // Custom rate limit message
});

// Apply the rate limiter to all POST requests to /webhook
app.use("/webhook", limiter);

// Webhook endpoint to forward data to Discord
app.post("/webhook", async (req, res) => {
    try {
        // Send the webhook data to Discord
        await axios.post(WEBHOOK_URL, req.body);
        res.status(200).send("Sent to Discord!");
    } catch (error) {
        console.error("Error sending webhook:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
