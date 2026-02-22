export type AuthErrorCode =
  | "missing_credentials"
  | "invalid_credentials"
  | "email_not_confirmed"
  | "signup_failed"
  | "unknown";

export type AuthActionState = {
  status: "idle" | "error";
  code?: AuthErrorCode;
  message?: string;
  debug_reason?: string;
  response_status?: number | null;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
};
