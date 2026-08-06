import { useState } from "react";
import { useLang } from "@/context/language-context";
import { fetchAiResponse, NO_ANSWER_MARKER } from "@/services/ai-api";

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const isNoAnswer = (response: string): boolean => {
  const normalized = response.trim().toLowerCase();
  return (
    normalized === NO_ANSWER_MARKER.toLowerCase() ||
    normalized.includes(NO_ANSWER_MARKER.toLowerCase())
  );
};

export const useAIChat = () => {
  const { t } = useLang();
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [awaitingEmail, setAwaitingEmail] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");

  const sendMessage = async (text: string) => {
    const userMsg: AIChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const response = await fetchAiResponse([...messages, userMsg]);
      if (isNoAnswer(response)) {
        setPendingQuestion(text);
        setAwaitingEmail(true);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t.aiChat.noAnswerMessage },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t.aiChat.errorResponse,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSent = (email: string) => {
    setAwaitingEmail(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: email },
      { role: "assistant", content: t.aiChat.emailSentBody(email) },
    ]);
  };

  const handleEmailCancel = () => {
    setAwaitingEmail(false);
  };

  const deleteConversation = () => {
    setMessages([]);
    setAwaitingEmail(false);
    setPendingQuestion("");
  };

  return {
    messages,
    loading,
    awaitingEmail,
    pendingQuestion,
    sendMessage,
    handleEmailSent,
    handleEmailCancel,
    deleteConversation,
  };
};
