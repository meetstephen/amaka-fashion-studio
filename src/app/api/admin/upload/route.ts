import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";

function getAdminClient() {
  // Reads VITE_SUPABASE_URL (your existing Vercel var name)
  // falls back to NEXT_PUBLIC_SUPABASE_URL if you ever rename it
  const url =
    process.env.VITE_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "Missing environment variable: VITE_SUPABASE_URL. " +
        "Add it in Vercel → Settings → Environment Variables."
    );
  }
  if (!key) {
    throw new Error(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY. " +
        "Add it in Vercel → Settings → Environment Variables."
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  // 1. Verify the admin session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.SESSION_SECRET ?? "default-dev-secret";
  const isValid = await verifySessionToken(session.value, secret);

  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse the multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not parse request body as form data." },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "uploads";

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // 3. Validate type and size
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        error: `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP, GIF, SVG.`,
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum allowed size is 10 MB." },
      { status: 400 }
    );
  }

  // 4. Upload using the service-role client — bypasses ALL RLS policies
  try {
    const supabase = getAdminClient();

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const storagePath = `${folder}/${uid}.${ext}`;

    const bytes = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from("images")
      .upload(storagePath, Buffer.from(bytes), {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("[/api/admin/upload] Supabase error:", error);
      return NextResponse.json(
        { error: `Supabase upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      path: data.path,
      url: urlData.publicUrl,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/admin/upload] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
