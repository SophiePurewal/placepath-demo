import profileSprite from "../assets/profileSprite";

type ProfileRole = "coordinator" | "employer" | "student";

const profileNames: Record<ProfileRole, string> = {
  coordinator: "Sarah Ahmed",
  employer: "David Hughes",
  student: "Maya Thompson",
};

const profilePositions: Record<ProfileRole, string> = {
  coordinator: "0% 38%",
  employer: "50% 38%",
  student: "100% 38%",
};

interface ProfileAvatarProps {
  role: ProfileRole;
  size?: number;
  className?: string;
  decorative?: boolean;
}

export default function ProfileAvatar({
  role,
  size = 36,
  className = "",
  decorative = false,
}: ProfileAvatarProps) {
  return (
    <div
      className={`rounded-full flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "#1b5db4",
        backgroundImage: `url(${profileSprite})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "300% auto",
        backgroundPosition: profilePositions[role],
      }}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : `${profileNames[role]} profile photo`}
    />
  );
}
