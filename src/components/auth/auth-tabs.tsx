"use client";

import { Tabs } from "@/components/ui/tabs";

type AuthTabsProps = {
  loginContent: React.ReactNode;
  signupContent: React.ReactNode;
};

export function AuthTabs({ loginContent, signupContent }: AuthTabsProps) {
  return (
    <Tabs defaultValue="login">
      <Tabs.List>
        <Tabs.Trigger value="login">로그인</Tabs.Trigger>
        <Tabs.Trigger value="signup">회원가입</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="login">{loginContent}</Tabs.Content>
      <Tabs.Content value="signup">{signupContent}</Tabs.Content>
    </Tabs>
  );
}
