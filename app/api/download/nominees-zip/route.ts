import { NextRequest } from "next/server";
import JSZip from "jszip";
import { validateImageUrl } from "../_validate-url";

interface NomineeEntry {
  url: string;
  filename: string;
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return new Response("Invalid request body", { status: 400 });
  }

  const { nominees, categoryName } = body as Record<string, unknown>;

  if (typeof categoryName !== "string" || categoryName.trim() === "") {
    return new Response("categoryName must be a non-empty string", { status: 400 });
  }

  if (!Array.isArray(nominees) || nominees.length === 0) {
    return new Response("No nominees provided", { status: 400 });
  }

  const valid = nominees.filter((n) => {
    try {
      validateImageUrl(n.url);
      return true;
    } catch {
      return false;
    }
  });

  const safeCategoryName = categoryName.replace(/[^\w\s-]/g, "_");

  const zip = new JSZip();
  const folder = zip.folder(safeCategoryName) ?? zip;
  let added = 0;

  await Promise.allSettled(
    valid.map(async ({ url, filename }) => {
      const res = await fetch(url);
      if (!res.ok) return;
      const buffer = await res.arrayBuffer();
      const safeFilename = filename.replace(/[^\w\s.-]/g, "_");
      folder.file(safeFilename, buffer);
      added++;
    }),
  );

  if (added === 0) {
    return new Response("All image downloads failed", { status: 502 });
  }

  const content = await zip.generateAsync({ type: "arraybuffer" });
  const failed = valid.length - added;

  return new Response(content, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeCategoryName}-nominees.zip"`,
      ...(failed > 0 && { "X-Failed-Count": String(failed) }),
    },
  });
}
