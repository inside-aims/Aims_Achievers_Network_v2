import { NextRequest } from "next/server";
import JSZip from "jszip";

interface NomineeEntry {
  url: string;
  filename: string;
}

export async function POST(request: NextRequest) {
  const { nominees, categoryName }: { nominees: NomineeEntry[]; categoryName: string } =
    await request.json();

  if (!Array.isArray(nominees) || nominees.length === 0) {
    return new Response("No nominees provided", { status: 400 });
  }

  const zip = new JSZip();
  const folder = zip.folder(categoryName) ?? zip;

  await Promise.allSettled(
    nominees
      .filter((n) => n.url)
      .map(async ({ url, filename }) => {
        const res = await fetch(url);
        if (!res.ok) return;
        const buffer = await res.arrayBuffer();
        const safeFilename = filename.replace(/[^\w\s.-]/g, "_");
        folder.file(safeFilename, buffer);
      }),
  );

  const content = await zip.generateAsync({ type: "arraybuffer" });
  const safeCategoryName = categoryName.replace(/[^\w\s-]/g, "_");

  return new Response(content, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeCategoryName}-nominees.zip"`,
    },
  });
}
