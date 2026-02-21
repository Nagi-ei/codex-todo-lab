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
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
};
