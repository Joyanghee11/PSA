import { getActiveBanners } from "@/lib/ads";

export async function StickyBanners() {
  let leftBanners, rightBanners;
  try {
    leftBanners = await getActiveBanners("sticky-left");
    rightBanners = await getActiveBanners("sticky-right");
  } catch {
    return null;
  }

  if (leftBanners.length === 0 && rightBanners.length === 0) return null;

  return (
    <>
      {/* 좌측 세로 배너 */}
      {leftBanners.length > 0 && (
        <div className="hidden xl:block fixed left-0 top-1/2 -translate-y-1/2 z-40" style={{ left: "max(0px, calc((100vw - 1200px) / 2 - 170px))" }}>
          <div className="space-y-2">
            {leftBanners.map((b) => (
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
                  className="w-[160px] h-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 우측 세로 배너 */}
      {rightBanners.length > 0 && (
        <div className="hidden xl:block fixed right-0 top-1/2 -translate-y-1/2 z-40" style={{ right: "max(0px, calc((100vw - 1200px) / 2 - 170px))" }}>
          <div className="space-y-2">
            {rightBanners.map((b) => (
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
                  className="w-[160px] h-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
