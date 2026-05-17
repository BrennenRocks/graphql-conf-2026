import { bg, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 10);
  kicker(slide, ctx, "Demo map");
  title(slide, ctx, "The path through the app", 106, 48, 760);
  const steps = [
    "route loader",
    "generated query",
    "fragment boundary",
    "optimistic mutation",
    "cache broadcast",
  ];
  steps.forEach((step, index) => {
    const y = 244 + index * 62;
    ctx.addText(slide, { text: String(index + 1).padStart(2, "0"), x: 96, y, w: 52, h: 30, fontSize: 21, bold: true, color: COLORS.cyan, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
    ctx.addShape(slide, { x: 164, y: y + 14, w: 112, h: 2, fill: index % 2 === 0 ? COLORS.green : COLORS.violet });
    ctx.addText(slide, { text: step, x: 304, y: y - 2, w: 460, h: 34, fontSize: 25, bold: true, color: COLORS.ink, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  });
  ctx.addText(slide, {
    text: "Keep returning to the same question: who owns this data, and who should react when it changes?",
    x: 806,
    y: 286,
    w: 322,
    h: 132,
    fontSize: 25,
    bold: true,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Use this slide as the live-coding checklist.");
  return slide;
}
