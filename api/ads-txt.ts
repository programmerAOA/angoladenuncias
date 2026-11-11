import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const content = `google.com, pub-4560407429890237, DIRECT, f08c47fec0942fa0`;

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Cache-Control": "public, s-maxage=86400",
  });
  res.end(content);
}
