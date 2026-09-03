"use client";

import { CircleAlert, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { createTeamMember, FieldError, updateTeamMember } from "@/lib/teamService";
import {
  ADMIN_ROLES,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
  type AdminRole,
  type PublicAdminUser,
} from "@/lib/auth/users/types";

const MIN_PASSWORD_LENGTH = 10;

/** Readable, reasonably strong suggestion so nobody invents "password123". */
function suggestPassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint32Array(16);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

/**
 * Create / edit a staff account.
 *
 * This is the "sign up" step, deliberately behind the owner login rather than
 * on the public login page: an account here can permanently delete gallery
 * photos from the live site.
 */
export function TeamMemberModal({
  open,
  member,
  onClose,
  onSaved,
}: {
  open: boolean;
  /** null = create a new member. */
  member: PublicAdminUser | null;
  onClose: () => void;
  onSaved: (user: PublicAdminUser, created: boolean) => void;
}) {
  const isEdit = member !== null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setName(member?.name ?? "");
    setEmail(member?.email ?? "");
    setRole(member?.role ?? "editor");
    setPassword("");
    setShowPassword(false);
    setError(null);
    setFieldErrors({});
  }, [open, member]);

  const save = async () => {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      if (isEdit) {
        const patch: Parameters<typeof updateTeamMember>[1] = { name: name.trim(), role };
        // Blank means "leave the existing password alone".
        if (password) patch.password = password;
        onSaved(await updateTeamMember(member.id, patch), false);
      } else {
        onSaved(
          await createTeamMember({ name: name.trim(), email: email.trim(), password, role }),
          true,
        );
      }
      onClose();
    } catch (cause) {
      if (cause instanceof FieldError) {
        setFieldErrors(cause.fields);
        setError(null);
      } else {
        setError(cause instanceof Error ? cause.message : "Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Team Member" : "Add Team Member"}
      description={
        isEdit
          ? "Update their details, role or password."
          : "Create a sign-in for someone on your team."
      }
      footer={
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-outline" disabled={saving}>
            Cancel
          </button>
          <button type="button" onClick={save} className="btn btn-royal" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="member-name" className="mb-1.5 block text-sm font-medium text-navy-900">
            Full name
          </label>
          <input
            id="member-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Priya Raman"
            className="field"
            autoComplete="off"
          />
          {fieldErrors.name && <p className="pt-1.5 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="member-email" className="mb-1.5 block text-sm font-medium text-navy-900">
            Email
          </label>
          <input
            id="member-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isEdit}
            placeholder="name@example.com"
            className="field disabled:cursor-not-allowed disabled:bg-slate-1 disabled:text-slate-5"
            autoComplete="off"
          />
          <p className="mt-1.5 text-[11px] text-slate-5">
            {isEdit
              ? "The email is the sign-in handle and cannot be changed. Remove the account and re-add it if it must change."
              : "This is what they will sign in with."}
          </p>
          {fieldErrors.email && <p className="pt-1.5 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div>
          <label
            htmlFor="member-password"
            className="mb-1.5 block text-sm font-medium text-navy-900"
          >
            {isEdit ? "New password" : "Password"}
            {isEdit && <span className="font-normal text-slate-5"> (leave blank to keep)</span>}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="member-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                className="field !pr-11"
                autoComplete="new-password"
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
            <button
              type="button"
              onClick={() => {
                setPassword(suggestPassword());
                setShowPassword(true);
              }}
              className="btn btn-outline shrink-0 !px-3 !py-2.5"
              title="Generate a strong password"
            >
              <RefreshCw className="size-4" strokeWidth={2} />
              <span className="hidden sm:inline">Generate</span>
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-5">
            Share it with them directly, then ask them to change it. It is stored only as a
            one-way hash, so it cannot be looked up here later.
          </p>
          {fieldErrors.password && (
            <p className="pt-1.5 text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-navy-900">Role</span>
          <div className="space-y-2">
            {ADMIN_ROLES.map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer gap-3 rounded-xl p-3 ring-1 transition-colors ${
                  role === option
                    ? "bg-royal-50 ring-royal-300"
                    : "bg-white ring-slate-3 hover:ring-slate-4"
                }`}
              >
                <input
                  type="radio"
                  name="member-role"
                  value={option}
                  checked={role === option}
                  onChange={() => setRole(option)}
                  className="mt-0.5 size-4 shrink-0 accent-royal-600"
                />
                <span>
                  <span className="block text-sm font-semibold text-navy-900">
                    {ROLE_LABEL[option]}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-6">
                    {ROLE_DESCRIPTION[option]}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {fieldErrors.role && <p className="pt-1.5 text-xs text-red-600">{fieldErrors.role}</p>}
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />
            {error}
          </p>
        )}
      </div>
    </Modal>
  );
}
