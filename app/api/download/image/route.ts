import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const filename = request.nextUrl.searchParams.get("filename") ?? "nominee.jpg";

  if (!url) return new Response("Missing url param", { status: 400 });

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    return new Response("Failed to fetch image", { status: 502 });
  }

  if (!res.ok) return new Response("Image not found", { status: 502 });

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buffer = await res.arrayBuffer();
  const safeFilename = filename.replace(/[^\w\s.-]/g, "_");

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
