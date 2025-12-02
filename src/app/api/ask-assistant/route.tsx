
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {

    try {

    const { messages } = await req.json();
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY2}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "model": "@preset/john",
          messages
      })
    });

    const data = await response.json();

    return new Response(
        JSON.stringify({ result: data.choices[0].message.content }), 
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            }
        }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ result: "Sorry, we couldn't read the server response. Please try again" }),
      { status: 500, 
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
        } }
    );
  }
}
