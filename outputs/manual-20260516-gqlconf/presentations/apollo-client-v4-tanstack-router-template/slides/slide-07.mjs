import { arrow, C, card, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Cache model");
  title(slide, ctx, "The cache is an entity graph, not a response drawer.", 108, 34, 820);
  card(slide, ctx, "server result", 98, 278, 178, 78, C.magenta, 17);
  arrow(slide, ctx, 294, 316, 380, C.magenta);
  card(slide, ctx, "normalized\ncache", 400, 252, 190, 130, C.blue, 22);
  arrow(slide, ctx, 610, 316, 696, C.blue);
  card(slide, ctx, "component\nreads", 716, 278, 178, 78, C.green, 17);
  note(slide, ctx, "When the graph is right, refetching becomes the exception.", 98, 424, 740, 18);
  footer(slide, ctx, "Demo cue: mutation result updates the cache, UI follows.");
  return slide;
}
