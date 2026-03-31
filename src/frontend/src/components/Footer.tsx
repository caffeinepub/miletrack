import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-[oklch(0.27_0.01_264)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-[oklch(0.75_0_0)]">
          © {year} MileTrack · Office Safar Tracker
        </p>
        <p className="text-sm text-[oklch(0.65_0_0)] flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />{" "}
          using{" "}
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[oklch(0.75_0.12_264)] hover:text-[oklch(0.85_0.15_264)] transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
