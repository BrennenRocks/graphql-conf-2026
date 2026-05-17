import { bg, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 6);
  kicker(slide, ctx, "Cache");
  title(slide, ctx, "The cache is not just a response store.", 106, 44, 860);
  ctx.addShape(slide, { x: 112, y: 292, w: 220, h: 104, fill: COLORS.panel, line: { style: "solid", fill: COLORS.line, width: 1 } });
  ctx.addShape(slide, { x: 512, y: 218, w: 256, h: 256, fill: COLORS.panel2, line: { style: "solid", fill: COLORS.cyan, width: 2 } });
  ctx.addShape(slide, { x: 948, y: 292, w: 220, h: 104, fill: COLORS.panel, line: { style: "solid", fill: COLORS.line, width: 1 } });
  ctx.addText(slide, { text: "server result", x: 112, y: 328, w: 220, h: 30, fontSize: 22, bold: true, color: COLORS.muted, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addText(slide, { text: "normalized\nentity graph", x: 548, y: 298, w: 184, h: 74, fontSize: 28, bold: true, color: COLORS.ink, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addText(slide, { text: "component reads", x: 948, y: 328, w: 220, h: 30, fontSize: 22, bold: true, color: COLORS.muted, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addShape(slide, { x: 342, y: 342, w: 148, h: 2, fill: COLORS.green });
  ctx.addShape(slide, { x: 790, y: 342, w: 136, h: 2, fill: COLORS.violet });
  ctx.addText(slide, { text: "If the graph is correct, refetches become the exception.", x: 112, y: 536, w: 760, h: 30, fontSize: 19, color: COLORS.muted, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  footer(slide, ctx, "Demo cue: show cache update reflected without reloading the route.");
  return slide;
}
