/** Understands normal YouTube and Vimeo links and turns them into privacy-friendly players. */
export type VideoInfo = { provider: "youtube" | "vimeo"; id: string; embed: string; thumbnail: string | null };

export function parseVideo(url: string): VideoInfo | null {
  const u = (url ?? "").trim();
  const yt = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    const id = yt[1]!;
    // youtube-nocookie.com is YouTube's privacy-enhanced player: no tracking cookies until the video is played.
    return { provider: "youtube", id, embed: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
  }
  const vimeo = u.match(/vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)/);
  if (vimeo) {
    const id = vimeo[1]!;
    // dnt=1 asks Vimeo not to track the viewer.
    return { provider: "vimeo", id, embed: `https://player.vimeo.com/video/${id}?dnt=1`, thumbnail: null };
  }
  return null;
}

/** The player address with autoplay switched on (used after the visitor presses play). */
export const withAutoplay = (embed: string) => `${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`;
