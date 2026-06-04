import https from 'https';

export const config = {
    runtime: 'nodejs',
    // Disable body parsing since we're streaming
    api: {
        bodyParser: false,
        responseLimit: false,
    },
};

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const streamUrl = 'https://listen.radioking.com/radio/882461/stream/952706';

    const proxyReq = https.get(streamUrl, { timeout: 15000 }, (proxyRes) => {
        // Forward content-type and other relevant headers
        const contentType = proxyRes.headers['content-type'] || 'audio/mpeg';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Ice-cast metadata headers
        if (proxyRes.headers['icy-metaint']) {
            res.setHeader('Icy-MetaInt', proxyRes.headers['icy-metaint']);
        }
        if (proxyRes.headers['icy-name']) {
            res.setHeader('Icy-Name', proxyRes.headers['icy-name']);
        }

        res.writeHead(200);
        proxyRes.pipe(res);

        proxyRes.on('error', () => {
            res.end();
        });
    });

    proxyReq.on('error', (err) => {
        console.error('Proxy stream error:', err.message);
        if (!res.headersSent) {
            res.status(502).json({ error: 'Stream indisponível', details: err.message });
        } else {
            res.end();
        }
    });

    proxyReq.on('timeout', () => {
        console.error('Proxy stream timeout');
        proxyReq.destroy();
        if (!res.headersSent) {
            res.status(504).json({ error: 'Stream timeout' });
        }
    });

    // Handle client disconnect
    req.on('close', () => {
        proxyReq.destroy();
    });
}
