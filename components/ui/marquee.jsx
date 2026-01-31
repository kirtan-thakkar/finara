import { cn } from "@/lib/utils"

export function Marquee({
  children,
  direction = "left",
  repeat = 4,
  duration = 60,
  className,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn("group flex [gap:var(--gap)] overflow-hidden [--gap:1rem]", className)}
      style={{
        "--duration": `${duration}s`
      }}>
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee-left": direction === "left",
              "animate-marquee-right": direction === "right",
              "group-hover:[animation-play-state:paused]": true,
            })}>
            {children}
          </div>
        ))}
    </div>
  );
}
