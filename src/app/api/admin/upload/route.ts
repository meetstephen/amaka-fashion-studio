import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

// Force Node.js runtime so Buffer and cookies() both work
export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    // ── 1. Verify the admin session cookie ──────────────────────────────
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "Unauthorized: No admin session found. Please log in." },
        { status: 401 }
      );
    }

    const secret = process.env.SESSION_SECRET ?? "default-dev-secret";
    const isValid = await verifySessionToken(sessionCookie.value, secret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized: Session is invalid or expired. Please log in again." },
        { status: 401 }
      );
    }

    // ── 2. Read Supabase environment variables ───────────────────────────
    // Reads VITE_SUPABASE_URL first (your current Vercel setup),
    // then falls back to NEXT_PUBLIC_SUPABASE_URL if you ever rename it.
    const supabaseUrl =
      process.env.VITE_SUPABASE_URL ??
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "";

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      const missing: string[] = [];
      if (!supabaseUrl) missing.push("VITE_SUPABASE_URL");
      if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json(
        {
          error:
            `Server configuration error. The following environment variables are missing in Vercel: ${missing.join(", ")}. ` +
            "Go to Vercel → your project → Settings → Environment Variables and add them.",
        },
        { status: 500 }
      );
    }

    // ── 3. Parse the uploaded file from multipart form data ─────────────
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Could not read the uploaded file. Please try again." },
        { status: 400 }
      );
    }

    const fileEntry = formData.get("file");
    const folderEntry = formData.get("folder");
    const folder = typeof folderEntry === "string" ? folderEntry : "uploads";

    // Type-safe file check — formData.get() can return string | File | null
    if (!(fileEntry instanceof File) || fileEntry.size === 0) {
      return NextResponse.json(
        { error: "No file was received. Please choose a file and try again." },
        { status: 400 }
      );
    }

    const file: File = fileEntry;

    // ── 4. Validate the file type ────────────────────────────────────────
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `"${file.type}" is not an allowed file type. Please upload a JPEG, PNG, WebP, GIF, or SVG image.`,
        },
        { status: 400 }
      );
    }

    // ── 5. Validate the file size ────────────────────────────────────────
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      return NextResponse.json(
        { error: `File is ${sizeMB} MB. The maximum allowed size is 10 MB.` },
        { status: 400 }
      );
    }

    // ── 6. Upload to Supabase Storage using the service role key ─────────
    //
    // WHY service role key?
    // The service role key bypasses ALL Row Level Security (RLS) policies in
    // Supabase.  It is safe here because:
    //   a) We verified the admin session above.
    //   b) This key is stored only in Vercel env vars — never in the browser.
    //   c) This is a server-side API route — it is never sent to the client.
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Build a unique file path: folder/timestamp-randomstring.ext
    const fileExtension =
      file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const uniquePart = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const storagePath = `${folder}/${uniquePart}.${fileExtension}`;

    // Convert the File (Web API) to a Buffer (Node.js) for Supabase SDK
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false, // fail if file already exists (path is unique, so this is fine)
      });

    if (uploadError) {
      console.error("[/api/admin/upload] Supabase error:", uploadError);
      return NextResponse.json(
        { error: `Supabase upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // ── 7. Get the public CDN URL and return it ──────────────────────────
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      success: true,
      path: uploadData.path,
      url: publicUrlData.publicUrl,
      name: file.name,
    });
  } catch (err: unknown) {
    // Catch-all for any unhandled error
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[/api/admin/upload] Unhandled error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
