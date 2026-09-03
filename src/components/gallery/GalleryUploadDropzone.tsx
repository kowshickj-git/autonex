"use client";

import { motion } from "framer-motion";
import { Music, Upload, UploadCloud, Video, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import {
  ALLOWED_AUDIO_EXTENSIONS,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_VIDEO_EXTENSIONS,
  ALL_ALLOWED_MIME,
} from "@/lib/gallery/validate";
import type { MediaType } from "@/lib/gallery/types";

export type PendingFile = {
  /** Stable key so React does not remount previews when the list changes. */
  key: string;
  file: File;
  previewUrl: string;
  mediaType: MediaType | null;
};

const ACCEPT = ALL_ALLOWED_MIME.join(",");

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function PendingPreview({ item }: { item: PendingFile }) {
  if (item.mediaType === "video") {
    return (
      // Muted + no controls: this is a list thumbnail, not a player. Most
      // browsers paint the first frame once metadata loads, which is enough
      // to confirm the right clip was picked.
      <video
        src={item.previewUrl}
        muted
        playsInline
        preload="metadata"
        className="size-12 shrink-0 rounded-lg bg-navy-950 object-cover"
      />
    );
  }

  if (item.mediaType === "audio") {
    return (
      <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-navy-900 text-copper-400">
        <Music className="size-5" strokeWidth={2} />
      </span>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={item.previewUrl} alt="" className="size-12 shrink-0 rounded-lg object-cover" />;
}

/**
 * Drag-and-drop + native file picker (spec sections 4, 5, 6), extended to
 * accept photos, MP4 video and MP3 audio in the same batch.
 *
 * The "Browse Files" button triggers a real `<input type="file" multiple>`,
 * so the operating system's own file dialog opens - there is no simulated
 * file browser anywhere in this component.
 */
export function GalleryUploadDropzone({
  files,
  onFilesAdded,
  onRemove,
  disabled = false,
}: {
  files: PendingFile[];
  onFilesAdded: (files: File[]) => void;
  onRemove: (key: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFilesAdded(Array.from(list));
    },
    [onFilesAdded],
  );

  // Revoke object URLs on unmount so previews cannot leak memory.
  useEffect(() => {
    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          if (!disabled) handleFiles(event.dataTransfer.files);
        }}
        className={`relative rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-300 ${
          dragging
            ? "border-royal-500 bg-royal-50"
            : "border-slate-4 bg-slate-1 hover:border-slate-5"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <motion.span
          animate={{ scale: dragging ? 1.12 : 1 }}
          transition={{ duration: 0.28, ease: EASE.outQuint }}
          className={`mx-auto grid size-14 place-items-center rounded-2xl transition-colors duration-300 ${
            dragging ? "bg-royal-600 text-white" : "bg-white text-royal-700 ring-1 ring-slate-3"
          }`}
        >
          <UploadCloud className="size-6" strokeWidth={1.8} aria-hidden="true" />
        </motion.span>

        <p className="mt-4 text-sm font-semibold text-navy-900">
          {dragging ? "Drop your files here" : "Drag & drop photos, videos or audio here"}
        </p>
        <p className="mt-1 text-xs text-slate-5">or</p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="btn btn-outline mt-3 !py-2.5 text-sm"
        >
          <Upload className="size-4" strokeWidth={2} />
          Browse Files
        </button>

        <div className="mt-4 flex flex-col items-center gap-1 text-[11px] text-slate-5">
          <p>{ALLOWED_IMAGE_EXTENSIONS.map((ext) => ext.toUpperCase()).join(", ")} &middot; up to 10 MB</p>
          <p>{ALLOWED_VIDEO_EXTENSIONS.map((ext) => ext.toUpperCase()).join(", ")} &middot; up to 100 MB</p>
          <p>{ALLOWED_AUDIO_EXTENSIONS.map((ext) => ext.toUpperCase()).join(", ")} &middot; up to 20 MB</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(event) => {
            handleFiles(event.target.files);
            // Reset so picking the same file twice still fires a change event.
            event.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow text-[10px] text-slate-5">
            Selected Files ({files.length})
          </p>

          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
            {files.map((item) => (
              <motion.li
                key={item.key}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease: EASE.outQuint }}
                className="flex items-center gap-3 rounded-xl bg-slate-1 p-2.5 ring-1 ring-slate-2"
              >
                <PendingPreview item={item} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy-900">{item.file.name}</p>
                  <p className="numeric flex items-center gap-1.5 text-[11px] text-slate-5">
                    {item.mediaType === "video" && <Video className="size-3" strokeWidth={2.2} />}
                    {item.mediaType === "audio" && <Music className="size-3" strokeWidth={2.2} />}
                    {formatSize(item.file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.key)}
                  disabled={disabled}
                  aria-label={`Remove ${item.file.name}`}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-5 transition-colors hover:bg-white hover:text-red-600"
                >
                  <X className="size-4" />
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
