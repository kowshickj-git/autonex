"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, Loader2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { EASE } from "@/lib/motion";
import { GALLERY_CATEGORIES } from "@/lib/services";
import { uploadPhotos } from "@/lib/galleryService";
import { maxBytesForKind, mediaKindFromFile } from "@/lib/gallery/validate";
import type { GalleryImage } from "@/lib/gallery/types";
import { Modal } from "@/components/ui/Modal";
import { GalleryUploadDropzone, type PendingFile } from "./GalleryUploadDropzone";

type Phase = "select" | "uploading" | "done";

/**
 * "Add Gallery Photos" (spec sections 13, 31, 49).
 *
 * One batch, one category, one optional title/description. Progress is
 * reported live from the XHR upload; on completion the modal reports how many
 * succeeded and lets the admin retry only the ones that failed.
 */
export function UploadGalleryModal({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded: (images: GalleryImage[]) => void;
}) {
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Automation");
  const [isVisible, setIsVisible] = useState(true);

  const [phase, setPhase] = useState<Phase>("select");
  const [progress, setProgress] = useState(0);
  const [failures, setFailures] = useState<{ name: string; error: string }[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((incoming: File[]) => {
    setError(null);

    const rejected: string[] = [];
    const accepted = incoming.filter((file) => {
      const kind = mediaKindFromFile(file.name, file.type);
      if (!kind) {
        rejected.push(`${file.name} is not a supported file type`);
        return false;
      }
      const limit = maxBytesForKind(kind);
      if (file.size > limit) {
        rejected.push(`${file.name} is larger than ${(limit / 1024 / 1024).toFixed(0)} MB`);
        return false;
      }
      return true;
    });

    if (rejected.length > 0) {
      setError(`Skipped: ${rejected.join("; ")}.`);
    }

    setFiles((current) => {
      // De-duplicate on name+size so a double drop does not queue twice.
      const seen = new Set(current.map((item) => `${item.file.name}:${item.file.size}`));
      const next = accepted
        .filter((file) => !seen.has(`${file.name}:${file.size}`))
        .map((file) => ({
          key: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          mediaType: mediaKindFromFile(file.name, file.type),
        }));
      return [...current, ...next];
    });
  }, []);

  const removeFile = useCallback((key: string) => {
    setFiles((current) => {
      const target = current.find((item) => item.key === key);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.key !== key);
    });
  }, []);

  const reset = useCallback(() => {
    files.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setFiles([]);
    setTitle("");
    setDescription("");
    setCategory("Automation");
    setIsVisible(true);
    setPhase("select");
    setProgress(0);
    setFailures([]);
    setSuccessCount(0);
    setError(null);
  }, [files]);

  const close = () => {
    if (phase === "uploading") return; // never abandon an in-flight upload
    reset();
    onClose();
  };

  const submit = async () => {
    if (files.length === 0) {
      setError("Select at least one file to upload.");
      return;
    }

    setPhase("uploading");
    setProgress(0);
    setError(null);

    try {
      const result = await uploadPhotos(
        files.map((item) => item.file),
        { title: title.trim(), description: description.trim(), category, isVisible },
        setProgress,
      );

      setSuccessCount(result.uploadedCount);
      setFailures(result.failed);
      setPhase("done");

      if (result.uploaded.length > 0) onUploaded(result.uploaded);

      // Keep only the files that failed, so "Retry failed" is one click.
      const failedNames = new Set(result.failed.map((item) => item.name));
      setFiles((current) => {
        current
          .filter((item) => !failedNames.has(item.file.name))
          .forEach((item) => URL.revokeObjectURL(item.previewUrl));
        return current.filter((item) => failedNames.has(item.file.name));
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed. Please try again.");
      setPhase("select");
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add Gallery Media"
      description="Photos, videos and audio uploaded here appear on the public gallery when set to Visible."
      footer={
        phase === "done" ? (
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button type="button" onClick={close} className="btn btn-outline">
              Close
            </button>
            {failures.length > 0 && (
              <button type="button" onClick={() => setPhase("select")} className="btn btn-royal">
                Retry {failures.length} failed
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={close}
              disabled={phase === "uploading"}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={phase === "uploading" || files.length === 0}
              className="btn btn-primary"
            >
              {phase === "uploading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="size-4" strokeWidth={2} />
                  Upload {files.length > 0 ? `${files.length} ` : ""}
                  {files.length === 1 ? "File" : "Files"}
                </>
              )}
            </button>
          </div>
        )
      }
    >
      <AnimatePresence mode="wait">
        {phase === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE.outQuint }}
            className="py-6 text-center"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE.outQuint }}
              className={`mx-auto grid size-14 place-items-center rounded-full ${
                successCount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
              }`}
            >
              {successCount > 0 ? (
                <Check className="size-7" strokeWidth={2.6} />
              ) : (
                <CircleAlert className="size-7" strokeWidth={2.2} />
              )}
            </motion.span>

            <p className="mt-5 text-base font-bold text-navy-900">
              {successCount > 0
                ? `${successCount} ${successCount === 1 ? "file" : "files"} uploaded successfully`
                : "No files were uploaded"}
            </p>

            {failures.length > 0 && (
              <div className="mx-auto mt-5 max-w-md rounded-xl bg-red-50 p-4 text-left ring-1 ring-red-200">
                <p className="text-sm font-semibold text-red-800">
                  {failures.length} failed
                </p>
                <ul className="mt-2 space-y-1.5">
                  {failures.map((failure) => (
                    <li key={failure.name} className="text-xs leading-relaxed text-red-700">
                      <span className="font-medium">{failure.name}</span> - {failure.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <GalleryUploadDropzone
              files={files}
              onFilesAdded={addFiles}
              onRemove={removeFile}
              disabled={phase === "uploading"}
            />

            {phase === "uploading" && (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-navy-900">
                    Uploading {files.length} {files.length === 1 ? "file" : "files"}
                  </span>
                  <span className="numeric text-slate-6">{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-2">
                  <motion.div
                    className="h-full rounded-full bg-royal-600"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-5">
                  {progress >= 100
                    ? "Processing on the server - video posters can take a few seconds..."
                    : "Please keep this window open."}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="upload-title" className="mb-1.5 block text-sm font-medium text-navy-900">
                  Title
                </label>
                <input
                  id="upload-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={phase === "uploading"}
                  placeholder="e.g. Automatic Sliding Gate Installation"
                  className="field"
                />
                <p className="mt-1.5 text-[11px] text-slate-5">
                  Applied to every file in this batch. Leave blank to use each file name.
                </p>
              </div>

              <div>
                <label htmlFor="upload-category" className="mb-1.5 block text-sm font-medium text-navy-900">
                  Category
                </label>
                <select
                  id="upload-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  disabled={phase === "uploading"}
                  className="field"
                >
                  {GALLERY_CATEGORIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-navy-900">Visibility</span>
                <div className="flex h-[46px] items-center gap-3 rounded-[10px] px-3 shadow-[inset_0_0_0_1px_var(--color-slate-4)]">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isVisible}
                    aria-label="Visible on the public gallery"
                    onClick={() => setIsVisible((value) => !value)}
                    disabled={phase === "uploading"}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                      isVisible ? "bg-emerald-500" : "bg-slate-4"
                    }`}
                  >
                    <motion.span
                      layout
                      transition={{ duration: 0.24, ease: EASE.outQuint }}
                      className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm ${
                        isVisible ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-slate-7">{isVisible ? "Visible" : "Hidden"}</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="upload-description"
                  className="mb-1.5 block text-sm font-medium text-navy-900"
                >
                  Description <span className="font-normal text-slate-5">(optional)</span>
                </label>
                <textarea
                  id="upload-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={phase === "uploading"}
                  rows={3}
                  placeholder="e.g. Automatic sliding gate automation completed at a residential property in Porur."
                  className="field resize-y"
                />
              </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
