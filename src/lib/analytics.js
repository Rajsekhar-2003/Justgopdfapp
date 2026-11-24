import { GA_ID } from '../config/site.js';

let ready = false;
/** Loads GA4 only when VITE_GA_ID is set. Never send file names or contents. */
export function initAnalytics() {
  if (!GA_ID || ready) return;
  ready = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);
}
export function trackPageView(path) {
  if (GA_ID && window.gtag) window.gtag('event', 'page_view', { page_path: path });
}
