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
import { weatherTool, getQiitaUserInfo, getQiitaUserItems, getGithubUserInfo, getGithubRepos } from "./tools";

// Create a logger instance
// const logger = createPinoLogger({
//   name: "agent",
//   level: "info",
// });

// Configure persistent memory (LibSQL / SQLite)
// const memory = new Memory({
//   storage: new LibSQLMemoryAdapter({
//     url: "file:./.voltagent/memory.db",
//     logger: logger.child({ component: "libsql" }),
//   }),
// });

// Configure persistent observability (LibSQL / SQLite)
// const observability = new VoltAgentObservability({
//   storage: new LibSQLObservabilityAdapter({
//     url: "file:./.voltagent/observability.db",
//   }),
// });



const qiitaAgent = new Agent({
  name: "qiita-agent",
  instructions:
    `ユーザーからQiitaユーザーIDを受け取ったら、ユーザーの情報と投稿記事一覧を取得してください。`,
  model: "google/gemini-2.5-flash",
  tools: [getQiitaUserInfo, getQiitaUserItems],
});

const githubAgent = new Agent({
  name: "github-agent",
  instructions: `GitHubのユーザー名を指定して、GitHubのユーザー情報と公開リポジトリ情報を取得してください。`,
  model: "google/gemini-2.5-flash",
  tools: [getGithubUserInfo, getGithubRepos],
});

const mainAgent = new Agent({
  name: "main-agent",
  instructions:`
  「QiitaユーザーID」を受け取ったら、「QiitaユーザーID」を渡して情報をJSONで取得し、Qiitaのユーザー情報と投稿記事一覧を取得します。
  「GitHubユーザー名」を受け取ったら、「GitHubユーザー名」を渡して情報をJSONで取得し、GitHubのユーザー情報と公開リポジトリ情報を取得します。
  それらの情報をまとめて返してください。
  `,
  subAgents: [qiitaAgent, githubAgent],
  model: "google/gemini-2.5-flash",
});

// const agent = new Agent({
//   name: "agent",
//   instructions:
//     "A helpful assistant that can check weather and help with various tasks",
//   model: "google/gemini-2.0-flash",
//   tools: [weatherTool],
//   memory,
// });

new VoltAgent({
  agents: {
    mainAgent,
  },
  // workflows: {
  //   expenseApprovalWorkflow,
  // },
  server: honoServer(),
  // logger,
  // observability,
  // voltOpsClient: new VoltOpsClient({
  //   publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
  //   secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
  // }),
});
