"use client";
import { LoginForm } from "@/components/login-form";

import { useEffect } from "react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";

export default function Home() {
  const { isLoading, error, data } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  );

  useEffect(() => {
    if (data && !isLoading) {
      console.log("Visitor ID:", data.visitorId);
      console.log("Full visitor data:", data);
    }
    if (error) {
      console.error("Error loading visitor data:", error);
    }
  }, [data, isLoading, error]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <main className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </main>
    </div>
  );
}
