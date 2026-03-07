export function getTodoReadErrorMessage(providerMessage: string | null): string | null {
  if (!providerMessage) {
    return null;
  }

  if (providerMessage.includes("Could not find the table 'public.todos'")) {
    return "할 일 테이블을 찾을 수 없습니다. Supabase migration 적용 상태를 확인해 주세요.";
  }

  return "할 일 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
}
