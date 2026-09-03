import { AdminPlaceholder } from "@/components/layout/AdminPlaceholder";

export default function AdminProjectsPage() {
  return (
    <AdminPlaceholder
      title="College Projects"
      description="Project categories and technology badges."
      sourceFile="src/lib/services.ts"
      publicHref="/college-projects"
      publicLabel="View the projects page"
      nextSteps={[
        "Add a `project_categories` table matching the ProjectCategory type.",
        "Store project photographs through the existing gallery pipeline with a College Projects category.",
        "Add /api/admin/projects routes guarded by requireAdmin().",
      ]}
    />
  );
}
