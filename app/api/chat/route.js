import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "../../../utils/supabase/client";
const supabase = createClient();

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  const { messages } = await req.json();

  console.log("msg", messages);

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
  });

  let finalString = "";
  for await (const textPart of result.textStream) {
    finalString += textPart;
    console.log(textPart);
  }

  const userContent = messages
    .filter((msg) => msg.role === "user")
    .map((msg) => msg.content)
    .join(" ");

  const responses = [
    { role: "system", content: finalString },
    { role: "user", content: userContent },
  ];

  const { data, error } = await supabase
    .from("chats")
    .insert([{ messages: responses }]);
  console.log("data", data);
  console.log("error", error);
  return result.toAIStreamResponse();
}
