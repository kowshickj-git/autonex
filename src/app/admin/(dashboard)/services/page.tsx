import { AdminPlaceholder } from "@/components/layout/AdminPlaceholder";

export default function AdminServicesPage() {
  return (
    <AdminPlaceholder
      title="Services"
      description="The nine solutions shown across the website."
      sourceFile="src/lib/services.ts"
      publicHref="/#solutions"
      publicLabel="View solutions on the website"
      nextSteps={[
        "Add a `services` table mirroring the Solution type in src/lib/services.ts.",
        "Implement a driver for it alongside src/lib/gallery/ following the same interface.",
        "Add /api/admin/services routes guarded by requireAdmin(), then swap this screen for a grid.",
      ]}
    />
  );
}
