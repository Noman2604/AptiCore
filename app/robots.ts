import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.APP_URL ? process.env.APP_URL : "https://apticore.in")

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/super-admin/", "/dashboard/profile/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
