import { C, code, footer, header, note, templateBg, title } from "./shared.mjs";

export default async function slide05(presentation, ctx) {
  const slide = presentation.slides.add();
  await templateBg(slide, ctx);
  header(slide, ctx, "Fragment colocation");
  title(slide, ctx, "Each component owns the fields it reads.", 108, 35, 760);
  code(
    slide,
    ctx,
    "fragment User_user on User {\n  id\n  name\n  ...UserAvatar_user\n}\n\nfunction User({ user }) {\n  // reads name\n  return <UserAvatar user={user} />;\n}\n\nfragment UserAvatar_user on User {\n  avatarUrl\n}",
    60,
    202,
    470,
    264,
    10.6
  );
  ctx.addShape(slide, { x: 604, y: 238, w: 208, h: 66, fill: "#F7F7F7", line: { style: "solid", fill: "#CCCCCC", width: 1 } });
  ctx.addText(slide, { text: "User", x: 634, y: 258, w: 148, h: 28, fontSize: 22, bold: true, color: C.black, align: "center", typeface: "Arial", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  ctx.addShape(slide, { x: 658, y: 332, w: 100, h: 100, fill: "#FFFFFF", line: { style: "solid", fill: C.magenta, width: 3 } });
  ctx.addText(slide, { text: "avatarUrl", x: 658, y: 370, w: 100, h: 24, fontSize: 14, bold: true, color: C.magenta, align: "center", typeface: "Arial", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  note(slide, ctx, "The avatar does not need email, role, bio, or settings.", 572, 452, 330, 15);
  footer(slide, ctx, "Rule: parent composes child fragments; child reads its own fragment.");
  return slide;
}
