export default async function handler(req: Request): Promise<Response> {
  const content = `google.com, pub-4560407429890237, DIRECT, f08c47fec0942fa0`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
