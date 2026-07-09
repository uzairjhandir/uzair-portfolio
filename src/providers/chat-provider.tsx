"use client";

import Script from "next/script";
export function ChatProvider() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const provider = process.env.NEXT_PUBLIC_CHAT_PROVIDER?.toLowerCase();

  // Load Tawk.to
  if (provider === "tawk") {
    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

    if (!propertyId || !widgetId) return null;

    return (
      <Script id="tawk-script" strategy="lazyOnload">
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/${propertyId}/${widgetId}';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
        `}
      </Script>
    );
  }

  // Load Crisp
  if (provider === "crisp") {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

    if (!websiteId) return null;

    return (
      <Script id="crisp-script" strategy="lazyOnload">
        {`
          window.$crisp=[];
          window.CRISP_WEBSITE_ID="${websiteId}";
          (function(){
            var d=document;
            var s=d.createElement("script");
            s.src="https://client.crisp.chat/l.js";
            s.async=1;
            d.getElementsByTagName("head")[0].appendChild(s);
          })();
        `}
      </Script>
    );
  }

  return null;
}
