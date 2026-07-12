"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTestEmailConnectionMutation, useTestEmailSendMutation } from "@/lib/query/settings/mutations";

export function SmtpTestPanel() {
  const [testEmail, setTestEmail] = useState("");
  const testConnection = useTestEmailConnectionMutation();
  const testSend = useTestEmailSendMutation();

  const handleTestConnection = () => {
    testConnection.mutate(undefined, {
      onSuccess: (result) => (result.success ? toast.success(result.message) : toast.error(result.message)),
      onError: () => toast.error("Connection test failed."),
    });
  };

  const handleTestSend = () => {
    if (!testEmail) return;
    testSend.mutate(testEmail, {
      onSuccess: (result) => (result.success ? toast.success(result.message) : toast.error(result.message)),
      onError: () => toast.error("Failed to send test email."),
    });
  };

  return (
    <div className="border-t pt-6 space-y-4">
      <h3 className="text-sm font-semibold">SMTP Diagnostics</h3>
      <p className="text-xs text-muted-foreground">
        Tests use the currently saved SMTP settings above. Save changes first if you just edited them.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={handleTestConnection} disabled={testConnection.isPending}>
          {testConnection.isPending ? "Testing..." : "Test Connection"}
        </Button>
        <div className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="w-64"
          />
          <Button type="button" variant="outline" onClick={handleTestSend} disabled={testSend.isPending || !testEmail}>
            {testSend.isPending ? "Sending..." : "Send Test Email"}
          </Button>
        </div>
      </div>
    </div>
  );
}
