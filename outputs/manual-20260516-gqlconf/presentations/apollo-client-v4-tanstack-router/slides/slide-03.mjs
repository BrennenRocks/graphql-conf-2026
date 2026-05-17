import { arrow, bg, box, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 3);
  kicker(slide, ctx, "Architecture");
  title(slide, ctx, "Move the first fetch to the route boundary.", 108, 42, 860);
  box(slide, ctx, "TanStack Router\nloader", 78, 324, 214, 112, COLORS.panel, COLORS.cyan);
  arrow(slide, ctx, 310, 380, 386, 380, COLORS.cyan);
  box(slide, ctx, "Apollo\npreloadQuery", 404, 324, 214, 112, COLORS.panel, COLORS.green);
  arrow(slide, ctx, 636, 380, 712, 380, COLORS.green);
  box(slide, ctx, "Normalized\ncache", 730, 324, 214, 112, COLORS.panel, COLORS.yellow);
  arrow(slide, ctx, 962, 380, 1038, 380, COLORS.yellow);
  box(slide, ctx, "Route\ncomponent", 1056, 324, 170, 112, COLORS.panel2, COLORS.violet);
  ctx.addText(slide, {
    text: "The component renders with data already in motion, not after a useEffect-style waterfall.",
    x: 82,
    y: 500,
    w: 870,
    h: 32,
    fontSize: 18,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Demo cue: show the route definition before opening the UI.");
  return slide;
}
