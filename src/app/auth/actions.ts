"use server";

import { loginWithEmail, signupWithEmail } from "@/features/auth/services/auth-actions";
import type { AuthCredentials } from "@/features/auth/types/auth";

export async function loginMutationAction(input: AuthCredentials) {
  return loginWithEmail(input);
}

export async function signupMutationAction(input: AuthCredentials) {
  return signupWithEmail(input);
}
