const { Resend } = require("resend");

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        const data = JSON.parse(event.body || "{}");
        const { message, contact, userAgent, url, ts } = data;

        if (!message || typeof message !== "string" || message.trim().length < 2) {
            return { statusCode: 400, body: "Bad Request" };
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const subject = "DB Broms – Förbättringsförslag";
        const text = [
            `Tid: ${ts || "-"}`,
            `URL: ${url || "-"}`,
            `Kontakt: ${contact || "-"}`,
            `User-Agent: ${userAgent || "-"}`,
            "",
            "Meddelande:",
            message.trim(),
        ].join("\n");

        await resend.emails.send({
            from: "DB Broms <onboarding@resend.dev>",
            to: [process.env.FEEDBACK_TO],
            subject,
            text,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true }),
        };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: "Server error" };
    }
};
