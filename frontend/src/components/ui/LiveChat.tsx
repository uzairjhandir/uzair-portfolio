"use client";

import { useEffect } from "react";
import { useLiveChatConfigQuery } from "@/lib/query/livechat/queries";

export function LiveChat() {
  const { data: config } = useLiveChatConfigQuery();

  useEffect(() => {
    if (!config?.enabled) return;

    if (config.provider === 'tawk.to' && config.propertyId && config.widgetId) {
      // Initialize tawk.to
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = `https://embed.tawk.to/${config.propertyId}/${config.widgetId}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode?.insertBefore(s1, s0);
    }

    if (config.provider === 'crisp' && config.websiteId) {
      // Initialize crisp
      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = config.websiteId;
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    }
  }, [config]);

  return null;
}
