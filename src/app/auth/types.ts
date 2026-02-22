export type AuthErrorCode =
  | "missing_credentials"
  | "invalid_credentials"
  | "email_not_confirmed"
  | "signup_failed"
  | "unknown";

export type AuthActionCode = "ok" | AuthErrorCode;

export type AuthActionResult =
  | {
      ok: true;
      code: "ok";
      next: "/todos" | "/auth/check-email";
    }
  | {
      ok: false;
      code: AuthErrorCode;
      message: string;
      response_status: number | null;
      debug_reason?: string;
    };

export type AuthCredentials = {
  email: string;
  password: string;
};

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
