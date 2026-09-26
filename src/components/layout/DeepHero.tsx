import Link from "next/link";
import { HeroParallax } from "./HeroParallax";

export type HeroStat = {
  value: string;
  unit?: string;
  word?: boolean; // 숫자가 아닌 한글 낱말(예: 응모 중)
  eyebrow?: string;
  label: string;
  strong?: string;
  href?: string;
};

export function DeepHero({
  image,
  kicker,
  displayTop,
  displayEm,
  name,
  nameAs = "h1",
  lead,
  primary,
  secondary,
  stats = [],
  credit,
  scrollCue = true,
}: {
  image?: string | null;
  kicker: string;
  displayTop: string;
  displayEm: string;
  name: string;
  nameAs?: "h1" | "p";
  lead?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  stats?: HeroStat[];
  credit?: string;
  scrollCue?: boolean;
}) {
  const Name = nameAs;
  return (
    <section className="deep-hero bleed -mt-8">
      {image && (
        <HeroParallax>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" fetchPriority="high" />
        </HeroParallax>
      )}
      <div className="mag-container deep-hero__in">
        <div className="rise">
          <span className="deep-hero__kicker">{kicker}</span>
          <p className="deep-hero__display" aria-hidden>
            {displayTop}
            <em>{displayEm}</em>
          </p>
          <div className="deep-hero__name">
            <Name>{name}</Name>
          </div>
          {lead && <p className="deep-hero__lead">{lead}</p>}
          {(primary || secondary) && (
            <div className="deep-hero__cta">
              {primary && <Link href={primary.href} className="btn btn-gold">{primary.label}</Link>}
              {secondary && <Link href={secondary.href} className="btn btn-deep-ghost">{secondary.label}</Link>}
            </div>
          )}
        </div>

        {stats.length > 0 && (
          <div className="deep-stack rise rise-3">
            <div className="deep-stack__in">
              {stats.map((s, i) => {
                const body = (
                  <>
                    <span className={`deep-stat__v ${s.word ? "deep-stat__v--word" : ""}`}>
                      {s.value}
                      {s.unit && <small>{s.unit}</small>}
                    </span>
                    <span className="deep-stat__k">
                      {s.eyebrow && <span>{s.eyebrow}</span>}
                      {s.strong ? <b>{s.strong}</b> : null}
                      <small className="deep-stat__l">{s.label}</small>
                    </span>
                  </>
                );
                return s.href ? (
                  <Link key={i} href={s.href} className="deep-stat">{body}</Link>
                ) : (
                  <div key={i} className="deep-stat">{body}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {scrollCue && (
        <div className="deep-cue" aria-hidden>
          SCROLL
          <i />
        </div>
      )}
      {credit && <p className="deep-credit">{credit}</p>}
    </section>
  );
}
