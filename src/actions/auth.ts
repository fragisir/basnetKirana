"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const VALID_PIN = process.env.APP_PIN || "1234";

export async function login(pin: string) {
  if (pin === VALID_PIN) {
    (await cookies()).set("auth-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid PIN" };
}

export async function logout() {
  (await cookies()).delete("auth-session");
  redirect("/login");
}
