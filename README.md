# Heim MCP

[Model Context Protocol](https://modelcontextprotocol.io) server for Heim application deployment and management.

## Overview

This MCP server allows AI agents like Claude Desktop, Cursor, Windsurf, and others to create, deploy, and manage Heim applications directly through natural language commands.

**Purpose**
You can directly ask the AI to create new Heim applications from OpenAPI specifications, deploy them locally or to the cloud, and manage the Heim runtime.

**What is Heim?**
Heim is a platform for creating and deploying backend applications.

## Available Tools

| Tool                                | Description                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `new_heim_application`              | Creates a new Heim application from an OpenAPI 3.0.1 specification                            |
| `deploy_heim_application`           | Deploys an application to the local Heim runtime (available at http://127.0.0.1:3000)         |
| `deploy_heim_application_to_cloud`  | Deploys an application to Heim cloud                                                          |
| `start_heim`                        | Starts the Heim runtime to handle deployment requests                                          |
| `clear_heim`                        | Clears the local cache and stops the Heim runtime                                             |
| `update_heim`                       | Updates Heim to the latest version                                                            |

## Using with Cursor

**Installation - Globally**

Run the MCP server using npx:

```bash
npx -y @nor2/heim-mcp@latest
```

In your Cursor IDE

1. Go to `Cursor Settings` > `MCP`
2. Click `+ Add New MCP Server`
3. Fill in the form:
   - Name: `Heim` (or any name you prefer)
   - Type: `command`
   - Command: `npx -y @nor2/heim-mcp@latest`

**Installation - Project-specific**

Add an `.cursor/mcp.json` file to your project:

```json
{
  "mcpServers": {
    "heim": {
      "command": "npx",
      "args": [
        "-y",
        "@nor2/heim-mcp@latest"
      ]
    }
  }
}
```

**Usage**

Once configured, the Heim tools will be automatically available to the Cursor AI Agent. You can:

1. Ask the AI to create new applications from OpenAPI specs
2. Deploy applications locally or to the cloud
3. Manage the Heim runtime
4. The tools will be listed under `Available Tools` in MCP settings

## Using with Roo Code

Access the MCP settings by clicking "Edit MCP Settings" in Roo Code settings or using the "Roo Code: Open MCP Config" command in VS Code's command palette.

```json
{
  "mcpServers": {
    "heim": {
      "command": "npx",
      "args": [
        "-y",
        "@nor2/heim-mcp@latest"
      ]
    }
  }
}
```

## Prerequisites

Before using this MCP server, you need to have Heim installed on your system. You can install it by following the instructions at [https://heim.dev/releases/](https://heim.dev/releases/).

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build
```

## Debugging the Server

To debug your server, you can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector).

First build the server:

```bash
pnpm build
```

Run the following command in your terminal:

```bash
# Start MCP Inspector and server with all tools
npx @modelcontextprotocol/inspector node dist/index.js
```

## License

[MIT](LICENSE)