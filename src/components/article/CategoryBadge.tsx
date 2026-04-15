import Link from "next/link";
import type { Category, Lang } from "@/lib/types";
import { getCategoryLabel } from "@/lib/utils";

export function CategoryBadge({
  category,
  lang,
  linked = true,
}: {
  category: Category;
  lang: Lang;
  linked?: boolean;
}) {
  const className =
    "section-label";

  const label = getCategoryLabel(category, lang);

  if (linked) {
    return (
      <Link href={`/${lang}/category/${category}`} className={className}>
        {label}
      </Link>
    );
  }

  return <span className={className}>{label}</span>;
}
