import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

type Role = "coordinator" | "employer" | "student";

interface SignInProps {
  onSignIn: (role: Role) => void;
}

const roleOptions: { value: Role; label: string; desc: string }[] = [
  { value: "coordinator", label: "Sarah Ahmed", desc: "Placement Coordinator — Northbridge College" },
  { value: "employer", label: "David Hughes", desc: "Operations Manager — Nessie Nursery" },
  { value: "student", label: "Maya Thompson", desc: "Health and Social Care L3 Student" },
];

export default function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState("sarah.ahmed@northbridgecollege.example");
  const [password, setPassword] = useState("••••••••");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<Role>("coordinator");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email address and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignIn(role);
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#f4f7fb" }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[420px] flex-shrink-0"
        style={{ backgroundColor: "#1a2540" }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 28,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            Place<span style={{ color: "#7db8f5" }}>Path</span>
          </span>
          <p className="mt-4 text-base" style={{ color: "rgba(200,214,236,0.8)", lineHeight: 1.6 }}>
            Connecting learning providers, employers and students throughout the placement lifecycle.
          </p>
        </div>

        <div>
          <p className="text-sm" style={{ color: "rgba(200,214,236,0.6)", lineHeight: 1.7 }}>
            This is a working prototype. Three perspectives are available — placement coordinator, employer contact and student. Switch between them using the menu in the top-right corner once signed in.
          </p>
        </div>

        <p style={{ color: "rgba(200,214,236,0.4)", fontSize: 12 }}>
          © 2026 PlacePath · Fictional product prototype
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 28,
                color: "#1a2540",
              }}
            >
              Place<span style={{ color: "#1b5db4" }}>Path</span>
            </span>
          </div>

          <div
            className="bg-white rounded-xl shadow-sm border p-8"
            style={{ borderColor: "#d5e2f0" }}
          >
            <h1
              className="text-2xl mb-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#1a2540" }}
            >
              Sign in
            </h1>
            <p className="text-sm mb-6" style={{ color: "#5b6a8a" }}>
              Welcome back. Please sign in to continue.
            </p>

            {/* Prototype role selector */}
            <div
              className="mb-6 rounded-lg p-4 border"
              style={{ backgroundColor: "#ebf3fc", borderColor: "#bdd5f4" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: "#1b5db4", fontFamily: "var(--font-display)" }}
              >
                Preview the prototype as
              </p>
              <div className="space-y-2">
                {roleOptions.map((r) => (
                  <label
                    key={r.value}
                    className="flex items-center gap-3 cursor-pointer rounded-md p-2 transition-colors"
                    style={{
                      backgroundColor: role === r.value ? "#fff" : "transparent",
                      border: role === r.value ? "1px solid #bdd5f4" : "1px solid transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => {
                        setRole(r.value);
                        setEmail(
                          r.value === "coordinator"
                            ? "sarah.ahmed@northbridgecollege.example"
                            : r.value === "employer"
                              ? "david.hughes@smithselec.co.uk"
                              : "maya.thompson@student.northbridgecollege.example"
                        );
                      }}
                      className="accent-ep-blue"
                      style={{ accentColor: "#1b5db4" }}
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}>
                        {r.label}
                      </p>
                      <p className="text-xs" style={{ color: "#5b6a8a" }}>{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div
                  className="flex items-start gap-2 rounded-md p-3 mb-4 border text-sm"
                  style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c" }}
                  role="alert"
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-md border px-3 py-2.5 text-sm transition-colors"
                    style={{
                      borderColor: "#d5e2f0",
                      color: "#1a2540",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#1b5db4")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e2f0")}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                      style={{ color: "#1a2540", fontFamily: "var(--font-display)" }}
                    >
                      Password
                    </label>
                    <a href="#" className="text-sm" style={{ color: "#1b5db4" }}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full rounded-md border px-3 py-2.5 text-sm pr-10 transition-colors"
                      style={{ borderColor: "#d5e2f0", color: "#1a2540", outline: "none" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#1b5db4")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e2f0")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#5b6a8a" }}
                      onClick={() => setShowPass(!showPass)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-md py-2.5 text-sm font-semibold transition-opacity"
                style={{
                  backgroundColor: "#1b5db4",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: "#5b6a8a" }}>
            Problems signing in?{" "}
            <a href="#" style={{ color: "#1b5db4" }}>
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
