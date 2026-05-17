export const COLORS = {
  bg: "#0B0F14",
  bg2: "#101820",
  panel: "#151E27",
  panel2: "#1B2632",
  ink: "#F5F7FA",
  muted: "#A8B3C2",
  soft: "#64748B",
  line: "#2C3A49",
  cyan: "#55D6F5",
  green: "#6EE7B7",
  yellow: "#FBBF24",
  red: "#FB7185",
  violet: "#B7A2FF",
};

export function bg(slide, ctx, n) {
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill: COLORS.bg });
  ctx.addShape(slide, { x: 0, y: 642, w: ctx.W, h: 78, fill: "#091016" });
  ctx.addShape(slide, { x: 0, y: 0, w: 8, h: ctx.H, fill: COLORS.cyan });
  ctx.addText(slide, {
    text: "GRAPHQL CONF",
    x: 56,
    y: 42,
    w: 210,
    h: 18,
    fontSize: 10,
    bold: true,
    color: COLORS.soft,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  ctx.addText(slide, {
    text: String(n).padStart(2, "0"),
    x: 1180,
    y: 655,
    w: 44,
    h: 24,
    fontSize: 12,
    bold: true,
    color: COLORS.soft,
    align: "right",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function title(slide, ctx, text, y = 92, size = 42, w = 920) {
  return ctx.addText(slide, {
    text,
    x: 56,
    y,
    w,
    h: 130,
    fontSize: size,
    bold: true,
    color: COLORS.ink,
    typeface: ctx.fonts.title,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function kicker(slide, ctx, text, y = 78) {
  ctx.addShape(slide, { x: 56, y: y - 10, w: 34, h: 3, fill: COLORS.cyan });
  return ctx.addText(slide, {
    text: text.toUpperCase(),
    x: 100,
    y: y - 16,
    w: 420,
    h: 20,
    fontSize: 10,
    bold: true,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function cue(slide, ctx, text, x, y, w = 520, color = COLORS.muted) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    w,
    h: 34,
    fontSize: 17,
    color,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function label(slide, ctx, text, x, y, w, color = COLORS.ink) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    w,
    h: 26,
    fontSize: 14,
    bold: true,
    color,
    align: "center",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function box(slide, ctx, text, x, y, w, h, color = COLORS.panel, accent = COLORS.cyan) {
  ctx.addShape(slide, {
    x,
    y,
    w,
    h,
    fill: color,
    line: { style: "solid", fill: COLORS.line, width: 1 },
  });
  ctx.addShape(slide, { x, y, w: 5, h, fill: accent });
  return ctx.addText(slide, {
    text,
    x: x + 20,
    y: y + 18,
    w: w - 40,
    h: h - 40,
    fontSize: 18,
    bold: true,
    color: COLORS.ink,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function pill(slide, ctx, text, x, y, w, color) {
  ctx.addShape(slide, {
    x,
    y,
    w,
    h: 36,
    fill: color,
    line: { style: "solid", fill: color, width: 1 },
  });
  return ctx.addText(slide, {
    text,
    x,
    y: y + 8,
    w,
    h: 18,
    fontSize: 11,
    bold: true,
    color: COLORS.bg,
    align: "center",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function arrow(slide, ctx, x1, y1, x2, y2, color = COLORS.line) {
  const width = x2 - x1;
  ctx.addShape(slide, { x: x1, y: y1, w: width, h: 2, fill: color });
  ctx.addShape(slide, { geometry: "triangle", x: x2 - 8, y: y2 - 7, w: 14, h: 14, fill: color, line: { style: "solid", fill: color, width: 0 } });
}

export function footer(slide, ctx, text) {
  return ctx.addText(slide, {
    text,
    x: 56,
    y: 654,
    w: 820,
    h: 24,
    fontSize: 11,
    color: COLORS.soft,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}
