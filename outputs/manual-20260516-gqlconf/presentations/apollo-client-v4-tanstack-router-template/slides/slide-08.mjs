import { C, card, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide08(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Optimistic UI");
  title(slide, ctx, "Latency should not hide what the user just did.", 108, 35, 780);
  card(slide, ctx, "useMutation\noptimisticResponse", 82, 272, 232, 96, C.green, 16);
  card(slide, ctx, "useMutation\nupdate(cache, result)", 364, 272, 232, 96, C.blue, 16);
  card(slide, ctx, "UI renders\nfrom cache", 646, 272, 232, 96, C.yellow, 16);
  note(slide, ctx, "In the app: createPlant uses optimisticResponse, then update writes the returned edge into the room cache.", 82, 416, 780, 17);
  footer(slide, ctx, "Repo cue: useMutation(CreatePlantMutation, { update }) in RoomPlantList.");
  return slide;
}
