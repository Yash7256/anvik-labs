import { Link } from "react-router";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const mono =
  "font-mono uppercase tracking-[0.02em] text-[12px] leading-[1.2]";

export default function NotFoundPage({
  title = "Page not found",
}: {
  title?: string;
}) {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="flex flex-1 flex-col items-start justify-center gap-6 pt-24 md:pt-28"
      >
        <p className={`${mono} text-muted`}>404</p>
        <h1 className="font-sans text-[clamp(2rem,7vw,6rem)] font-medium uppercase leading-[0.9] tracking-[-0.05em] break-words">
          {title}
        </h1>
        <Link
          to="/"
          className={`${mono} transition-opacity duration-200 hover:opacity-50`}
        >
          [ BACK HOME ]
        </Link>
      </main>
      <Footer />
    </>
  );
}
