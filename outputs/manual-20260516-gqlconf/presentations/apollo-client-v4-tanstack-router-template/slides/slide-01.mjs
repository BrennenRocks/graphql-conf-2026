import { C, footer, templateBg } from "./shared.mjs";

export default async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx, "title");
  ctx.addShape(slide, { x: 104, y: 405, w: 752, h: 74, fill: "#00000055", line: { style: "solid", fill: "#00000000", width: 0 } });
  ctx.addText(slide, {
    text: "Apollo Client v4 + TanStack Router",
    x: 126,
    y: 418,
    w: 708,
    h: 34,
    fontSize: 27,
    bold: true,
    color: "#FFFFFF",
    typeface: "Arial",
    align: "center",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  ctx.addText(slide, {
    text: "preload, colocate, cache, render less",
    x: 126,
    y: 454,
    w: 708,
    h: 18,
    fontSize: 14,
    bold: true,
    color: C.green,
    typeface: "Arial",
    align: "center",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Talk guide deck");
  return slide;
}
