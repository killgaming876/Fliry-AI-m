export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { messages } = req.body;

    // Check if API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: "Missing OpenRouter API key",
      });
    }

    // Send request to OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-vercel-app.vercel.app",
          "X-Title": "Flirty AI",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: messages,
          temperature: 0.8,
          max_tokens: 1000,
        }),
      }
    );

    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      return res.status(response.status).json({
        error: data,
      });
    }

    // Return AI response
    return res.status(200).json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response received.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
