import { bg, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide11(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 11);
  kicker(slide, ctx, "Close");
  title(slide, ctx, "Modern Apollo is not heavier. It is more explicit.", 106, 44, 960);
  const takeaways = [
    "Preload at the route.",
    "Colocate the fragment.",
    "Trust the normalized cache.",
    "Make rerenders intentional.",
  ];
  takeaways.forEach((text, index) => {
    const x = 112 + (index % 2) * 520;
    const y = 296 + Math.floor(index / 2) * 110;
    ctx.addShape(slide, { x, y, w: 38, h: 38, fill: [COLORS.green, COLORS.cyan, COLORS.yellow, COLORS.violet][index] });
    ctx.addText(slide, { text, x: x + 62, y: y + 4, w: 390, h: 34, fontSize: 24, bold: true, color: COLORS.ink, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  });
  ctx.addText(slide, {
    text: "AI can help you type the pattern. You still need to choose the pattern.",
    x: 112,
    y: 552,
    w: 820,
    h: 34,
    fontSize: 21,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Closing line: simpler mental model, better perceived performance.");
  return slide;
}
