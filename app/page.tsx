import ScrollProgress from "@/components/ScrollProgress";
import TopStrip from "@/components/TopStrip";
import Hero from "@/components/Hero";
import WhatYouGet from "@/components/WhatYouGet";
import HostBlock from "@/components/HostBlock";
import Testimonials from "@/components/Testimonials";
import FinalCall from "@/components/FinalCall";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <TopStrip />
      <main>
        <Hero />
        <WhatYouGet />
        <HostBlock />
        <Testimonials />
        <FinalCall />
      </main>
      <Footer />
    </>
  );
}
