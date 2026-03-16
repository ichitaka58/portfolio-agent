import { createTool } from "@voltagent/core";
import z from "zod";

export const getGithubUserInfo = createTool({
    name: "getGithubUserInfo",
    description: "GitHubユーザー名を指定して、そのユーザーの基本情報（名前、プロフィール、公開リポジトリ数、フォロワー数、Web/SNSリンクなど）を取得します。",
    parameters: z.object({
        username: z.string().describe("GitHubユーザー名"),
    }),
    execute: async ({ username }) => {
        const token = process.env.GITHUB_API_KEY;
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return {
            login: data.login,
            name: data.name,
            bio: data.bio,
            public_repos: data.public_repos,
            followers: data.followers,
            followings: data.following,
            blog: data.blog,
            html_url: data.html_url,
            avatar_url: data.avatar_url,
            location: data.location,
            company: data.company,
        };
    },
});

export const getGithubRepos = createTool({
    name: "getGithubRepos",
    description: "GitHubユーザー名を指定して、そのユーザーの公開リポジトリ一覧（リポジトリ名、説明、スター数、フォーク数、主要言語、URLなど）を取得します。最大100件。",
    parameters: z.object({
        username: z.string().describe("GitHubユーザー名"),
    }),
    execute: async ({ username }) => {
        const token = process.env.GITHUB_API_KEY;
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language,
            html_url: repo.html_url,
            topics: repo.topics,
            updated_at: repo.updated_at,
        }));
    },

});