"use server";

import type { AuthCredentials } from "@/features/auth/types/auth";
import { loginWithEmail } from "@/features/auth/services/auth-actions";

export async function loginMutationAction(input: AuthCredentials) {
  return loginWithEmail(input);
}
