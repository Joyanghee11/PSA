import type { AdPosition } from "@/lib/ads";
import { getActiveBanners } from "@/lib/ads";

export async function AdSlot({ position }: { position: AdPosition }) {
  const banners = await getActiveBanners(position);
  if (banners.length === 0) return null;

  if (position === "header-top") {
    return (
      <div className="bg-muted border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 py-1.5 flex justify-center">
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
                className="max-h-[90px] w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    );
  }

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

  // between-articles
  return (
    <div className="py-4 flex justify-center">
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
  );
}
