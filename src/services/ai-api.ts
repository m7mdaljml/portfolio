import { KNOWLEDGE_BASE } from "./knowledge-base";

const API_URL = import.meta.env.VITE_AI_API_URL;
const API_KEY = import.meta.env.VITE_AI_API_KEY;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  fork: boolean;
}

interface StoredRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
}

let reposCache: StoredRepo[] | null = null;

async function fetchGitHubRepos(): Promise<StoredRepo[]> {
  if (reposCache) return reposCache;
  try {
    const headers: Record<string, string> = {};
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    const res = await fetch(
      "https://api.github.com/users/M7mdaljml/repos?sort=updated&per_page=30&type=owner",
      { headers },
    );
    if (!res.ok) return [];
    const data: GitHubRepo[] = await res.json();
    const repos: StoredRepo[] = data
      .filter((r) => !r.fork && r.name.toLowerCase() !== "m7mdaljml")
      .map(({ name, description, language, html_url }) => ({
        name,
        description,
        language,
        html_url,
      }));
    reposCache = repos;
    return repos;
  } catch {
    return [];
  }
}

async function buildSystemPrompt(): Promise<string> {
  const repos = await fetchGitHubRepos();
  const reposSection =
    repos.length > 0
      ? `\n\n## Mohammad's GitHub Projects (live from his GitHub)\n\n${repos
          .map(
            (r) =>
              `- ${r.name}: ${r.description || "No description provided."} (Language: ${
                r.language || "N/A"
              }, URL: ${r.html_url})`,
          )
          .join("\n")}`
      : "";

  return `You are the AI assistant for Mohammad Aljamal's personal portfolio website. You ONLY have knowledge about Mohammad and this portfolio. Use the following information to answer questions:

${KNOWLEDGE_BASE}${reposSection}

Rules:
- Answer in the SAME language the visitor writes in: if they write in Arabic, answer in Arabic; if they write in English, answer in English.
- ONLY answer questions related to Mohammad's portfolio content: his CV, skills, experience, education, achievements, GitHub projects, contact details, or the website itself.
- When asked about his GitHub projects, list them by name using the "Mohammad's GitHub Projects (live from his GitHub)" section above, and mention what each project does based on its description.
- If a question is NOT about Mohammad or his portfolio — including random text, greetings, jokes, math problems, or any off-topic message — respond with exactly this text and nothing else: 'I Have No Answers'
- If you cannot answer a question with 100% confidence using only the knowledge base above, respond with exactly this text and nothing else: 'I Have No Answers'
- Never improvise, apologize, explain, or add any extra words when the question is off-topic. The response must be exactly 'I Have No Answers' and nothing else.
- Answer in simple, friendly, non-technical language that any visitor can understand. Imagine you are explaining to a friend who is not a developer.
- Keep answers short and clear. Use the information above as your single source of truth.
- Do not make up information that is not in the knowledge base above.`;
}

export const NO_ANSWER_MARKER = "I Have No Answers";

export async function fetchAiResponse(
  messages: ChatMessage[],
): Promise<string> {
  const systemPrompt = await buildSystemPrompt();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI API request failed: ${response.status} ${errText}`);
  }

  const data = await response.json();

  return data.choices?.[0]?.message?.content ?? "";
}
