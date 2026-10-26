import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Renders the cropped region of an image to a JPEG file. */
async function cropToFile(src: string, area: Area, name: string): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  const scale = Math.min(1, 1920 / area.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare the photo.");
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  if (!blob) throw new Error("Could not crop the photo.");
  return new File([blob], name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}

function PhotoCropDialog({ file, aspect, onDone }: { file: File; aspect: number; onDone: (file: File | null) => void }) {
  // Create the object URL inside the effect so StrictMode's mount/cleanup/mount
  // cycle revokes only the first copy — a URL created in a state initializer
  // gets revoked by the simulated unmount and the photo never appears.
  const [url, setUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const confirm = async () => {
    if (!area || !url) return;
    setBusy(true);
    setError(null);
    try {
      onDone(await cropToFile(url, area, file.name));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not crop the photo.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Adjust photo">
      <div className="w-full max-w-2xl border border-border bg-background p-5">
        <h3 className="font-display text-2xl">Place your photo</h3>
        <p className="mt-1 text-sm text-muted-foreground">Drag the photo to move it, and use the slider to zoom. What you see in the frame is what will show on the site.</p>
        <div className="media-tone relative mt-4 aspect-[16/10] w-full overflow-hidden bg-scrim">
          {url ? (
            <Cropper
              image={url}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" aria-label="Preparing photo" />
            </div>
          )}
        </div>
        <label className="mt-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Zoom
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="h-1 flex-1 accent-primary" aria-label="Zoom" />
        </label>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onDone(null)} disabled={busy}>Cancel</Button>
          <Button onClick={confirm} disabled={busy || !area}>
            {busy && <Loader2 className="animate-spin" />}
            Use this crop
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Hook: call crop(file, aspect) to ask the user to place a photo; renders the dialog. Resolves to null if cancelled. */
export function usePhotoCropper() {
  const [request, setRequest] = useState<{ file: File; aspect: number; resolve: (file: File | null) => void } | null>(null);
  const crop = useCallback(
    (file: File, aspect: number) => new Promise<File | null>((resolve) => setRequest({ file, aspect, resolve })),
    [],
  );
  const element = request ? (
    <PhotoCropDialog
      file={request.file}
      aspect={request.aspect}
      onDone={(file) => {
        request.resolve(file);
        setRequest(null);
      }}
    />
  ) : null;
  return { crop, element };
}
