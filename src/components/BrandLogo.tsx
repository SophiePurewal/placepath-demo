interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  markOnly?: boolean;
}

const sizes = {
  sm: { iconWidth: 25, iconHeight: 18, fontSize: 20, gap: 8 },
  md: { iconWidth: 29, iconHeight: 21, fontSize: 22, gap: 9 },
  lg: { iconWidth: 36, iconHeight: 26, fontSize: 28, gap: 11 },
};

export default function BrandLogo({
  size = "md",
  dark = true,
  markOnly = false,
}: BrandLogoProps) {
  const dimensions = sizes[size];
  const primaryText = dark ? "#ffffff" : "#1a2540";
  const accent = dark ? "#7db8f5" : "#1b5db4";

  return (
    <span
      aria-label="PlacePath"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: markOnly ? 0 : dimensions.gap,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      <svg
        width={dimensions.iconWidth}
        height={dimensions.iconHeight}
        viewBox="0 0 36 26"
        role="img"
        aria-hidden="true"
        focusable="false"
        style={{ display: "block", flexShrink: 0 }}
      >
        <polygon points="3,5 14,5 10,11 0,11" fill={accent} />
        <polygon points="10,12 23,12 19,18 6,18" fill={accent} />
        <polygon points="19,19 36,19 32,25 15,25" fill={accent} />
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
          }}
        >
          Place<span style={{ color: accent }}>Path</span>
        </span>
      )}
    </span>
  );
}
