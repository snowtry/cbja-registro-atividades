
import { getStore } from "@netlify/blobs";

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

export default async (request) => {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    const store = getStore("cbja-activities");

    if (request.method === "GET") {
      const saved = await store.get("activities", {
        type: "json"
      });

      return Response.json(
        { activities: Array.isArray(saved) ? saved : [] },
        { headers }
      );
    }

    if (!["POST", "DELETE"].includes(request.method)) {
      return Response.json(
        { error: "Método não permitido." },
        { status: 405, headers }
      );
    }

    const secret = process.env.CBJA_API_TOKEN;

    if (!secret) {
      return Response.json(
        { error: "Falta configurar o token no Netlify." },
        { status: 503, headers }
      );
    }

    if (
      request.headers.get("authorization") !==
      `Bearer ${secret}`
    ) {
      return Response.json(
        { error: "Não autorizado." },
        { status: 401, headers }
      );
    }

    if (request.method === "DELETE") {
      await store.setJSON("activities", []);

      return Response.json(
        { success: true, message: "Histórico limpo." },
        { headers }
      );
    }

    const body = await request.json();

    const allowed = [
      "Promoção",
      "Exoneração",
      "Advertência",
      "Transferência",
      "Outro"
    ];

    if (
      !allowed.includes(body.type) ||
      !String(body.member || "").trim()
    ) {
      return Response.json(
        { error: "Tipo ou membro inválido." },
        { status: 400, headers }
      );
    }

    const saved = await store.get("activities", {
      type: "json"
    });

    const activities = Array.isArray(saved) ? saved : [];

    const record = {
      id: crypto.randomUUID(),
      type: body.type,
      member: String(body.member).slice(0, 100),
      responsible: String(body.responsible || "").slice(0, 100),
      oldRole: String(body.oldRole || "").slice(0, 100),
      newRole: String(body.newRole || "").slice(0, 100),
      channel: String(body.channel || "").slice(0, 100),
      note: String(body.note || "").slice(0, 500),
      createdAt: new Date().toISOString()
    };

    activities.unshift(record);

    await store.setJSON(
      "activities",
      activities.slice(0, 500)
    );

    return Response.json(
      { success: true, activity: record },
      { status: 201, headers }
    );
  } catch {
    return Response.json(
      { error: "Erro ao processar o registro." },
      { status: 500, headers }
    );
  }
};
