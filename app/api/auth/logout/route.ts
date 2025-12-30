import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("session");
  cookies().delete("phone");

  return Response.redirect(new URL("/", "http://localhost:3000"));
}