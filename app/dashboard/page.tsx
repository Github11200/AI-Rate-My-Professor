'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [professorDescription, setProfessorDescription] = useState("");
  const [results, setResults] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
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

      // Send the data to Supabase
      await Promise.all(data.map((professor) => addProfessorToSupabase(professor)));

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
          professor: {
            name: professor.name,
            subject: "Subject Here",
            rating: professor.rating,
            description: professor.reviews.join(" "),
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to add professor to Supabase");

      console.log("Professor added to Supabase successfully");

    } catch (error) {
      console.error("Error occurred while adding professor to Supabase:", error);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput) return;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: chatInput }),
      });

      if (!response.ok) throw new Error("Failed to get a response from the chat API");

      const data = await response.json();
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { user: true, text: chatInput },
        { user: false, text: data.content },
      ]);

    } catch (error) {
      console.error("Error occurred while interacting with the chat API:", error);
    } finally {
      setChatInput("");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-4">
        <Input
          className="border border-gray-300 rounded-lg p-2 w-full"
          type="url"
          placeholder="URL to professors page..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          className="border border-gray-300 rounded-lg p-2 w-full"
          type="text"
          placeholder="Type of professor you'd like..."
          value={professorDescription}
          onChange={(e) => setProfessorDescription(e.target.value)}
        />
        <Button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Results:</h2>
          {results.map((professor, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{professor.name}</h3>
              <p className="text-gray-600">Rating: {professor.rating}</p>
              <p className="text-gray-600">Difficulty: {professor.difficulty}</p>
              <p className="text-gray-600 font-medium">Reviews:</p>
              <ul className="list-disc pl-5 space-y-2">
                {professor.reviews.map((review, i) => (
                  <li key={i} className="text-gray-700">{review}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Chat Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Ask a question about the professor</h3>
        <div className="space-y-4 mb-4 max-h-60 overflow-y-scroll p-3 bg-white rounded-lg border border-gray-200">
          {chatMessages.map((msg, index) => (
            <div key={index} className={msg.user ? "text-blue-600 text-right" : "text-gray-600 text-left"}>
              <p className={`p-2 rounded-lg ${msg.user ? "bg-blue-100" : "bg-gray-200"}`}>{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            className="border border-gray-300 rounded-lg p-2 flex-1"
            type="text"
            placeholder="Type your question..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <Button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            onClick={handleChatSubmit}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
