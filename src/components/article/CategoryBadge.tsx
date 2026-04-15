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
  const label = getCategoryLabel(category, lang);

  if (linked) {
    return (
      <Link href={`/${lang}/category/${category}`} className="cat-label hover:underline">
        {label}
      </Link>
    );
  }

  return <span className="cat-label">{label}</span>;
}
