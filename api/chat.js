export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        const model = "gemini-2.5-flash-preview-09-2025";

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: {
                        parts: [{
                            text: "You are a helpful, brilliant AI assistant focused on solving problems clearly and concisely. Format code blocks using markdown."
                        }]
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ message: data.error?.message || "Gemini error" });
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        res.status(200).json({ text });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
