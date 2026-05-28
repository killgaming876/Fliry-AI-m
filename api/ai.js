export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    // Get messages
    const { messages } = req.body || {};

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "messages array is required",
      });
    }

    // Get API key
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing OPENROUTER_API_KEY",
      });
    }

    // Timeout protection
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    // OpenRouter request
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",

          // REQUIRED by OpenRouter
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL ||
            "https://fliry-ai-m.vercel.app",

          "X-Title": "Fliry AI",
        },

        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",

          messages,

          temperature: 0.8,

          max_tokens: 500,
        }),

        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    // Parse response safely
    const data = await response.json().catch(() => null);

    // Handle OpenRouter errors
    if (!response.ok) {
      console.error("OPENROUTER ERROR:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          data?.message ||
          "OpenRouter request failed",

        raw: data,
      });
    }

    // Extract AI response
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "";

    // Empty response check
    if (!reply) {
      return res.status(500).json({
        error: "Empty model response",
        raw: data,
      });
    }

    // Success
    return res.status(200).json({
      reply,
      raw: data,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    // Timeout
    if (error?.name === "AbortError") {
      return res.status(408).json({
        error: "Request timed out",
      });
    }

    // General error
    return res.status(500).json({
      error: error?.message || "Internal server error",
    });
  }
}
