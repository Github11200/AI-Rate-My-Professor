"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [professorDescription, setProfessorDescription] = useState("");
  const [results, setResults] = useState(null);

  const handleSubmit = async () => {
    if (url) {
      try {
        const response = await fetch("/api/scrapeDataFromURL", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (response.ok) {
          const data = await response.json();
          setResults(data);

          // Send the data to Supabase
          for (const professor of data) {
            await addProfessorToSupabase(professor);
          }
        } else {
          console.error("Failed to fetch data from the API");
        }
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }
    } else {
      console.error("Please provide a valid URL");
    }
  };

  const addProfessorToSupabase = async (professor) => {
    try {
      

      const response = await fetch("/api/addEmbeddingsToSupabase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          professor: {
            name: professor.name,
            subject: "Subject Here", 
            rating: professor.rating,
            description: professor.reviews.join(" "),
          },
        }),
      });

      if (!response.ok) {
        console.error("Failed to add professor to Supabase");
      } else {
        console.log("Professor added to Supabase successfully");
      }
    } catch (error) {
      console.error("Error occurred while adding professor to Supabase:", error);
    }
  };

  return (
    <div>
      <Input
        type="url"
        placeholder="URL to professors page..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Type of professor you'd like..."
        value={professorDescription}
        onChange={(e) => setProfessorDescription(e.target.value)}
      />
      <Button onClick={handleSubmit}>Search</Button>

      {results && (
        <div>
          <h2>Results:</h2>
          {results.map((professor, index) => (
            <div key={index}>
              <h3>{professor.name}</h3>
              <p>Rating: {professor.rating}</p>
              <p>Difficulty: {professor.difficulty}</p>
              <p>Reviews:</p>
              <ul>
                {professor.reviews.map((review, i) => (
                  <li key={i}>{review}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
