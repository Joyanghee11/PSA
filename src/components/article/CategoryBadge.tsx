import Link from "next/link";
import type { Category, Lang } from "@/lib/types";
import { getCategoryLabel, getCategoryColor } from "@/lib/utils";

export function CategoryBadge({
  category,
  lang,
  linked = true,
}: {
  category: Category;
  lang: Lang;
  linked?: boolean;
}) {
  const className = `inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(category)}`;

  if (linked) {
    return (
      <Link href={`/${lang}/category/${category}`} className={className}>
        {getCategoryLabel(category, lang)}
      </Link>
    );
  }

  return <span className={className}>{getCategoryLabel(category, lang)}</span>;
}
