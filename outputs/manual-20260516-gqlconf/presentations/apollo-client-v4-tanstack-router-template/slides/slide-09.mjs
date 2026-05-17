import { C, card, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide09(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Rerender boundaries");
  title(slide, ctx, "@nonreactive changes who has to listen.", 108, 38, 780);
  card(slide, ctx, "before\nparent watches every row field", 122, 282, 284, 102, C.red, 17);
  card(slide, ctx, "after\nparent watches ids, rows watch fragments", 554, 282, 284, 102, C.green, 17);
  note(slide, ctx, "useFragment creates the live binding where the data is consumed.", 122, 430, 720, 17);
  footer(slide, ctx, "Demo cue: row data updates without making the list owner do extra work.");
  return slide;
}
