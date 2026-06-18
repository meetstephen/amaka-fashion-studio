import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg","image/jpg","image/png","image/webp","image/gif","image/svg+xml"];
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized: no admin session. Please log in." }, { status: 401 });
    }
    const secret = process.env.SESSION_SECRET ?? "default-dev-secret";
    const isValid = await verifySessionToken(sessionCookie.value, secret);
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized: session expired. Please log in again." }, { status: 401 });
    }
    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    if (!supabaseUrl || !serviceRoleKey) {
      const missing = [...(!supabaseUrl ? ["VITE_SUPABASE_URL"] : []), ...(!serviceRoleKey ? ["SUPABASE_SERVICE_ROLE_KEY"] : [])];
      return NextResponse.json({ error: "Server configuration error. Missing: " + missing.join(", ") }, { status: 500 });
    }

    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Could not read the uploaded file. Please try again." }, { status: 400 });
    }

    const fileEntry = formData.get("file");
    const folderEntry = formData.get("folder");
    const folder = typeof folderEntry === "string" && folderEntry.length > 0 ? folderEntry : "uploads";

    if (!(fileEntry instanceof File) || fileEntry.size === 0) {
      return NextResponse.json({ error: "No file received. Please choose a file and try again." }, { status: 400 });
    }
    const file = fileEntry;
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed: " + file.type }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File is " + (file.size / 1024 / 1024).toFixed(1) + " MB. Maximum is 10 MB." }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const uid = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    const storagePath = folder + "/" + uid + "." + ext;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(storagePath, fileBuffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: "Supabase upload failed: " + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("images").getPublicUrl(uploadData.path);
    return NextResponse.json({ success: true, path: uploadData.path, url: urlData.publicUrl, name: file.name });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
