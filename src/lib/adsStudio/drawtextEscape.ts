// Escape text for ffmpeg drawtext filter.
// See https://ffmpeg.org/ffmpeg-filters.html#drawtext-1
export function escapeDrawtext(input: string): string {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/,/g, "\\,")
    .replace(/%/g, "\\%")
    .replace(/\r?\n/g, " ");
}
