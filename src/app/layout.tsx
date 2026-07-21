import type { Metadata } from "next";
import type { ReactNode, CSSProperties } from "react";
import { getSettings } from "@/lib/data";
import { hexToRgbChannels } from "@/lib/utils";
import { CartProvider } from "@/context/cart";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NOIR — متجر الفخامة",
  description:
    "متجر إلكتروني فاخر لبيع أرقى المنتجات: ساعات، سماعات، عطور، أحذية وحقائب.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const s = await getSettings();
  const accentRgb = hexToRgbChannels(s.accentColor);
  const themeVars = {
    "--accent": s.accentColor,
    "--accent-rgb": accentRgb,
  } as unknown as CSSProperties;

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Facebook Pixel */}
        {s.facebookPixel && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.facebookPixel}');fbq('track','PageView');`,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${s.facebookPixel}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {/* TikTok Pixel */}
        {s.tiktokPixel && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${s.tiktokPixel}');ttq.page();}(window,document,'ttq');`,
            }}
          />
        )}
      </head>
      <body style={themeVars} className="font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
