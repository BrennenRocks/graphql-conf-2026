import { bg, box, COLORS, footer, kicker, title } from "./shared.mjs";

export default function slide07(presentation, ctx) {
  const slide = presentation.slides.add();
  bg(slide, ctx, 7);
  kicker(slide, ctx, "Mutation path");
  title(slide, ctx, "Optimistic updates make latency visible only when it matters.", 106, 40, 980);
  const items = [
    ["1", "write optimistic entity", COLORS.green],
    ["2", "render from cache", COLORS.cyan],
    ["3", "reconcile server result", COLORS.yellow],
  ];
  items.forEach(([num, text, color], index) => {
    const x = 118 + index * 364;
    ctx.addShape(slide, { x, y: 310, w: 68, h: 68, fill: color, line: { style: "solid", fill: color, width: 0 } });
    ctx.addText(slide, { text: num, x, y: 326, w: 68, h: 34, fontSize: 28, bold: true, color: COLORS.bg, align: "center", insets: { left: 0, right: 0, top: 0, bottom: 0 } });
    box(slide, ctx, text, x + 88, 294, 220, 98, COLORS.panel, color);
  });
  ctx.addText(slide, {
    text: "The UI should not wait for the network to tell it what the user just did.",
    x: 118,
    y: 512,
    w: 850,
    h: 30,
    fontSize: 19,
    color: COLORS.muted,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
  footer(slide, ctx, "Demo cue: run the optimistic interaction slowly, then show the cache state.");
  return slide;
}
