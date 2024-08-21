"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [professorDescription, setProfessorDescription] = useState("");

  const handleSubmit = () => {};

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
    </div>
  );
}
