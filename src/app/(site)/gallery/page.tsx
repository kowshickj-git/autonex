import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PublicGallery } from "@/components/gallery/PublicGallery";
import { galleryStore } from "@/lib/gallery";
import type { GalleryImage } from "@/lib/gallery/types";

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s | Autonex Solutions"
  // template - this title already names the company.
  title: { absolute: "Autonex Solutions Gallery | Automation & Engineering Projects" },
  description:
    "Explore Autonex Solutions automation, engineering, water treatment, security and technology project gallery.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Autonex Solutions Gallery | Automation & Engineering Projects",
    description:
      "Explore Autonex Solutions automation, engineering, water treatment, security and technology project gallery.",
    url: "/gallery",
  },
};

// Always render fresh so a newly published photo appears immediately.
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  /*
   * Server-side fetch of visible photos only. Rendering the grid on the
   * server means the images are in the HTML for search engines and for the
   * first paint - the client component then takes over filtering.
   */
  let images: GalleryImage[] = [];
  let loaded = true;
  try {
    images = await galleryStore().list({ visibleOnly: true });
  } catch (error) {
    // Zero photos and an unreachable store both produce an empty array, so
    // record which one happened - the client component treats them differently.
    console.error("[gallery page] could not load images:", error);
    loaded = false;
  }

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our Work & Gallery"
        lead="Explore our automation, engineering, installation and technology projects."
        crumbs={[{ label: "Gallery" }]}
      />

      <section className="section bg-slate-1">
        <div className="container-page">
          <PublicGallery initialImages={images} initialLoaded={loaded} />
        </div>
      </section>

      <CtaBand
        title="Want a system like these on your site?"
        lead="Share your requirement and we will put together a technical proposal and quotation."
        whatsappMessage="Hello Autonex Solutions, I saw your project gallery and would like a quote."
      />
    </>
  );
}
