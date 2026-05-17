import { bg, box, COLORS, cue, footer, kicker, title } from "./shared.mjs";

export default function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 2);
  kicker(slide, ctx, "Opening");
  title(slide, ctx, "AI can write code. It cannot own your data model.", 106, 44, 980);
  cue(slide, ctx, "Library knowledge is still the difference between plausible code and correct architecture.", 62, 250, 780, COLORS.ink);
  box(slide, ctx, "AI often reaches for the obvious hook.", 76, 356, 330, 118, COLORS.panel, COLORS.red);
  box(slide, ctx, "Modern Apollo gives us sharper tools.", 474, 356, 330, 118, COLORS.panel, COLORS.cyan);
  box(slide, ctx, "You need to know when to use them.", 872, 356, 330, 118, COLORS.panel, COLORS.green);
  ctx.addText(slide, {
    text: "Example: @nonreactive is not a random directive. It changes who listens to cache updates.",
    x: 76,
    y: 528,
    w: 860,
    h: 30,
    fontSize: 18,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Set the frame: AI accelerates implementation, but library judgment still matters.");
  return slide;
}
