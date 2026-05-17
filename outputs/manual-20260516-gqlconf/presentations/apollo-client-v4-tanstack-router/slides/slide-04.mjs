import { bg, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 4);
  kicker(slide, ctx, "Codegen");
  title(slide, ctx, "Let the schema shape the app before runtime.", 106, 44, 900);
  const rows = [
    ["schema", "types"],
    ["operations", "documents"],
    ["fragments", "component contracts"],
  ];
  rows.forEach(([left, right], index) => {
    const y = 292 + index * 86;
    ctx.addText(slide, { text: left, x: 104, y, w: 260, h: 34, fontSize: 25, bold: true, color: COLORS.ink, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
    ctx.addShape(slide, { x: 384, y: y + 16, w: 190, h: 2, fill: index === 0 ? COLORS.green : index === 1 ? COLORS.cyan : COLORS.violet });
    ctx.addText(slide, { text: right, x: 610, y, w: 430, h: 34, fontSize: 25, bold: true, color: COLORS.muted, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  });
  ctx.addText(slide, {
    text: "The best refactor is the one TypeScript refuses to let you half-finish.",
    x: 104,
    y: 548,
    w: 760,
    h: 30,
    fontSize: 18,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Demo cue: point at generated operation types and fragment references.");
  return slide;
}
