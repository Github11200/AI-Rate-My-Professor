"use client";

import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Design landing page here</h1>
      <Link href="/dashboard">
        <Button> Dashboard</Button>
      </Link>
      <LoginLink postLoginRedirectURL="/dashboard">Sign In</LoginLink>
      <RegisterLink postLoginRedirectURL="/dashboard">Sign Up</RegisterLink>
    </div>
  );
}
