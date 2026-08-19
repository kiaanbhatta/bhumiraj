import * as LucideIcons from "lucide-react";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function SmartImage({
  src,
  alt,
  className,
  fallbackClassName,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-secondary text-muted-foreground",
          className,
          fallbackClassName,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="size-8 opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

type IconName = keyof typeof LucideIcons;

export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons[name as IconName] ?? LucideIcons.Sparkles) as LucideIcons.LucideIcon;
  return <Icon className={className} />;
}
