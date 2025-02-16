const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");  

var aiToken = "d8cd29824a3779ffd3ff498777cb8a6286b74513a1b5323e586c3832f60f1935";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch("https://api.together.xyz/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${aiToken}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
                messages: [{ role: "user", content: prompt }]
            })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();  
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