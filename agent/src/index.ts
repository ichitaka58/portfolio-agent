import "dotenv/config";
import { VoltAgent, Agent } from "@voltagent/core";
import { honoServer } from "@voltagent/server-hono";
import { getQiitaUserInfo, getQiitaUserItems, getGithubUserInfo, getGithubRepos } from "./tools";



const qiitaAgent = new Agent({
  name: "qiita-agent",
  instructions:
    `ユーザーからQiitaユーザーIDを受け取ったら、ユーザーの情報と投稿記事一覧を取得してください。`,
  model: "google/gemini-3.1-flash-lite-preview",
  tools: [getQiitaUserInfo, getQiitaUserItems],
});

const githubAgent = new Agent({
  name: "github-agent",
  instructions: `GitHubのユーザー名を指定して、GitHubのユーザー情報と公開リポジトリ情報を取得してください。`,
  model: "google/gemini-3.1-flash-lite-preview",
  tools: [getGithubUserInfo, getGithubRepos],
});

const reportAgent = new Agent({
  name: "report-agent",
  instructions: `
  あなたはポートフォリオ自動生成のAIアシスタントです。
  受け取ったQiitaのユーザー情報・記事一覧、およびGitHubのユーザー情報・公開リポジトリ情報を、下記のMarkdownテンプレートに沿ってそのまま埋め込んでレポートを作成してください。

  - 不足している情報があれば「情報がありません」と記載してください。
  - 表やリストは空欄のままでも構いません。
  - 余計な説明や補足は一切加えず、Markdownレポートのみを出力してください。
  
  ## 1. 基本情報
  - **Qiitaユーザー名**:
  - **Qiitaプロフィール**:
  - **Qiitaフォロワー数**:
  - **Qiita記事数**:
  - **GitHubユーザー名**:
  - **GitHubプロフィール**:
  - **GitHubフォロワー数**:
  - **GitHub公開リポジトリ数**:

  ---

  ## 2. 技術スタック・タグ頻度
  - **Qiita主要タグ**:
  - **GitHub主要言語**:

  ---

  ## 3. Qiita記事一覧（最大10件）
  | タイトル | URL | いいね | ストック | タグ | 投稿日 |
  |:--|:--|:--|:--|:--|:--|

  ---

  ## 4. GitHubリポジトリ一覧（最大10件）
  | リポジトリ名 | URL | スター | フォーク | 主要言語 | 説明 | 最終更新 |
  |:--|:--|:--|:--|:--|:--|:--|

  ---

  ## 5. 人気Qiita記事ランキング（いいね順上位3件）
  | タイトル | いいね | ストック | URL |
  |:--|:--|:--|:--|

  ---

  ## 6. 人気GitHubリポジトリランキング（スター順上位3件）
  | リポジトリ名 | スター | フォーク | URL |
  |:--|:--|:--|:--|

  ---

  ## 7. 定量評価
  - **Qiita**
      - 記事数:
      - フォロワー数:
      - いいね合計:
      - ストック合計:
  - **GitHub**
      - 公開リポジトリ数:
      - フォロワー数:
      - スター合計:
      - フォーク合計:

  ---

  ## 8. 代表的なQiita記事・GitHubリポジトリ
  - **Qiita記事**:  | [Link]() | 要約:
  - **GitHubリポジトリ**:  | [Link]() | 説明:

  ---

  各項目は受け取ったデータをもとに埋めてください。不足している場合は「情報がありません」と記載してください。
  `,
  model: "google/gemini-3.1-flash-lite-preview",
});


const mainAgent = new Agent({
  name: "main-agent",
  instructions: `
  あなたはQiitaとGitHubの情報をまとめてエンジニアのポートフォリオレポートを生成するエージェントです。
  以下の手順に従って、QiitaとGitHubの情報をまとめてポートフォリオレポートを生成してください。

  # 手順
  0. 「Qiita ID: (QiitaのユーザーID) \n GitHub ID: (GitHubのユーザーID)」と入力されたらQiitaユーザーIDとGitHubユーザーIDとして取得する。
  1. QiitaユーザーIDを使って、Qiitaのユーザー情報と投稿記事一覧を取得してください。それを変数qiitaDataに格納してください。
  2. GitHubユーザー名を使って、GitHubのユーザー情報と公開リポジトリ情報を取得してください。それを変数githubDataに格納してください。
  3. qiitaDataとgithubDataを元に、ポートフォリオレポートを生成してください。

  # 厳守事項
  - 入力文からQiita IDとGitHub IDを必ず抽出して処理してください。
  - Qiita IDまたはGitHub IDが見つからない場合は「情報がありません」として進めてください。
  - 余計な説明や補足は一切加えず、Markdownレポートのみを出力してください。
  `,
  subAgents: [qiitaAgent, githubAgent, reportAgent],
  model: "google/gemini-3.1-flash-lite-preview",
});

new VoltAgent({
  agents: {
    mainAgent,
  },
  server: honoServer(),
});
