"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  KeyRound,
  Lock,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/Modal";
import { TeamMemberModal } from "./TeamMemberModal";
import { deleteTeamMember, updateTeamMember } from "@/lib/teamService";
import { ROLE_LABEL, type PublicAdminUser } from "@/lib/auth/users/types";

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Never";

function RoleBadge({ role }: { role: PublicAdminUser["role"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
        role === "owner" ? "bg-copper-50 text-copper-600" : "bg-royal-50 text-royal-700"
      }`}
    >
      {role === "owner" && <ShieldCheck className="size-3" strokeWidth={2.4} />}
      {ROLE_LABEL[role]}
    </span>
  );
}

export function TeamManager({
  initialMembers,
  loadError,
  ownerEmail,
  ownerName,
  currentUserId,
}: {
  initialMembers: PublicAdminUser[];
  loadError: string | null;
  ownerEmail: string;
  ownerName: string;
  currentUserId: string | null;
}) {
  const { notify } = useToast();

  const [members, setMembers] = useState(initialMembers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PublicAdminUser | null>(null);
  const [deleting, setDeleting] = useState<PublicAdminUser | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  /** The env account has no database row, so it is rendered separately. */
  const isBootstrapOwner = currentUserId === null;

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (member: PublicAdminUser) => {
    setEditing(member);
    setModalOpen(true);
  };

  const toggleActive = async (member: PublicAdminUser) => {
    setBusyId(member.id);
    const previous = members;
    setMembers((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, is_active: !item.is_active } : item,
      ),
    );

    try {
      const updated = await updateTeamMember(member.id, { is_active: !member.is_active });
      setMembers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      notify(
        updated.is_active
          ? `${updated.name} can sign in again.`
          : `${updated.name} can no longer sign in.`,
      );
    } catch (error) {
      setMembers(previous);
      notify(error instanceof Error ? error.message : "Could not update access.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setWorking(true);
    try {
      await deleteTeamMember(deleting.id);
      setMembers((current) => current.filter((item) => item.id !== deleting.id));
      notify(`${deleting.name} has been removed.`);
      setDeleting(null);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not remove this member.", "error");
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">Team</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-6">
            Anyone here can sign in and manage the gallery. Add accounts only for people you
            trust with your live website.
          </p>
        </div>

        <button type="button" onClick={openCreate} className="btn btn-primary shrink-0">
          <Plus className="size-4" strokeWidth={2.4} />
          Add Team Member
        </button>
      </header>

      {loadError && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200">
          {loadError}
        </div>
      )}

      {/* Bootstrap owner - shown so it is obvious where it comes from */}
      <section className="mt-7">
        <h2 className="eyebrow text-[10px] text-slate-5">Owner Account</h2>
        <div className="card mt-3 flex flex-wrap items-center gap-4 p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-copper-50 text-copper-600">
            <Lock className="size-4" strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-navy-900">
              {ownerName}
              <RoleBadge role="owner" />
              {isBootstrapOwner && (
                <span className="rounded-full bg-slate-2 px-2 py-0.5 text-[10px] font-medium text-slate-6">
                  This is you
                </span>
              )}
            </p>
            <p className="mt-0.5 break-all text-xs text-slate-6">{ownerEmail}</p>
          </div>
          <p className="text-xs text-slate-5">
            Configured in{" "}
            <code className="numeric rounded bg-slate-2 px-1.5 py-0.5 text-[11px] text-navy-800">
              .env.local
            </code>{" "}
            &middot; cannot be edited or deleted here
          </p>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-5">
          This account always works, even before any team members exist. It is what stops an empty
          database from locking you out of your own site. Change its password with{" "}
          <code className="numeric rounded bg-slate-2 px-1.5 py-0.5 text-[11px] text-navy-800">
            npm run admin:hash
          </code>
          .
        </p>
      </section>

      {/* Staff accounts */}
      <section className="mt-9">
        <h2 className="eyebrow text-[10px] text-slate-5">
          Team Members ({members.length})
        </h2>

        {members.length === 0 ? (
          <div className="mt-3 rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-slate-3">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-2 text-slate-5">
              <UserCheck className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className="mt-6 text-base font-semibold text-navy-900">No team members yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-6">
              You are the only person who can sign in. Add an account for anyone else who needs to
              manage the gallery.
            </p>
            <button type="button" onClick={openCreate} className="btn btn-primary mt-6">
              <Plus className="size-4" strokeWidth={2.4} />
              Add Team Member
            </button>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            <AnimatePresence initial={false}>
              {members.map((member) => {
                const isSelf = member.id === currentUserId;
                const isBusy = busyId === member.id;

                return (
                  <motion.li
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: isBusy ? 0.6 : 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.28, ease: EASE.outQuint }}
                    className={`card overflow-hidden p-5 ${
                      member.is_active ? "" : "bg-slate-1"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-navy-900">
                          {member.name}
                          <RoleBadge role={member.role} />
                          {isSelf && (
                            <span className="rounded-full bg-slate-2 px-2 py-0.5 text-[10px] font-medium text-slate-6">
                              This is you
                            </span>
                          )}
                          {!member.is_active && (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                              Deactivated
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 break-all text-xs text-slate-6">{member.email}</p>
                        <p className="numeric mt-1.5 text-[11px] text-slate-5">
                          Added {formatDate(member.created_at)} &middot; Last signed in{" "}
                          {formatDate(member.last_login_at)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(member)}
                          disabled={isBusy}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-royal-700 transition-colors hover:bg-royal-50 disabled:opacity-50"
                        >
                          <Pencil className="size-3.5" strokeWidth={2.1} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(member)}
                          disabled={isBusy}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-7 transition-colors hover:bg-slate-2 disabled:opacity-50"
                        >
                          <KeyRound className="size-3.5" strokeWidth={2.1} />
                          Password
                        </button>

                        <button
                          type="button"
                          onClick={() => void toggleActive(member)}
                          disabled={isBusy || isSelf}
                          title={isSelf ? "You cannot deactivate your own account" : undefined}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-7 transition-colors hover:bg-slate-2 disabled:opacity-40"
                        >
                          {member.is_active ? (
                            <>
                              <UserX className="size-3.5" strokeWidth={2.1} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="size-3.5" strokeWidth={2.1} />
                              Reactivate
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleting(member)}
                          disabled={isBusy || isSelf}
                          title={isSelf ? "You cannot delete your own account" : undefined}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                        >
                          <Trash2 className="size-3.5" strokeWidth={2.1} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <TeamMemberModal
        open={modalOpen}
        member={editing}
        onClose={() => setModalOpen(false)}
        onSaved={(user, created) => {
          setMembers((current) =>
            created ? [...current, user] : current.map((item) => (item.id === user.id ? user : item)),
          );
          notify(created ? `${user.name} can now sign in.` : "Changes saved.");
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
        title="Remove team member"
        message={`Remove ${deleting?.name ?? "this person"}? They will lose access immediately and permanently. Photos they uploaded stay in the gallery.`}
        confirmLabel="Remove Access"
        busy={working}
      />
    </>
  );
}
