const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");  // Add this if needed

var aiToken = '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'

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch("https://api.open-assistant.io/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }]
            })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();  // Read response as text
            console.error("AI API Error:", errorText);
            return res.status(500).json({ error: "AI API request failed.", details: errorText });
        }

        const data = await response.json();
        console.log("AI Response:", data);

        res.json(data);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));