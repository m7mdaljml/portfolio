import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import { cv } from "./cv-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_FILE = path.join(ROOT, "public", cv.meta.fileName);

/* ------------------------------------------------------------------ fonts */

const FONT_DIRS = [
  "C:\\Windows\\Fonts",
  "/Library/Fonts",
  "/System/Library/Fonts/Supplemental",
  "/usr/share/fonts/truetype",
  "/usr/share/fonts",
];

function findFontFile(names) {
  for (const dir of FONT_DIRS) {
    for (const name of names) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return null;
}

const doc = new PDFDocument({
  size: "A4",
  margins: {
    top: 42,
    bottom: 45,
    left: 50.4,
    right: 50.4,
  },
  autoFirstPage: true,
  bufferPages: true,
  info: {
    Title: cv.meta.title,
    Author: cv.meta.author,
    Subject: cv.meta.subject,
    Keywords: cv.meta.keywords,
    Creator: "Mohammad Aljamal - CV generator",
  },
});

// let pageCreated = 1;

// doc.on("pageAdded", () => {
//   pageCreated++;
//   console.log(`PDF page created: ${pageCreated}`);
// });

const usedFonts = {};
function registerFont(name, files, fallback) {
  const file = findFontFile(files);
  if (file) {
    doc.registerFont(name, file);
    usedFonts[name] = path.basename(file);
    return name;
  }
  usedFonts[name] = `${fallback} (built-in)`;
  return fallback;
}

const HEAD = registerFont(
  "CvHead",
  ["arial.ttf", "Arial.ttf", "Arial Regular.ttf"],
  "Helvetica",
);
const HEAD_BOLD = registerFont(
  "CvHeadBold",
  ["arialbd.ttf", "Arialbd.ttf", "Arial Bold.ttf"],
  "Helvetica-Bold",
);
const BODY = registerFont(
  "CvBody",
  ["calibri.ttf", "Calibri.ttf", "Calibri Regular.ttf"],
  "Helvetica",
);
const BODY_BOLD = registerFont(
  "CvBodyBold",
  ["calibrib.ttf", "Calibrib.ttf", "Calibri Bold.ttf"],
  "Helvetica-Bold",
);

/* ----------------------------------------------------------------- layout */

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M_LEFT = 50.4;
const M_RIGHT = 50.4;
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT;
const CONTENT_TOP = 42;
const CONTENT_BOTTOM = PAGE_H - 45;

const SIZE = {
  name: 28,
  headline: 15,
  section: 12.5,
  role: 11,
  body: 10.5,
  skill: 10,
  meta: 9.5,
  footer: 8.5,
};

const GAP = {
  body: 2,
  tight: 1,
  afterBullet: 2.8,
  afterRole: 2,
  beforeSection: 10,
  afterSection: 6,
  afterEntry: 8,
};

const BULLET_INDENT = 12;
const BULLET = "\u2022";

const COLOR = {
  accent: "#176B64",
  accentSoft: "#D5E5E2",
  name: "#12304A",
  ink: "#202C39",
  body: "#344054",
  muted: "#667586",
  rule: "#D8E0E7",
  white: "#FFFFFF",
};

/* ------------------------------------------------------------- primitives */

function resetX() {
  doc.x = M_LEFT;
}

function ensureSpace(needed) {
  if (doc.y + needed <= CONTENT_BOTTOM) return;

  if (doc.y <= CONTENT_TOP + 1) return;

  doc.addPage();
  resetX();
}

function rule(color = COLOR.rule, thickness = 0.7) {
  const y = doc.y;

  doc
    .save()
    .moveTo(M_LEFT, y)
    .lineTo(M_LEFT + CONTENT_W, y)
    .lineWidth(thickness)
    .strokeColor(color)
    .stroke()
    .restore();
}

function paragraph(text, options = {}) {
  const {
    size = SIZE.body,
    font = BODY,
    color = COLOR.body,
    lineGap = GAP.body,
    width = CONTENT_W,
    align = "left",
  } = options;

  resetX();

  doc.font(font).fontSize(size).fillColor(color);

  const height = doc.heightOfString(text, {
    width,
    lineGap,
    align,
  });

  ensureSpace(height);

  resetX();

  doc.font(font).fontSize(size).fillColor(color);

  doc.text(text, {
    width,
    align,
    lineGap,
  });
}

function sectionTitle(title, followingContentHeight = 35) {
  ensureSpace(48 + followingContentHeight);

  doc.y += GAP.beforeSection;
  resetX();

  doc.font(HEAD_BOLD).fontSize(SIZE.section).fillColor(COLOR.accent);

  doc.text(title.toUpperCase(), {
    width: CONTENT_W,
    characterSpacing: 0.8,
    lineGap: 0,
  });

  doc.y += 4;
  rule(COLOR.rule, 0.7);
  doc.y += GAP.afterSection;
}

/**
 * Entry title and supporting metadata.
 * Starts a new page if there is insufficient room for both lines.
 */
function entryTitle(title, meta) {
  const titleHeight = doc.heightOfString(title, {
    width: CONTENT_W,
    font: HEAD_BOLD,
    fontSize: SIZE.role,
    lineGap: 0,
  });

  const metaHeight = doc.heightOfString(meta, {
    width: CONTENT_W,
    font: BODY,
    fontSize: SIZE.meta,
    lineGap: 0,
  });

  ensureSpace(titleHeight + metaHeight + GAP.afterRole + 8);

  resetX();

  doc.font(HEAD_BOLD).fontSize(SIZE.role).fillColor(COLOR.name);

  doc.text(title, {
    width: CONTENT_W,
    lineGap: 0,
  });

  doc.y += GAP.afterRole;

  resetX();

  doc.font(BODY).fontSize(SIZE.meta).fillColor(COLOR.muted);

  doc.text(meta, {
    width: CONTENT_W,
    lineGap: 0,
  });

  doc.y += 4;
}

/**
 * Bullet with a real bullet glyph, hanging indent,
 * and optional bold lead-in.
 *
 * fragments: [{ text, font?, size?, color? }]
 */
function bullet(fragments, options = {}) {
  const {
    size = SIZE.body,
    bulletColor = COLOR.accent,
    indent = BULLET_INDENT,
  } = options;

  const parts = Array.isArray(fragments) ? fragments : [{ text: fragments }];

  const plainText = parts.map((part) => part.text).join("");

  const width = CONTENT_W - indent;

  const estimatedHeight = doc.heightOfString(plainText, {
    width,
    font: BODY,
    fontSize: size,
    lineGap: GAP.body,
  });

  ensureSpace(estimatedHeight + GAP.afterBullet);

  const x0 = M_LEFT;
  const y0 = doc.y;

  doc.font(BODY).fontSize(size).fillColor(bulletColor);

  doc.text(BULLET, x0, y0, {
    lineBreak: false,
  });

  parts.forEach((part, index) => {
    const last = index === parts.length - 1;

    if (index === 0) {
      doc.x = x0 + indent;
      doc.y = y0;
    }

    doc
      .font(part.font ?? BODY)
      .fontSize(part.size ?? size)
      .fillColor(part.color ?? COLOR.body);

    doc.text(part.text, {
      width,
      continued: !last,
      lineGap: GAP.body,
    });
  });

  doc.x = M_LEFT;
  doc.y += GAP.afterBullet;
}

/**
 * Single line composed of multiple text segments.
 * URLs remain clickable without replacing visible text.
 */
function segmentLine(segments, options = {}) {
  const { size = SIZE.skill, lineGap = GAP.tight } = options;

  const estimatedHeight = size * 1.3 + lineGap;

  ensureSpace(estimatedHeight);

  const y = doc.y;

  resetX();

  for (const seg of segments) {
    const segmentSize = seg.size ?? size;
    const segmentFont = seg.font ?? BODY;

    doc
      .font(segmentFont)
      .fontSize(segmentSize)
      .fillColor(seg.color ?? COLOR.body);

    const x0 = doc.x;

    doc.text(seg.text, x0, y, {
      lineBreak: false,
    });

    if (seg.url) {
      const width = doc.widthOfString(seg.text, {
        font: segmentFont,
        size: segmentSize,
      });

      doc.link(x0, y, width, segmentSize * 1.3, seg.url);
    }
  }

  doc.x = M_LEFT;
  doc.y = y + estimatedHeight;
}

/**
 * Inline label and value with distinct typography.
 */
function labelledLine(label, value, options = {}) {
  const {
    size = SIZE.skill,
    labelColor = COLOR.name,
    valueColor = COLOR.body,
  } = options;

  const labelText = label;
  const valueText = value;

  const labelWidth = doc
    .font(BODY_BOLD)
    .fontSize(size)
    .widthOfString(labelText);

  const valueWidth = CONTENT_W - labelWidth;

  const labelHeight = doc.heightOfString(labelText, {
    width: CONTENT_W,
    font: BODY_BOLD,
    fontSize: size,
    lineGap: 0,
  });

  const valueHeight = doc.heightOfString(valueText, {
    width: valueWidth,
    font: BODY,
    fontSize: size,
    lineGap: GAP.tight,
  });

  ensureSpace(Math.max(labelHeight, valueHeight) + GAP.afterBullet);

  resetX();

  doc.font(BODY_BOLD).fontSize(size).fillColor(labelColor);

  doc.text(labelText, {
    width: CONTENT_W,
    continued: true,
    lineGap: 0,
  });

  doc.font(BODY).fontSize(size).fillColor(valueColor);

  doc.text(valueText, {
    width: CONTENT_W,
    continued: false,
    lineGap: GAP.tight,
  });

  doc.x = M_LEFT;
  doc.y += GAP.afterBullet;
}

/* ------------------------------------------------------------ page chrome */

function drawPageAccent() {
  doc
    .save()
    .rect(0, 0, PAGE_W, 5)
    .fill(COLOR.accentSoft)
    .rect(0, 0, PAGE_W * 0.28, 5)
    .fill(COLOR.accent)
    .restore();
}

doc.on("pageAdded", () => {
  drawPageAccent();

  resetX();
  doc.y = CONTENT_TOP;
});

/* ------------------------------------------------------------------ header */

drawPageAccent();

doc.y = 42;

resetX();

doc.font(HEAD_BOLD).fontSize(SIZE.name).fillColor(COLOR.name);

doc.text(cv.contact.name.toUpperCase(), {
  width: CONTENT_W,
  characterSpacing: 0.5,
  lineGap: 0,
});

doc.y += 3;

resetX();

doc.font(HEAD_BOLD).fontSize(SIZE.headline).fillColor(COLOR.accent);

doc.text(cv.contact.headline, {
  width: CONTENT_W,
  lineGap: 0,
});

doc.y += 3;

resetX();

doc.font(BODY).fontSize(12).fillColor(COLOR.muted);

doc.text(cv.contact.tagline, {
  width: CONTENT_W,
  lineGap: 0,
});

doc.y += 9;

rule(COLOR.accent, 1.2);

doc.y += 8;

/* ----------------------------------------------------------- contact details */

// Contact row 1: readable, plain-text contact information.

segmentLine(
  [
    {
      text: cv.contact.email,
      color: COLOR.ink,
    },
    {
      text: "   |   ",
      color: COLOR.rule,
    },
    {
      text: cv.contact.phone,
      color: COLOR.ink,
    },
    {
      text: "   |   ",
      color: COLOR.rule,
    },
    {
      text: cv.contact.location,
      color: COLOR.ink,
    },
  ],
  {
    size: SIZE.skill,
    lineGap: 3,
  },
);

// Contact row 2: clickable profile links.

segmentLine(
  cv.contact.links.flatMap((link, index) => {
    const segments = [];

    if (index > 0) {
      segments.push({
        text: "   |   ",
        color: COLOR.rule,
      });
    }

    segments.push({
      text: `${link.label}: `,
      font: BODY_BOLD,
      color: COLOR.name,
    });

    segments.push({
      text: link.value,
      color: COLOR.accent,
      url: link.url,
    });

    return segments;
  }),
  {
    size: SIZE.skill,
    lineGap: 0,
  },
);

/* ----------------------------------------------------------------- summary */

sectionTitle("Professional Summary");

paragraph(cv.summary);

/* ------------------------------------------------------------------ skills */

sectionTitle("Technical Skills");

for (const group of cv.skills) {
  labelledLine(`${group.label}: `, group.items);
}

/* --------------------------------------------------------------- experience */

sectionTitle("Professional Experience");

for (const job of cv.experience) {
  entryTitle(`${job.role}, ${job.company}`, job.meta);

  for (const item of job.bullets) {
    bullet(item);
  }

  doc.y += GAP.afterEntry;
}

/* ---------------------------------------------------------------- projects */

// Intentionally disabled. Keep this section commented out.

/*
sectionTitle("Selected Projects");

for (const project of cv.projects) {
  entryTitle(project.name, project.meta);

  for (const item of project.bullets) {
    bullet(item);
  }

  resetX();

  doc
    .font(BODY)
    .fontSize(SIZE.meta)
    .fillColor(COLOR.accent);

  doc.text(project.link.label, {
    width: CONTENT_W,
    link: project.link.url,
    lineGap: 0,
  });

  doc.y += GAP.afterEntry;
}
*/

/* --------------------------------------------------------------- education */

sectionTitle("Education");

entryTitle(`${cv.education.degree}, ${cv.education.school}`, cv.education.meta);

paragraph(cv.education.details);

/* --------------------------------------------------------------- leadership */

/* --------------------------------------------------------------- leadership */

if (cv.leadership.length > 0) {
  sectionTitle("Leadership & Achievements", 55);

  for (const item of cv.leadership) {
    bullet([
      {
        text: `${item.title} — ${item.org} `,
        font: BODY_BOLD,
        color: COLOR.ink,
      },
      {
        text: `(${item.year}) `,
        color: COLOR.muted,
      },
      {
        text: item.text,
        color: COLOR.body,
      },
    ]);
  }
}

/* ---------------------------------------------------------------- languages */

sectionTitle("Languages");

segmentLine(
  cv.languages.flatMap((lang, index) => {
    const segments = [];

    if (index > 0) {
      segments.push({
        text: "   |   ",
        color: COLOR.rule,
      });
    }

    segments.push({
      text: `${lang.name} `,
      font: BODY_BOLD,
      color: COLOR.ink,
    });

    segments.push({
      text: `(${lang.level})`,
      color: COLOR.body,
    });

    return segments;
  }),
  {
    size: SIZE.skill,
    lineGap: 0,
  },
);

/* ------------------------------------------------------------------ footer */

function drawFooters() {
  const range = doc.bufferedPageRange();
  const total = range.count;

  for (let i = range.start; i < range.start + total; i++) {
    doc.switchToPage(i);

    const y = PAGE_H - 34;

    doc
      .save()
      .moveTo(M_LEFT, y - 9)
      .lineTo(M_LEFT + CONTENT_W, y - 9)
      .lineWidth(0.5)
      .strokeColor(COLOR.rule)
      .stroke()
      .restore();

    doc.font(BODY).fontSize(SIZE.footer).fillColor(COLOR.muted);

    const footerParts = [cv.contact.name, "Front-End Engineer"];

    // Prefer the LinkedIn link when present, without relying on array index.
    const linkedIn = cv.contact.links.find((link) =>
      /linkedin/i.test(`${link.label} ${link.value}`),
    );

    if (linkedIn) {
      footerParts.push(linkedIn.value);
    }

    doc.text(footerParts.join("   |   "), M_LEFT, y, {
      width: CONTENT_W,
      lineBreak: false,
    });
  }

  doc.switchToPage(range.start + range.count - 1);
}

/* ------------------------------------------------------------------- write */
fs.mkdirSync(path.dirname(OUT_FILE), {
  recursive: true,
});

const stream = fs.createWriteStream(OUT_FILE);

stream.on("error", (error) => {
  console.error("Failed to generate CV:", error);
  process.exitCode = 1;
});

stream.on("finish", () => {
  console.log(`CV written: ${path.relative(ROOT, OUT_FILE)}`);
  console.log(`Pages: ${doc.bufferedPageRange().count}`);
  console.log("Fonts:", usedFonts);
});

doc.pipe(stream);

// drawFooters();

doc.end();
