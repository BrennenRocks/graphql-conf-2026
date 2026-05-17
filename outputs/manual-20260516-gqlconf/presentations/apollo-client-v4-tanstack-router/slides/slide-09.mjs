import { bg, box, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 9);
  kicker(slide, ctx, "Performance");
  title(slide, ctx, "Fewer refetches. Fewer rerenders. Less glue code.", 106, 44, 940);
  box(slide, ctx, "Preload once\nat navigation", 100, 306, 256, 112, COLORS.panel, COLORS.green);
  box(slide, ctx, "Normalize once\nin the cache", 514, 306, 256, 112, COLORS.panel, COLORS.cyan);
  box(slide, ctx, "Read narrowly\nin components", 928, 306, 256, 112, COLORS.panel, COLORS.violet);
  ctx.addText(slide, {
    text: "The performance story is mostly a data ownership story.",
    x: 100,
    y: 520,
    w: 680,
    h: 30,
    fontSize: 20,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Demo cue: compare what changes in the UI with what actually changes in React.");
  return slide;
}
