"use server";

import type { AuthCredentials } from "@/features/auth/types/auth";
import { signupWithEmail } from "@/features/auth/services/auth-actions";

export async function signupMutationAction(input: AuthCredentials) {
  return signupWithEmail(input);
}
