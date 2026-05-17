import { bg, box, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 5);
  kicker(slide, ctx, "Colocation");
  title(slide, ctx, "Queries compose the screen. Fragments belong to components.", 106, 40, 980);
  box(slide, ctx, "Route query\nselects ids + spreads", 86, 300, 260, 126, COLORS.panel, COLORS.cyan);
  box(slide, ctx, "List component\nmaps entities", 426, 300, 260, 126, COLORS.panel, COLORS.green);
  box(slide, ctx, "Row component\nreads its fragment", 766, 300, 260, 126, COLORS.panel, COLORS.violet);
  ctx.addShape(slide, { x: 1028, y: 358, w: 70, h: 2, fill: COLORS.line });
  ctx.addText(slide, { text: "less prop\ndrilling", x: 1112, y: 332, w: 112, h: 52, fontSize: 18, bold: true, color: COLORS.yellow, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addText(slide, {
    text: "Repeated fields are not duplication. They are ownership.",
    x: 86,
    y: 512,
    w: 680,
    h: 30,
    fontSize: 19,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Demo cue: open parent query, then child fragment.");
  return slide;
}
