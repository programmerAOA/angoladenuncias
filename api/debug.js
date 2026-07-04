export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    const keys = Object.keys(process.env || {});
    const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY);
    const geminiLength = (process.env.GEMINI_API_KEY || "").length;
    const googleLength = (process.env.GOOGLE_AI_STUDIO_API_KEY || "").length;
    const nodeEnv = process.env.NODE_ENV;

    // We print keys that contain sensitive words without showing values
    return new Response(JSON.stringify({
        keys,
        hasGemini,
        geminiLength,
        googleLength,
        nodeEnv
    }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    });
}
