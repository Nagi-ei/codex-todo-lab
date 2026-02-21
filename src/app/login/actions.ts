"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  return { email, password };
}

export async function loginAction(formData: FormData) {
  const { email, password } = readCredentials(formData);

  if (!email || !password) {
    redirect("/login?error=missing_credentials");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=login_failed");
  }

  redirect("/todos");
}

export async function signupAction(formData: FormData) {
  const { email, password } = readCredentials(formData);

  if (!email || !password) {
    redirect("/login?error=missing_credentials");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect("/login?error=signup_failed");
  }

  redirect("/todos");
}
