interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  markOnly?: boolean;
}

const sizes = {
  sm: { iconWidth: 26, iconHeight: 20, fontSize: 20, gap: 9 },
  md: { iconWidth: 32, iconHeight: 24, fontSize: 22, gap: 10 },
  lg: { iconWidth: 40, iconHeight: 30, fontSize: 28, gap: 12 },
};

export default function BrandLogo({
  size = "md",
  dark = false,
  markOnly = false,
}: BrandLogoProps) {
  const dimensions = sizes[size];
  const primaryText = dark ? "#ffffff" : "#1a2540";
  const accent = dark ? "#7db8f5" : "#2f66d0";

  return (
    <span
      aria-label="PlacePath"
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        gap: markOnly ? 0 : dimensions.gap,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {/* Single PlacePath mark — no secondary/stepped icon */}
      <svg
        width={dimensions.iconWidth}
        height={dimensions.iconHeight}
        viewBox="0 0 40 30"
        aria-hidden="true"
        focusable="false"
        style={{ display: "block", flexShrink: 0 }}
      >
        <rect x="2" y="2" width="36" height="7" rx="1.5" fill={accent} />
        <rect x="2" y="11.5" width="21" height="7" rx="1.5" fill={accent} />
        <rect x="2" y="21" width="36" height="7" rx="1.5" fill={accent} />
      </svg>

      {!markOnly && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: dimensions.fontSize,
            color: primaryText,
            letterSpacing: "-0.5px",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          Place<span style={{ color: accent }}>Path</span>
        </span>
      )}
    </span>
  );
}
