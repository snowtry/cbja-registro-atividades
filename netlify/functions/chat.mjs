
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  if (request.method !== "POST") {
    return Response.json(
      { error: "Método não permitido." },
      { status: 405, headers }
    );
  }

  try {
    const body = await request.json();
    const prompt = String(
      body.q || body.prompt || body.message || ""
    ).trim().slice(0, 1500);

    if (!prompt) {
      return Response.json(
        { error: "Digite uma pergunta." },
        { status: 400, headers }
      );
    }

    const url =
      "https://prexzyapis.com/ai/gemini?prompt=" +
      encodeURIComponent(prompt);

    const response = await fetch(url);
    const raw = await response.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { response: raw };
    }

    const answer =
      data.response ??
      data.answer ??
      data.result ??
      data.text ??
      data.data?.response ??
      data.data?.answer;

    if (!response.ok || !answer || data.status === false) {
      return Response.json(
        { error: "A API de IA não conseguiu responder." },
        { status: 502, headers }
      );
    }

    return Response.json(
      { answer: String(answer) },
      { headers }
    );
  } catch {
    return Response.json(
      { error: "Não foi possível conectar à IA." },
      { status: 502, headers }
    );
  }
};
