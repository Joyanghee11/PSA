import Link from "next/link";
import type { Artwork } from "@/lib/community";
import { publicUrl, formatKrw, formatSize } from "@/lib/community";

export function ArtworkCard({ art, lang, priority = false }: { art: Artwork; lang: "ko" | "en"; priority?: boolean }) {
  const cover = publicUrl("artworks", art.images[0]);
  const size = formatSize(art);
  return (
    <Link href={`/${lang}/gallery/${art.id}`} className="group block">
      <div className="frame transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:[box-shadow:var(--shadow-3)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {cover && <img src={cover} alt={art.title} loading={priority ? "eager" : "lazy"} className="w-full h-auto block" />}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-subheadline text-[17px] text-headline truncate group-hover:text-accent transition-colors">{art.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {art.artist_name}
            {art.year ? ` · ${art.year}` : ""}
          </p>
          {size && <p className="text-xs text-muted-foreground mt-0.5">{[art.medium, size].filter(Boolean).join(" · ")}</p>}
        </div>
        <div className="text-right shrink-0">
          {art.status === "sold" ? (
            <span className="chip chip-sold">{lang === "ko" ? "판매 완료" : "Sold"}</span>
          ) : (
            <span className="text-sm font-semibold text-headline">{formatKrw(art.price_krw, lang)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
