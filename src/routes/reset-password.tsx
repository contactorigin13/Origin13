import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — Origin 13" },
      { name: "description", content: "Choose a new password for your Origin 13 admin account." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Set a new password — Origin 13" },
      { property: "og:description", content: "Choose a new password for your Origin 13 admin account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated.");
    navigate({ to: "/admin", replace: true });
  };
  return (
    <main className="mx-auto min-h-screen max-w-sm px-6 pt-32">
      <form onSubmit={submit} className="space-y-5">
        <h1 className="text-4xl">Set a new password</h1>
        <div className="space-y-2">
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Save password</Button>
      </form>
    </main>
  );
}
