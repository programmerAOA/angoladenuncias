import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const content = `google.com, pub-4560407429890237, DIRECT, f08c47fec0942fa0`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.status(200).send(content);
}
