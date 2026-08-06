import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL;

export async function sendContactEmail(
  userEmail: string,
  userQuestion: string,
): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !OWNER_EMAIL) {
    throw new Error("EmailJS is not configured.");
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: OWNER_EMAIL,
      user_email: userEmail,
      user_question: userQuestion,
      reply_to: userEmail,
      user_name: "AI Chatbot",
    },
    { publicKey: PUBLIC_KEY },
  );
}

export async function sendContactForm(
  name: string,
  email: string,
  message: string,
): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !OWNER_EMAIL) {
    throw new Error("EmailJS is not configured.");
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: OWNER_EMAIL,
      user_email: email,
      user_name: name,
      user_question: message,
      reply_to: email,
    },
    { publicKey: PUBLIC_KEY },
  );
}
