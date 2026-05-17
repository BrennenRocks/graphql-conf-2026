import { C, card, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide02(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Why learn libraries in the age of AI?");
  title(slide, ctx, "AI can write plausible code. You still choose the pattern.", 112, 32, 820);
  note(slide, ctx, "The model often knows an API exists. It does not always know the architecture pressure behind it.", 68, 198, 790, 16);
  card(slide, ctx, "AI reaches for the obvious hook.", 74, 276, 244, 92, C.magenta, 17);
  card(slide, ctx, "Apollo has sharper tools.", 358, 276, 244, 92, C.blue, 17);
  card(slide, ctx, "Library judgment decides when.", 642, 276, 244, 92, C.green, 17);
  note(slide, ctx, "Example: @nonreactive changes who listens to cache updates.", 74, 416, 760, 18);
  footer(slide, ctx, "Opening frame: AI speeds up typing, not architectural judgment.");
  return slide;
}
