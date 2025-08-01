#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools.js";

async function main() {
  const server = new McpServer({
    name: "heim-mcp",
    version: "0.1.0",
    title: "Heim MCP",
    description:
      "MCP for Heim to create and deploy applications locally and to the cloud",
  });

  registerTools(server);

  let transport = new StdioServerTransport();

  console.log("Heim MCP Server running on stdio");

  await server.connect(transport);

  const cleanup = async () => {
    console.log("\nShutting down MCP server...");
    await transport.close();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

main().catch((error: any) => {
  console.error(`\nError initializing Heim MCP server:\n\t${error.message}\n`);
});
