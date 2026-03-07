import type { AuthActionResult } from "@/features/auth/types/auth";

export function buildAuthErrorToastKey(
  state: Extract<AuthActionResult, { ok: false }>,
): string {
  return `${state.code}:${state.response_status ?? "none"}:${state.message}`;
}

export function formatLearningAuthErrorToast(
  state: Extract<AuthActionResult, { ok: false }>,
): string {
  const responseStatusLabel =
    state.response_status === null || state.response_status === undefined
      ? "unknown"
      : String(state.response_status);
  const appCodeLabel = state.code ?? "unknown";
  const debugReasonLabel = state.debug_reason ?? "n/a";

  return `${state.message} | app_code: ${appCodeLabel} | response_status: ${responseStatusLabel} | server_response: ${debugReasonLabel}`;
}
