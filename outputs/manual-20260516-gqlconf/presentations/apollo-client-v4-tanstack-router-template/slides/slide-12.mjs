import { C, footer, templateBg } from "./shared.mjs";

export default async function slide12(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx, "side");
  ctx.addText(slide, {
    text: "Modern Apollo is more explicit.",
    x: 58,
    y: 92,
    w: 650,
    h: 78,
    fontSize: 42,
    bold: true,
    color: C.black,
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  const items = ["Preload at the route.", "Colocate the fragment.", "Trust the normalized cache.", "Make rerenders intentional."];
  items.forEach((item, index) => {
    const y = 220 + index * 54;
    ctx.addShape(slide, { x: 72, y: y + 5, w: 18, h: 18, fill: [C.magenta, C.blue, C.green, C.yellow][index] });
    ctx.addText(slide, { text: item, x: 112, y, w: 500, h: 28, fontSize: 22, bold: true, color: C.black, typeface: "Arial", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  });
  ctx.addText(slide, {
    text: "AI can help you type the pattern. You still choose the pattern.",
    x: 72,
    y: 458,
    w: 610,
    h: 28,
    fontSize: 17,
    color: C.gray,
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Closing line: simpler mental model, better perceived performance.");
  return slide;
}
