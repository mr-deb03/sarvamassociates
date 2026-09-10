import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-navy grain relative isolate flex min-h-[70svh] items-center overflow-hidden">

      <div className="container-page relative py-32 text-center">
        <p className="font-sans text-stat text-paper/30 tnum">
          404
        </p>

        <h1 className="font-display text-paper mt-4 text-[clamp(1.9rem,4vw,3rem)] font-semibold">
          That page isn&rsquo;t here.
        </h1>

        <p className="text-paper/55 mx-auto mt-4 max-w-md text-base leading-relaxed">
          The link may be out of date, or the page may have moved. The main
          sections are all one click away.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/" withArrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/investments" variant="secondaryOnDark">
            Investment solutions
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondaryOnDark">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
