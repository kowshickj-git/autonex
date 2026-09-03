import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/guard";
import { userStore, toPublicUser, type PublicAdminUser } from "@/lib/auth/users";
import { TeamManager } from "@/components/admin/TeamManager";

export const dynamic = "force-dynamic";

/**
 * Team management. Owner only - editors are bounced back to the dashboard,
 * and the API guards enforce the same rule independently, so hiding the nav
 * link is presentation rather than security.
 */
export default async function AdminTeamPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login?next=%2Fadmin%2Fteam");
  if (session.role !== "owner") redirect("/admin");

  let members: PublicAdminUser[] = [];
  let loadError: string | null = null;
  try {
    members = (await userStore().list()).map(toPublicUser);
  } catch (error) {
    console.error("[admin/team] could not load users:", error);
    loadError = "The account store could not be reached. Check your storage configuration.";
  }

  return (
    <TeamManager
      initialMembers={members}
      loadError={loadError}
      ownerEmail={session.sub}
      ownerName={session.name}
      currentUserId={session.uid}
    />
  );
}
