const ROOT =
  "/Users/brennen/Documents/code/personal/graphql-conf/outputs/manual-20260516-gqlconf/presentations/apollo-client-v4-tanstack-router-template";

export const BG = {
  title: `${ROOT}/assets/template-title.png`,
  content: `${ROOT}/assets/template-content.png`,
  side: `${ROOT}/assets/template-side.png`,
};

export const C = {
  black: "#111111",
  gray: "#4D4D4D",
  lightGray: "#F4F4F4",
  magenta: "#E10098",
  purple: "#4A214C",
  green: "#B7D93A",
  blue: "#029FD6",
  yellow: "#F1CD33",
  red: "#C53A63",
};

const CODE = {
  bg: "#161616",
  text: "#EAEAEA",
  keyword: "#FF77C8",
  type: "#7DD3FC",
  component: "#B7D93A",
  function: "#F1CD33",
  comment: "#8C8C8C",
  punctuation: "#BDBDBD",
};

export async function templateBg(slide, ctx, kind = "content") {
  await ctx.addImage(slide, {
    path: BG[kind],
    x: 0,
    y: 0,
    w: 960,
    h: 540,
    fit: "cover",
    alt: `GraphQLConf template ${kind} background`,
  });
}

export function header(slide, ctx, text) {
  ctx.addText(slide, {
    text,
    x: 50,
    y: 17,
    w: 720,
    h: 34,
    fontSize: 23,
    bold: true,
    color: "#FFFFFF",
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function title(slide, ctx, text, y = 104, size = 35, w = 780) {
  ctx.addText(slide, {
    text,
    x: 66,
    y,
    w,
    h: 84,
    fontSize: size,
    bold: true,
    color: C.black,
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function note(slide, ctx, text, x, y, w = 760, size = 17) {
  ctx.addText(slide, {
    text,
    x,
    y,
    w,
    h: 46,
    fontSize: size,
    color: C.gray,
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function card(slide, ctx, text, x, y, w, h, accent = C.magenta, size = 18) {
  ctx.addShape(slide, {
    x,
    y,
    w,
    h,
    fill: "#FFFFFF",
    line: { style: "solid", fill: "#DADADA", width: 1 },
  });
  ctx.addShape(slide, { x, y, w: 8, h, fill: accent });
  ctx.addText(slide, {
    text,
    x: x + 18,
    y: y + 14,
    w: w - 36,
    h: h - 32,
    fontSize: size,
    bold: true,
    color: C.black,
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function code(slide, ctx, text, x, y, w, h, size = 12.5) {
  ctx.addShape(slide, {
    x,
    y,
    w,
    h,
    fill: "#161616",
    line: { style: "solid", fill: "#303030", width: 1 },
  });
  const charWidth = size * 0.62;
  const lineHeight = size * 1.55;
  const lines = text.split("\n");
  lines.forEach((line, lineIndex) => {
    let cursor = x + 14;
    const yy = y + 14 + lineIndex * lineHeight;
    const tokens = tokenizeCodeLine(line);
    tokens.forEach((token) => {
      if (token.text.length === 0) {
        return;
      }
      ctx.addText(slide, {
        text: token.text,
        x: cursor,
        y: yy,
        w: Math.max(6, token.text.length * charWidth),
        h: size * 1.2,
        fontSize: size,
        color: token.color,
        typeface: "Courier New",
        insets: { left: 0, right: 0, top: 0, bottom: 0 },
      });
      cursor += token.text.length * charWidth;
    });
  });
}

export function arrow(slide, ctx, x1, y, x2, color = C.magenta) {
  ctx.addShape(slide, { x: x1, y, w: x2 - x1, h: 3, fill: color });
  ctx.addText(slide, {
    text: ">",
    x: x2 - 8,
    y: y - 16,
    w: 18,
    h: 32,
    fontSize: 24,
    bold: true,
    color,
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function tokenizeCodeLine(line) {
  if (line.trim().startsWith("//")) {
    return [{ text: line, color: CODE.comment }];
  }

  const tokens = [];
  const pattern =
    /(\s+|[A-Za-z_$][\w$]*|<\/?[A-Z][A-Za-z0-9_.]*|[{}()[\]<>/.,;:=!?]+|.)/g;
  for (const match of line.matchAll(pattern)) {
    const text = match[0];
    tokens.push({ text, color: codeColor(text) });
  }
  return tokens;
}

function codeColor(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return CODE.text;
  }
  if (/^(const|function|return|fragment|query|on)$/.test(trimmed)) {
    return CODE.keyword;
  }
  if (/^(useLoadableQuery|loadCareNote|PlantCareNoteQuery|UserScreen)$/.test(trimmed)) {
    return CODE.function;
  }
  if (/^<\/?[A-Z]/.test(trimmed)) {
    return CODE.component;
  }
  if (/^(User|ID|User_user|UserAvatar_user)$/.test(trimmed)) {
    return CODE.type;
  }
  if (/^[{}()[\]<>/.,;:=!?]+$/.test(trimmed)) {
    return CODE.punctuation;
  }
  return CODE.text;
}

export function footer(slide, ctx, text) {
  ctx.addText(slide, {
    text,
    x: 66,
    y: 523,
    w: 760,
    h: 12,
    fontSize: 8.5,
    color: "#FFFFFF",
    typeface: "Arial",
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  });
}
