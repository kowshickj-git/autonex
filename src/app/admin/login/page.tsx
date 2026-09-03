"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleAlert, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Suspense, useState } from "react";
import { EASE } from "@/lib/motion";
import { company } from "@/lib/site";
import { LogoMark } from "@/components/layout/Logo";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Sign-in failed. Please try again.");
        setSubmitting(false);
        return;
      }

      // Only redirect within this site - never to an attacker-supplied URL.
      const safeNext = nextPath.startsWith("/admin") ? nextPath : "/admin";
      router.replace(safeNext);
      router.refresh();
    } catch {
      setError("Could not reach the server. Please check your connection.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy-900">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="username"
          autoFocus
          className="field"
          placeholder={company.email}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy-900">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="field !pr-11"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-5 transition-colors hover:bg-slate-2 hover:text-navy-900"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />
          {error}
        </motion.p>
      )}

      <button type="submit" disabled={submitting} className="btn btn-royal w-full !py-3.5">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <Lock className="size-4" strokeWidth={2} />
            Sign in
          </>
        )}
      </button>

      {/*
        Deliberately not a "Create account" button. Anyone who can sign in here
        can permanently delete gallery photos from the live website, so accounts
        are issued from inside the admin (Team screen) rather than self-served.
      */}
      <p className="border-t border-slate-2 pt-4 text-center text-xs leading-relaxed text-slate-5">
        Need access? Accounts are created by the site owner from the Team screen.
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-navy-950 px-4 py-12">
      <div aria-hidden="true" className="tech-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="tech-bloom absolute inset-0"
        style={{ ["--bloom-y" as string]: "45%" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE.outQuint }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <h1 className="mt-4 text-xl font-extrabold !text-white">Admin Sign In</h1>
          <p className="mt-1.5 text-sm text-white/50">
            Manage the {company.name} website gallery.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-e3 sm:p-7">
          <Suspense
            fallback={
              <div className="grid h-56 place-items-center text-slate-5">
                <Loader2 className="size-5 animate-spin" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          <Link href="/" className="transition-colors hover:text-white/70">
            &larr; Back to {company.name}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
