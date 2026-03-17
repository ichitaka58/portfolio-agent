import { useState } from "react";
import { Button } from "./components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Typewriter } from "react-simple-typewriter";
import { Code, FileText, Heart, Star } from "lucide-react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [portfolio, setPortfolio] = useState("");

  const generatePortfolio = async (qiitaId: string, githubId: string) => {
    const response = await fetch(
      "http://localhost:3141/agents/main-agent/text",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: `Qiita ID: ${qiitaId}\nGitHub ID: ${githubId}`,
          options: {
            userId: "unique-user-id",
            conversationId: "unique-conversation-id",
            contextLimit: 10,
            temperature: 0.7,
            maxTokens: 100,
          },
        }),
      },
    );
    const res = (await response.json()) as { data: { text: string } };
    return res.data.text;
  };

  const handleGeneratePortfolio = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    const qiitaId = e.currentTarget.qiitaId.value;
    const githubId = e.currentTarget.githubId.value;
    try {
      const portfolio = await generatePortfolio(qiitaId, githubId);
      setPortfolio(portfolio);
    } finally {
      setIsLoading(false);
    }
  };

  const animatedQiitaArticles = 642;
  const animatedQiitaLikes = 1234;
  const animatedGithubRepos = 12;
  const animatedGithubStars = 456;

  return (
    <div className="min-h-screen transition-all duration-500 bg-white p-4 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl font-bold text-gray-900">
              Portfolio Generator
            </h1>
          </div>
          <div className="text-xl text-gray-600 h-8">
            <span style={{ whiteSpace: "pre" }}>
              <Typewriter
                words={["あなたの技術力を可視化します"]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
          </div>
        </div>
        {portfolio && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up max-w-3xl mx-auto">
            <Card className="bg-white border border-gray-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {animatedQiitaArticles}
                </div>
                <div className="text-sm text-gray-600">Qiita記事</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {animatedQiitaLikes}
                </div>
                <div className="text-sm text-gray-600">いいね</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-4 text-center">
                <Code className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {animatedGithubRepos}
                </div>
                <div className="text-sm text-gray-600">リポジトリ</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {animatedGithubStars}
                </div>
                <div className="text-sm text-gray-600">スター</div>
              </CardContent>
            </Card>
          </div>
        )}
        <Card className="p-8 mb-8 bg-white/90 shadow-lg rounded-xl">
          {isLoading && (
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <form onSubmit={handleGeneratePortfolio} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="qiitaId" className="text-gray-700">
                Qiita ID
              </Label>
              <Input
                id="qiitaId"
                name="qiitaId"
                placeholder="例： Sicut_study"
                className="bg-white border-gray-300"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubId" className="text-gray-700">
                GitHub ID
              </Label>
              <Input
                id="githubId"
                name="githubId"
                placeholder="例： jinwatanabe"
                className="bg-white border-gray-300"
                autoComplete="username"
              />
            </div>
            <div className="flex gap2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "生成中" : "ポートフォリオ生成"}
              </Button>
            </div>
          </form>
        </Card>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 bg-gray-50 text-gray-800 px-4 py-3 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 text-gray-700 px-4 py-3">
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors duration-300 text-blue-600 hover:text-blue-800"
              >
                {children}
              </a>
            ),
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mb-6 pb-3 border-b text-gray-900 border-gray-300">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-medium mb-3 mt-6 text-gray-700">
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2">
                {children}
              </ul>
            ),
            li: ({ children }) => <li className="text-gray-700">{children}</li>,
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
            ),
            hr: () => <hr className="my-8 border-gray-300" />,
          }}
        >
          {portfolio}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default App;
