import type { Dictionary } from "@/config/i18n";

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{dict.footer.copyright}</p>
          <p>{dict.footer.poweredBy}</p>
        </div>
      </div>
    </footer>
  );
}
