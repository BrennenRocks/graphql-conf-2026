import { arrow, C, card, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide03(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Route-level preloading");
  title(slide, ctx, "Preload anything you want on screen ASAP.", 112, 36, 780);
  card(slide, ctx, "TanStack Router\nloader", 82, 280, 164, 88, C.magenta, 16);
  arrow(slide, ctx, 264, 323, 342, C.magenta);
  card(slide, ctx, "Apollo\npreloadQuery", 362, 280, 164, 88, C.blue, 16);
  arrow(slide, ctx, 544, 323, 622, C.blue);
  card(slide, ctx, "useReadQuery\nin route UI", 642, 280, 164, 88, C.green, 16);
  note(slide, ctx, "The route starts the request before the component tree asks for it.", 82, 410, 760, 18);
  footer(slide, ctx, "Repo cue: apps/web/src/routes/rooms/$roomId.tsx preloads room detail and care plan data.");
  return slide;
}
