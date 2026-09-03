import { AdminPlaceholder } from "@/components/layout/AdminPlaceholder";

export default function AdminEquipmentPage() {
  return (
    <AdminPlaceholder
      title="Engineering Equipment"
      description="Lab equipment categories and product cards."
      sourceFile="src/lib/equipment.ts"
      publicHref="/engineering-lab-equipment"
      publicLabel="View the equipment page"
      nextSteps={[
        "Add an `equipment` table with category, name, description, applications and specifications.",
        "Reuse the gallery upload pipeline for product photographs.",
        "Add /api/admin/equipment routes guarded by requireAdmin().",
      ]}
    />
  );
}
