type GreetingCard = {
  direction: "ltr" | "rtl";
  background: string;
  accent: string;
  heading: string;
  title: string;
  portrait: HTMLCanvasElement | null;
  stickers: string[];
  recipient: string;
  message: string;
  seal: string;
};

function drawWrappedMessage(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  offset: number,
) {
  const lines: string[] = [];
  let line = "";

  for (const word of text.trim().split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  const lineHeight = Math.min(34, 128 / Math.max(1, lines.length));
  lines.forEach((messageLine, index) => {
    ctx.fillText(messageLine, 384, 296 + offset + index * lineHeight, maxWidth);
  });
}

export function renderGreetingCard(card: GreetingCard) {
  const canvas = document.createElement("canvas");
  const portrait = card.portrait;
  const portraitSpace = portrait?.width && portrait.height ? 430 : 0;
  canvas.width = 768;
  canvas.height = 530 + portraitSpace;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Card canvas is unavailable");

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, card.background);
  gradient.addColorStop(1, "#fff9fb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = card.accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(22, 22, 724, canvas.height - 44);
  ctx.textAlign = "center";
  ctx.direction = card.direction;

  ctx.fillStyle = "#6a3851";
  const font = card.direction === "rtl" ? "Tajawal, sans-serif" : "Nunito, sans-serif";
  ctx.font = `700 24px ${font}`;
  ctx.fillText(card.heading, 384, 76, 640);
  ctx.fillStyle = "#321d28";
  ctx.font = `700 40px ${font}`;
  ctx.fillText(card.title, 384, 138, 640);

  if (portrait && portraitSpace) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.fillRect(64, 168, 640, 400);
    const scale = Math.min(640 / portrait.width, 400 / portrait.height);
    const width = portrait.width * scale;
    const height = portrait.height * scale;
    ctx.drawImage(portrait, (768 - width) / 2, 168 + (400 - height) / 2, width, height);
  }

  ctx.fillStyle = "#321d28";
  ctx.font = "36px system-ui, sans-serif";
  ctx.fillText(card.stickers.join("  "), 384, 192 + portraitSpace, 640);
  ctx.font = `700 28px ${font}`;
  ctx.fillText(card.recipient, 384, 250 + portraitSpace, 640);
  ctx.font = `500 24px ${font}`;
  drawWrappedMessage(ctx, card.message, 640, portraitSpace);
  ctx.fillStyle = "#6a3851";
  ctx.font = `700 20px ${font}`;
  ctx.fillText(card.seal, 384, canvas.height - 54, 640);

  return canvas.toDataURL("image/png");
}
