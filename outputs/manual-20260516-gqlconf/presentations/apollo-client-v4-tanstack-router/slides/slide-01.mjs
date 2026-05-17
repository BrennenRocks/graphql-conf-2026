import { bg, COLORS, footer, pill, title } from "./shared.mjs";

export default function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 1);
  title(slide, ctx, "Apollo Client v4 + TanStack Router", 138, 52, 820);
  ctx.addText(slide, {
    text: "Modern React data loading without giving up a normalized cache.",
    x: 60,
    y: 292,
    w: 660,
    h: 42,
    fontSize: 22,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  pill(slide, ctx, "codegen", 62, 410, 132, COLORS.green);
  pill(slide, ctx, "route preload", 212, 410, 164, COLORS.cyan);
  pill(slide, ctx, "optimistic UI", 394, 410, 166, COLORS.yellow);
  pill(slide, ctx, "cache-first rendering", 578, 410, 218, COLORS.violet);
  ctx.addShape(slide, { x: 904, y: 120, w: 244, h: 244, fill: COLORS.panel, line: { style: "solid", fill: COLORS.line, width: 1 } });
  ctx.addText(slide, {
    text: "{ data }\nflows where\ncomponents\nneed it",
    x: 942,
    y: 160,
    w: 168,
    h: 160,
    fontSize: 28,
    bold: true,
    color: COLORS.ink,
    align: "center",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Talk goal: use the slides as guardrails while the app does the teaching.");
  return slide;
}
