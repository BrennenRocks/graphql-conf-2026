import { C, card, code, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide04(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Event-driven Suspense queries");
  title(slide, ctx, "useLoadableQuery is for data you load after interaction.", 104, 31, 830);
  code(
    slide,
    ctx,
    "const [loadCareNote, queryRef] =\n  useLoadableQuery(PlantCareNoteQuery);\n\n<Button onClick={() => loadCareNote({ id })} />\n\n{queryRef ? <PlantCareNotePanel queryRef={queryRef} /> : null}",
    66,
    218,
    488,
    174,
    12.2
  );
  card(slide, ctx, "In this app:\nload a plant care note only after the user asks.", 594, 224, 284, 92, C.green, 16);
  card(slide, ctx, "Honorable mention:\nuseBackgroundQuery starts work above a Suspense boundary and helps avoid waterfall loading.", 594, 338, 284, 116, C.blue, 15);
  footer(slide, ctx, "Repo cue: apps/web/src/components/rooms/room-plant-list.tsx");
  return slide;
}
