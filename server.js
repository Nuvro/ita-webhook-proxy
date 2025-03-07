const express = require('express');
const rateLimit = require('express-rate-limit');
const axios = require('axios'); // or any other HTTP client for sending requests

const app = express();
app.use(express.json());

// Create a queue to store messages that need to be sent
let messageQueue = [];

// Rate limiter configuration: Limit to 10 requests per second
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10, // Limit to 10 requests per second
  message: 'Too many requests, please try again later.',
});

// Apply the rate limiter globally
app.use(limiter);

// Function to send a message to Discord or any other destination
const sendMessage = async (message) => {
  try {
    // Replace this with your actual code to send a message to Discord
    const response = await axios.post('YOUR_DISCORD_WEBHOOK_URL', {
      content: message,
    });

    console.log(`Message sent: ${message}`);
    return response;
  } catch (error) {
    console.error(`Failed to send message: ${error}`);
  }
};

// Process the message queue
const processQueue = async () => {
  if (messageQueue.length > 0) {
    const message = messageQueue.shift(); // Get the first message from the queue
    await sendMessage(message); // Send the message

    // Delay the next request to maintain the rate limit
    setTimeout(processQueue, 100); // 100ms delay between processing the next message
  }
};

// Route to handle incoming webhooks
app.post('/webhook', (req, res) => {
  const message = req.body.content; // Adjust depending on how your data is sent

  if (message) {
    // Add the message to the queue
    messageQueue.push(message);
    console.log(`Message added to queue: ${message}`);

    // If queue is not being processed, start processing
    if (messageQueue.length === 1) {
      processQueue(); // Start processing the queue
    }

    res.status(200).send('Message queued for sending');
  } else {
    res.status(400).send('No message content found');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
