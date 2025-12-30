import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase ID token
    const decoded = await adminAuth.verifyIdToken(token);

    // Store session cookie
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Optional: store phone number separately
    cookies().set("phone", decoded.phone_number || "", {
      httpOnly: false, // readable if needed
      path: "/",
    });

    return Response.json({
      success: true,
      uid: decoded.uid,
      phone: decoded.phone_number,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}