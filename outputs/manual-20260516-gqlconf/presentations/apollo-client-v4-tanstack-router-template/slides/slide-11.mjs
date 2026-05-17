import { C, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide11(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Demo path");
  title(slide, ctx, "The path through the app", 108, 38, 720);
  const steps = ["route loader", "Query", "Fragment", "optimistic mutation", "cache broadcast"];
  steps.forEach((step, index) => {
    const y = 220 + index * 46;
    ctx.addText(slide, { text: String(index + 1).padStart(2, "0"), x: 90, y, w: 42, h: 24, fontSize: 18, bold: true, color: C.magenta, typeface: "Arial", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
    ctx.addShape(slide, { x: 146, y: y + 11, w: 78, h: 3, fill: index % 2 ? C.blue : C.green });
    ctx.addText(slide, { text: step, x: 250, y: y - 2, w: 360, h: 28, fontSize: 22, bold: true, color: C.black, typeface: "Arial", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  });
  ctx.addText(slide, {
    text: "Keep asking: who owns this data, and who should react when it changes?",
    x: 610,
    y: 268,
    w: 270,
    h: 68,
    fontSize: 18,
    color: C.gray,
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Use this as the live coding checklist.");
  return slide;
}
