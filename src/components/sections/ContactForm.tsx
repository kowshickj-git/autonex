"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { solutions } from "@/lib/services";

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const SUBJECTS = [
  "General Enquiry",
  ...solutions.map((solution) => solution.title),
  "Engineering Lab Setup",
  "Other",
];

/**
 * Contact form (spec section 36).
 *
 * Floating labels animate on focus, borders transition, and a successful
 * submission swaps the form for a single checkmark confirmation. No confetti.
 */
function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`field !pb-2.5 !pt-6 ${
            error ? "!shadow-[inset_0_0_0_1px_var(--color-danger)]" : ""
          }`}
        />
        <motion.label
          htmlFor={id}
          initial={false}
          animate={{
            y: floated ? -10 : 0,
            scale: floated ? 0.82 : 1,
          }}
          transition={{ duration: 0.2, ease: EASE.outQuint }}
          className={`pointer-events-none absolute left-4 top-1/2 origin-left -translate-y-1/2 text-[15px] transition-colors duration-200 ${
            error ? "text-red-600" : focused ? "text-royal-700" : "text-slate-5"
          }`}
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </motion.label>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pt-1.5 text-xs text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message, company, source: "contact-page" }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: Errors;
      };

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setFormError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch {
      setFormError("Could not reach the server. Please check your connection, or call us directly.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE.outQuint }}
        className="card flex flex-col items-center px-6 py-16 text-center"
        role="status"
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE.outQuint, delay: 0.08 }}
          className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"
        >
          <Check className="size-8" strokeWidth={2.6} aria-hidden="true" />
        </motion.span>

        <h3 className="mt-6 text-xl font-bold text-navy-900">Thank you!</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-7">
          Our team will contact you shortly. If it is urgent, call us directly on{" "}
          <a href="tel:+919003242334" className="numeric font-medium text-royal-700">
            9003242334
          </a>
          .
        </p>

        <button
          type="button"
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setSubject(SUBJECTS[0]);
            setStatus("idle");
          }}
          className="btn btn-outline mt-8"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="name"
          label="Your name"
          value={name}
          onChange={setName}
          error={errors.name}
          required
          autoComplete="name"
        />
        <Field
          id="phone"
          label="Phone number"
          type="tel"
          value={phone}
          onChange={setPhone}
          error={errors.phone}
          required
          autoComplete="tel"
        />
        <div className="sm:col-span-2">
          <Field
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            required
            autoComplete="email"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-navy-900">
            What is this about?
          </label>
          <select
            id="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="field"
          >
            {SUBJECTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy-900">
            Tell us about your requirement <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            required
            aria-invalid={Boolean(errors.message)}
            placeholder="Site location, what you need, and any measurements or details you already have."
            className={`field resize-y ${
              errors.message ? "!shadow-[inset_0_0_0_1px_var(--color-danger)]" : ""
            }`}
          />
          {errors.message && <p className="pt-1.5 text-xs text-red-600">{errors.message}</p>}
        </div>
      </div>

      {/* Honeypot - visually and programmatically hidden from real users */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="company">Company (leave blank)</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <AnimatePresence>
        {formError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />
            {formError}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary mt-6 w-full !py-4"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Enquiry
            <Send className="btn-arrow size-4" strokeWidth={2.2} />
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-slate-5">
        We reply to enquiries within one working day.
      </p>
    </form>
  );
}
