import { C, card, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide10(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Performance");
  title(slide, ctx, "Fewer refetches. Fewer rerenders. Less glue code.", 108, 34, 820);
  card(slide, ctx, "Preload once\nat navigation", 86, 294, 232, 88, C.magenta, 17);
  card(slide, ctx, "Normalize once\nin the cache", 364, 294, 232, 88, C.blue, 17);
  card(slide, ctx, "Read narrowly\nin components", 642, 294, 232, 88, C.green, 17);
  note(slide, ctx, "The performance story is mostly a data ownership story.", 86, 428, 700, 18);
  footer(slide, ctx, "Keep the mental model simple: who owns this data, and who reacts?");
  return slide;
}
