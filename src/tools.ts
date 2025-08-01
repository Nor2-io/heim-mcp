import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { exec } from "child_process";
import { z } from "zod";
import util from "util";

export function registerTools(server: McpServer) {
  // TOOL: new_heim_application
  server.registerTool(
    "new_heim_application",
    {
      title: "New Heim Application",
      description:
        "Runs 'heim new' command on your local computer to create application schafholding from an OpenAPI 3.0.1 specification.",
      inputSchema: {
        path: z
          .string()
          .describe(
            "Absolute windows path to the folder where the project should be created. The created project will be under this path with a folder name called 'name'. The code to modify will be under <PATH>/<NAME>/src/ and the heim folder within shouldn't be modified."
          ),
        openApiPath: z
          .string()
          .describe(
            "Absolute windows path to OpenAPI file. The schema requires operationId and a full list of what Heim supports of the OpenAPI schema can be found here: https://cloud.heim.dev/heim/docs/templates/openapi/#openapi-root-object"
          )
          .optional(),
        name: z
          .string()
          .describe(
            "The name of the application. This will be used to name the application folder and set the name in the application.toml file."
          )
          .optional(),
      },
      annotations: {
        destructiveHint: false,
        readOnlyHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (request) => {
      const execPromise = util.promisify(exec);
      try {
        const { stdout, stderr } = await execPromise(
          `heim new --path ${request.path} --spec ${request.openApiPath}`
        );
        const output2 = await execPromise(
          `cargo build --manifest-path ${request.path}/generated/Cargo.toml --target wasm32-wasip2`
        );
        return {
          content: [
            {
              type: "text",
              text: `new stdout:\n${stdout}\nbuild stdout:${output2.stdout}\nnew stderr:\n${stderr}\nbuild stdout:${output2.stdout}`,
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  // TOOL: deploy_heim_application
  server.registerTool(
    "deploy_heim_application",
    {
      title: "Deploy Heim Application",
      description:
        "Runs 'heim deploy' command to deploy an application to a local Heim runtime. Which will make the application availible on http://127.0.0.1:3000<PATH> where <PATH> is the path defined in your OpenAPI specification",
      inputSchema: {
        path: z
          .string()
          .describe("Absolute windows path to the application folder root")
          .optional(),
      },
      annotations: {
        destructiveHint: false,
        readOnlyHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (request) => {
      const execPromise = util.promisify(exec);
      try {
        const { stdout, stderr } = await execPromise(
          `heim deploy ${request.path}`
        );
        return {
          content: [
            {
              type: "text",
              text: `stdout:\n${stdout}\nstderr:\n${stderr}`,
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  // TOOL: deploy_heim_application_to_cloud
  server.registerTool(
    "deploy_heim_application_to_cloud",
    {
      title: "Deploy Heim Application to Cloud",
      description:
        "Runs 'heim deploy' command to deploy an application to Heim cloud. Which will make the application availible on the path outputted in the console",
      inputSchema: {
        path: z
          .string()
          .describe("Absolute windows path to the application folder root")
          .optional(),
      },
      annotations: {
        destructiveHint: false,
        readOnlyHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (request) => {
      const execPromise = util.promisify(exec);
      try {
        //TODO: Update to use org and project when a user has multiple orgs and projects
        const { stdout, stderr } = await execPromise(
          `heim deploy ${request.path} --cloud`
        );
        return {
          content: [
            {
              type: "text",
              text: `stdout:\n${stdout}\nstderr:\n${stderr}`,
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  // TOOL: heim_start
  server.tool(
    "heim_start",
    "Starts the Heim runtime which will run your backend applications.",
    {
      title: "Start Heim Runtime",
      description:
        "Starts the Heim runtime which will run your backend applications and handle deployment requests of your applications.",
      destructiveHint: false,
      readOnlyHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    async () => {
      const execPromise = util.promisify(exec);
      try {
        const { stdout, stderr } = await execPromise("heim start");
        return {
          content: [
            {
              type: "text",
              text: `stdout:\n${stdout}\nstderr:\n${stderr}`,
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  // TOOL: heim_clear
  server.tool(
    "heim_clear",
    "Clears the local cache of the Heim runtime which will attempt to stop the runtime and remove all applications, logs, metrics, etc. from the runtime.",
    {
      title: "Clear Heim Runtime",
      destructiveHint: true,
      readOnlyHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    async () => {
      const execPromise = util.promisify(exec);
      try {
        const { stdout, stderr } = await execPromise("heim clear --force");
        return {
          content: [
            {
              type: "text",
              text: `stdout:\n${stdout}\nstderr:\n${stderr}`,
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  // TOOL: heim_update
  server.tool(
    "heim_update",
    "Updates Heim to the latest version.",
    {
      title: "Update Heim",
      destructiveHint: false,
      readOnlyHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    async () => {
      const execPromise = util.promisify(exec);
      try {
        const { stdout, stderr } = await execPromise("heim update");
        return {
          content: [
            {
              type: "text",
              text: `stdout:\n${stdout}\nstderr:\n${stderr}`,
            },
          ],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );
}
