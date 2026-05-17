import { bg, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 8);
  kicker(slide, ctx, "Rerenders");
  title(slide, ctx, "@nonreactive changes who has to listen.", 106, 48, 880);
  ctx.addShape(slide, { x: 92, y: 300, w: 312, h: 132, fill: COLORS.panel, line: { style: "solid", fill: COLORS.red, width: 2 } });
  ctx.addText(slide, { text: "Parent watches\nevery row field", x: 132, y: 330, w: 232, h: 78, fontSize: 25, bold: true, color: COLORS.ink, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addText(slide, { text: "before", x: 196, y: 454, w: 104, h: 24, fontSize: 13, bold: true, color: COLORS.red, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addShape(slide, { x: 548, y: 300, w: 312, h: 132, fill: COLORS.panel, line: { style: "solid", fill: COLORS.cyan, width: 2 } });
  ctx.addText(slide, { text: "Parent watches ids.\nRows watch fragments.", x: 584, y: 322, w: 240, h: 90, fontSize: 22, bold: true, color: COLORS.ink, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addText(slide, { text: "after", x: 652, y: 454, w: 104, h: 24, fontSize: 13, bold: true, color: COLORS.cyan, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addText(slide, { text: "useFragment creates the live binding where the data is consumed.", x: 92, y: 540, w: 820, h: 30, fontSize: 19, color: COLORS.muted, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  footer(slide, ctx, "Demo cue: show a row update without making the list re-render.");
  return slide;
}
