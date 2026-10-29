import { TbArrowUp, TbBrandLinkedin, TbMail } from "react-icons/tb";
import { profile } from "@/data/resume";

export function Footer() {
  return (
    <footer className="relative border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-fg-subtle sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. Designed &amp; engineered in {profile.location}.
        </p>
        <div className="flex items-center gap-2">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="grid size-10 place-items-center rounded-full text-lg transition-colors hover:bg-surface hover:text-fg"
          >
            <TbBrandLinkedin />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send email"
            className="grid size-10 place-items-center rounded-full text-lg transition-colors hover:bg-surface hover:text-fg"
          >
            <TbMail />
          </a>
          <a
            href="#top"
            aria-label="Back to top"
            className="ml-2 grid size-10 place-items-center rounded-full border border-line text-lg transition-colors hover:border-line-strong hover:text-fg"
          >
            <TbArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}
