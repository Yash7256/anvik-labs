const RASTER_EXTENSION = /\.(webp|png|jpe?g)$/i;

export const MOCKUP_WIDTHS = [320, 380, 480, 640, 768, 800, 1024, 1440] as const;
export const SCREEN_WIDTHS = [480, 768, 1200] as const;

export function imageSrcSet(
  src: string,
  widths: readonly number[] = MOCKUP_WIDTHS,
): string | undefined {
  if (!RASTER_EXTENSION.test(src)) return undefined;
  const base = src.replace(RASTER_EXTENSION, "");
  return widths.map((width) => `${base}-${width}.webp ${width}w`).join(", ");
}

export function imageVariant(src: string, width: number): string {
  return src.replace(RASTER_EXTENSION, `-${width}.webp`);
}
