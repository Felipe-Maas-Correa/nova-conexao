const BASE = "/api";

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export const api = {
  getPlans: () => request("/plans"),
  getCoverage: () => request("/coverage"),
  getTestimonials: () => request("/testimonials"),
  getContactInfo: () => request("/contact-info"),
  sendSupport: (payload) =>
    request("/support", { method: "POST", body: JSON.stringify(payload) })
};
