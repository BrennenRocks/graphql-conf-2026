import { C, card, code, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide06(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Bad example");
  title(slide, ctx, "One shared query becomes a shared liability.", 108, 35, 790);
  code(
    slide,
    ctx,
    "query UserScreen($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    email\n    avatarUrl\n    billingAddress\n    lastLoginAt\n  }\n}\n\n<UserProfile user={data.user} />\n<UserAvatar user={data.user} />",
    70,
    196,
    430,
    272,
    11.2
  );
  card(slide, ctx, "Profile needs:\nname + email", 548, 226, 244, 74, C.blue, 16);
  card(slide, ctx, "Avatar needs:\navatarUrl", 548, 322, 244, 74, C.green, 16);
  note(slide, ctx, "Both components now depend on the same oversized shape.", 548, 432, 334, 16);
  footer(slide, ctx, "Anti-pattern: one component's data change makes everyone care.");
  return slide;
}
