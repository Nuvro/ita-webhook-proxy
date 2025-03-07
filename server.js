const express = require("express");
const axios = require("axios");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

const app = express();

app.set('trust proxy', 1);

// Parse incoming JSON requests
app.use(express.json());

// Webhook URL from environment variables
const WEBHOOK_URL = process.env.WEBHOOK_URL; // Set this in Koyeb

// Rate limiter to allow a maximum of 10 requests per second
const limiter = rateLimit({
    windowMs: 1000, // 1 second window
    max: 10, // Limit each IP to 10 requests per second
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

// Self-ping to prevent Koyeb from sleeping
const APP_URL = process.env.APP_URL; // Set this in Koyeb to your app's URL

if (APP_URL) {
    setInterval(() => {
        axios.get(APP_URL)
            .then(() => console.log("✅ Self-ping successful"))
            .catch(err => console.error("❌ Self-ping failed:", err));
    }, 300000); // Pings every 5 minutes (300,000 ms)
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
