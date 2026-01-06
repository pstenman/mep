import { Hero } from "./hero";
import { Features } from "./features";
import { Pricing } from "./pricing";
import { About } from "./about";
import { CTA } from "./cta";

export function PublicView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Hero />
      <Features />
      <Pricing />
      <About />
      <CTA />
    </div>
  );
}
