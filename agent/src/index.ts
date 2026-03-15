import "dotenv/config";
import {
  VoltAgent,
  VoltOpsClient,
  Agent,
  Memory,
  VoltAgentObservability,
  createTool,
} from "@voltagent/core";
import {
  LibSQLMemoryAdapter,
  LibSQLObservabilityAdapter,
} from "@voltagent/libsql";
import { createPinoLogger } from "@voltagent/logger";
import { honoServer } from "@voltagent/server-hono";
import { expenseApprovalWorkflow } from "./workflows";
import { weatherTool } from "./tools";
import z from "zod";

// Create a logger instance
const logger = createPinoLogger({
  name: "agent",
  level: "info",
});

// Configure persistent memory (LibSQL / SQLite)
const memory = new Memory({
  storage: new LibSQLMemoryAdapter({
    url: "file:./.voltagent/memory.db",
    logger: logger.child({ component: "libsql" }),
  }),
});

// Configure persistent observability (LibSQL / SQLite)
const observability = new VoltAgentObservability({
  storage: new LibSQLObservabilityAdapter({
    url: "file:./.voltagent/observability.db",
  }),
});

const agent = new Agent({
  name: "agent",
  instructions:
    "A helpful assistant that can check weather and help with various tasks",
  model: "google/gemini-2.0-flash",
  tools: [weatherTool],
  memory,
});

new VoltAgent({
  agents: {
    agent,
  },
  workflows: {
    expenseApprovalWorkflow,
  },
  server: honoServer(),
  logger,
  observability,
  voltOpsClient: new VoltOpsClient({
    publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
    secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
  }),
});

const getQiitaUserInfo = createTool({
  name: "getQiitaUserInfo",
  description: "Qiitaユーザーの情報を取得する",
  parameters: z.object({
    userId: z.string().describe("QiitaユーザーID"),
  }),
  execute: async ({ userId }) => {
    const accessToken = process.env.QIITA_API_KEY;
    const response = await fetch(`https://qiita.com/api/v2/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  },
});
