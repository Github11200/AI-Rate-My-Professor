"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Markdown from "react-markdown";
import { text } from "stream/consumers";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [professorDescription, setProfessorDescription] = useState("");
  const [results, setResults] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      user: false,
      text: "Hello! Feel free to ask about what type of professor you're looking for.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url) {
      console.error("Please provide a valid URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/scrapeDataFromURL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Failed to fetch data from the API");

      const data = await response.json();
      setResults(data);

      await addProfessorToSupabase(data);
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProfessorToSupabase = async (professor) => {
    try {
      const response = await fetch("/api/addEmbeddingsToSupabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professor: professor,
        }),
      });

      if (!response.ok) throw new Error("Failed to add professor to Supabase");

      console.log("Professor added to Supabase successfully");
    } catch (error) {
      console.error(
        "Error occurred while adding professor to Supabase:",
        error
      );
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput) return;

    try {
      const ragQueryResult = await fetch("/api/queryVectorDatabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: chatInput, topK: 2 }),
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: chatInput,
          context: await ragQueryResult.json(),
        }),
      });

      if (!response.ok)
        throw new Error("Failed to get a response from the chat API");

      const data = await response.text();
      // @ts-ignore
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: true, text: chatInput },
        { user: false, text: data },
      ]);
    } catch (error) {
      console.error(
        "Error occurred while interacting with the chat API:",
        error
      );
    } finally {
      setChatInput("");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="URL to professors page..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Results:</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {results.map((professor, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{professor.name}</CardTitle>
                  <CardDescription>Rating: {professor.rating}</CardDescription>
                  <CardDescription>
                    Difficulty: {professor.difficulty}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Reviews:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {professor.reviews.map((review, i) => (
                      <li key={i}>{review}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chat Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ask a question about the professor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mb-4 overflow-y-scroll">
          {chatMessages.map((msg, index) => (
            <Card
              key={index}
              className={`${msg.user && "bg-primary-foreground"}`}
            >
              <Markdown
                className={`leading-7 [&:not(:first-child)]:mt-6 p-2 pl-4 text-base`}
              >
                {msg.text}
              </Markdown>
            </Card>
          ))}
        </CardContent>
        <CardFooter className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your question..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <Button onClick={handleChatSubmit}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
