import type { AdPosition } from "@/lib/ads";
import { getActiveBanners } from "@/lib/ads";

export async function AdSlot({ position }: { position: AdPosition }) {
  let banners;
  try {
    banners = await getActiveBanners(position);
  } catch {
    return null;
  }
  if (!banners || banners.length === 0) return null;

  // Full-width horizontal banners
  if (
    position === "header-top" ||
    position === "between-articles" ||
    position === "article-top" ||
    position === "article-bottom" ||
    position === "footer-above"
  ) {
    const isHeader = position === "header-top";
    const isFooter = position === "footer-above";
    return (
      <div
        className={`${isHeader ? "bg-muted border-b border-border" : ""} ${isFooter ? "border-t border-border bg-muted" : ""}`}
      >
        <div
          className={`max-w-[1200px] mx-auto px-4 ${isHeader || isFooter ? "py-2" : "py-4"} flex justify-center gap-2`}
        >
          {banners.map((b) => (
            <a
              key={b.id}
              href={b.linkUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block"
            >
              <img
                src={b.imageUrl}
                alt={b.altText}
                className="max-h-[90px] md:max-h-[120px] w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Sidebar (vertical stack)
  if (position === "sidebar") {
    return (
      <div className="space-y-4">
        {banners.map((b) => (
          <a
            key={b.id}
            href={b.linkUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block border border-border overflow-hidden"
          >
            <img
              src={b.imageUrl}
              alt={b.altText}
              className="w-full h-auto object-contain"
            />
          </a>
        ))}
      </div>
    );
  }

  return null;
}
