# Portfolio Agent

本プロジェクトは、個人学習目的で作成されたAIエージェントと連携するポートフォリオアプリケーションのコードベースです。

## アプリの概要

**「Qiita ID」** と **「GitHub ID」** を入力するだけで、AIエージェントが自動でインターネットからユーザー情報を収集し、エンジニアのポートフォリオレポートをマークダウン形式で生成してくれるアプリケーションです。

具体的には以下の情報をAIエージェントが取得・集計し、ポートフォリオを生成します。
- **Qiita**: プロフィール情報、フォロワー数、記事数、各記事の詳細（タイトル、いいね数、ストック数、タグなど）
- **GitHub**: プロフィール情報、フォロワー数、公開リポジトリ数、各リポジトリの詳細（スター数、フォーク数、使用言語など）

フロントエンドからこれらのIDを送信すると、バックエンドの複数エージェント (`mainAgent`, `qiitaAgent`, `githubAgent`, `reportAgent`) が連携して情報をまとめ、見やすいレポートとしてブラウザ上に表示します。

## プロジェクト構成

このリポジトリは以下の2つの主要なディレクトリで構成されています。

- **`agent/`**: AIエージェントの処理やAPIを提供するバックエンドアプリケーションを含みます。
- **`client/`**: ユーザーインターフェースとなるフロントエンドアプリケーションを含みます。

## 技術スタック

### フロントエンド (`client/`)
- **UI Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** Shadcn UI
- **Icons:** Lucide React

### バックエンド/AIエージェント (`agent/`)
- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Agent Framework:** VoltAgent (`@voltagent/core`, `@voltagent/cli`)
- **Server:** Hono (`@voltagent/server-hono`)

## 参考資料

本プロジェクトは、以下の記事を参考に実装・学習を行いました。🙇‍♂️
- [【図解解説】AIエージェントを0から開発！基礎からできる初心者チュートリアル【VoltAgent/React/TypeScript】](https://qiita.com/Sicut_study/items/f0e7503e18c76e2441d9) (Qiita)

## 工夫点・学習ポイント
- 元記事のチュートリアルではAIモデルとしてOpenAI（ChatGPT）が使用されていますが、本プロジェクトでは学習の一環として**Google Gemini** を採用するよう独自にカスタマイズを行いました。
