const headers = { "content-type": "application/json", "access-control-allow-origin": "*", "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-allow-headers": "Content-Type, Authorization, MCP-Protocol-Version, MCP-Session-Id", "access-control-expose-headers": "MCP-Session-Id, MCP-Protocol-Version" };
const tool = { name: "generate_speech", description: "DEMO ONLY: Simulates VoxCPM2 speech generation. Does not generate or return real audio. Never charge users for this test.", inputSchema: { type: "object", properties: { text: { type: "string", description: "Text to synthesize (demo only)" }, language: { type: "string", default: "vi" } }, required: ["text"] } };
const reply = (body, status=200, extra={}) => new Response(JSON.stringify(body), {status,headers:{...headers,...extra}});
export default {
 async fetch(request) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null,{status:204,headers});
  if (url.pathname === "/") return reply({name:"VoxCPM2 MCP Demo",demo:true,mcp_endpoint:url.origin+"/mcp",notice:"No real audio is generated."});
  if (url.pathname !== "/mcp") return reply({error:"Not found"},404);
  if (request.method === "GET") return new Response("Streamable HTTP MCP endpoint; send JSON-RPC POST.",{status:405,headers:{...headers,allow:"POST, OPTIONS"}});
  if (request.method !== "POST") return reply({error:"Method not allowed"},405);
  let msg; try { msg=await request.json(); } catch {return reply({error:"Invalid JSON"},400);}
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return reply({jsonrpc:"2.0",id:msg?.id??null,error:{code:-32600,message:"Invalid Request"}},400);
  if (msg.method === "notifications/initialized" || msg.method.startsWith("notifications/")) return new Response(null,{status:202,headers});
  const id=msg.id??null;
  let result;
  switch(msg.method) {
   case "initialize": result={protocolVersion:"2025-03-26",capabilities:{tools:{listChanged:false}},serverInfo:{name:"voxcpm-mcp-a-demo",version:"0.1.0"}}; break;
   case "ping": result={}; break;
   case "tools/list": result={tools:[tool]}; break;
   case "tools/call":
    if(msg.params?.name!==tool.name) return reply({jsonrpc:"2.0",id,error:{code:-32602,message:"Unknown tool"}});
    if(typeof msg.params?.arguments?.text!=="string" || !msg.params.arguments.text.trim()) return reply({jsonrpc:"2.0",id,result:{isError:true,content:[{type:"text",text:"A non-empty text parameter is required."}]}});
    result={content:[{type:"text",text:JSON.stringify({demo:true,status:"simulated",audio_generated:false,notice:"TEST ONLY: no audio file was created.",characters:msg.params.arguments.text.length,language:msg.params.arguments.language||"vi"})}]}; break;
   default: return reply({jsonrpc:"2.0",id,error:{code:-32601,message:"Method not found"}});
  }
  return reply({jsonrpc:"2.0",id,result},{"status":200}["status"]);
 }
};