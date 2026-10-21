# VoxCPM2 MCP demo (NO REAL AUDIO)

A stateless Streamable HTTP MCP test server for checking FiatDock connectivity. It does not use VoxCPM2 or Colab, does not produce audio, and must not be sold as a working TTS service.

## Deploy with Cloudflare Workers

1. In Cloudflare dashboard, open Workers & Pages > Create > Import a repository and select this repository (if available), or deploy using Wrangler.
2. With Wrangler: `npm install`, then `npx wrangler login`, then `npm run deploy`.
3. Copy the actual workers.dev URL from Cloudflare and append `/mcp`.
4. In FiatDock choose Hosted HTTP and paste that URL; click Test connection. Tool name: `generate_speech`.

## MCP

- POST /mcp JSON-RPC 2.0: initialize, notifications/initialized, ping, tools/list, tools/call.
- Protocol version 2025-03-26; JSON responses, stateless (no sessions).
- GET / shows metadata. GET /mcp returns 405; this is expected for POST-based JSON RPC but some clients may require GET SSE support.

**No payment or real generation testing.** Do not enable paid listing until the real VoxCPM2 backend is connected and validated.
