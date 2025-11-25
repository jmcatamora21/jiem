
export async function POST(req: Request) {
    
 
    try {

    const { text, contextUrl } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "(Instructions: no yapping, simplified if possible, organize with div html element, context " + contextUrl + ", no using asterisk, no follow-up questions, organize in html elements no headings, do not wrap the code in ```html or ``` blocks, no yapping, respond directly to the user’s request) Explain this: " + text
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();

    return new Response(
        JSON.stringify({ result: data.choices[0].message.content }),
        {
            status: 200,
            headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // or your frontend origin
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ result: "Server error" }),
      { status: 500, headers: {"Content-Type": "application/json"} }
    );
  }
}
