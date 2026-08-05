// Mirrors the color tokens in tailwind.config.ts. Email clients don't load
// Tailwind or the site's webfonts, so these are plain values used directly
// in inline styles, with a system font stack standing in for Archivo/JetBrains Mono.
export const colors = {
  ink: "#201E1D",
  paper: "#F3F2F2",
  paperDim: "#E7E5E4",
  brass: "#EC3013",
  brassDark: "#AE1800",
  slate: "#605D5D",
  slateLight: "#8A8785",
};

export const fontStack = "Helvetica, Arial, sans-serif";
export const monoStack = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
