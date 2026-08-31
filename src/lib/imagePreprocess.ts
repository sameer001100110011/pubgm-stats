// Preprocessing applied before OCR: upscale + grayscale + contrast boost.
//
// Why: real testing (Aug 2026) showed decimal points and small digits are
// the main OCR failure mode on these screens - "4.76" reads as "476",
// "34.1%" reads as "341%". This is a low-contrast/small-text problem, not
// a layout problem, and upscaling + contrast measurably fixed it in
// testing (K/D and Win Ratio decimals came back correctly after this).
//
// Honest tradeoff, from the same testing: this isn't a strict improvement
// on every field - one field (Matches Played) read worse after
// preprocessing in one test. Net effect across the whole screen was
// positive, but this needs to stay under real-world monitoring, not be
// treated as a solved problem.
export async function preprocessImage(
  file: File | Blob,
  options: { scale?: number; contrast?: number } = {}
): Promise<Blob> {
  const { scale = 3, contrast = 1.8 } = options;

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    // grayscale
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    // contrast boost around midpoint
    const adjusted = Math.min(255, Math.max(0, (gray - 128) * contrast + 128));
    d[i] = d[i + 1] = d[i + 2] = adjusted;
  }
  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}
