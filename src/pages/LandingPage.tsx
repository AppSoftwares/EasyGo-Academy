import { useEffect } from "react";
import { Header } from "../components/landing/Header";
import { HeroSection } from "../components/landing/HeroSection";
import { WaveDivider } from "../components/ui/SectionDivider";
import { AnimatedSection } from "../components/ui/AnimatedSection";
import { PhilosophySection } from "../components/landing/PhilosophySection";
import { WhyDifferentSection } from "../components/landing/WhyDifferentSection";
import { AITutorSection } from "../components/landing/AITutorSection";
import { MethodSection } from "../components/landing/MethodSection";
import { ClassStructureSection } from "../components/landing/ClassStructureSection";
import { GoalSystemSection } from "../components/landing/GoalSystemSection";
import { LevelsSection } from "../components/landing/LevelsSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { DailyPracticeSection } from "../components/landing/DailyPracticeSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { CTASection } from "../components/landing/CTASection";
import { Footer } from "../components/landing/Footer";

export const LandingPage = () => {
  // Versión 1.0.6 - Despliegue Limpio
  // Efecto de parallax al hacer scroll
// Efectos al montar el componente (Scroll + Widget de Chat)
  useEffect(() => {
    // 1. Efecto de parallax al hacer scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      document.documentElement.style.setProperty(
        "--scroll-y",
        `${scrolled * 0.03}px`,
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. Inyección dinámica del Widget de LeadConnector
    const script = document.createElement("script");
    script.src = "https://beta.leadconnectorhq.com/loader.js";
    script.setAttribute("data-resources-url", "https://beta.leadconnectorhq.com/loader.js");
    script.setAttribute("data-widget-id", "6a1f36f5b2d4c061bc67da10");
    script.setAttribute("data-source", "WEB_USER");
    script.async = true;

    document.body.appendChild(script);

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Badge de Versión para depuración */}
      <div className="fixed bottom-4 left-4 z-[100] bg-black/50 text-white/50 text-[10px] px-2 py-1 rounded-full pointer-events-none">
        EasyGo v1.1.0 (Stable)
      </div>
      <Header />

      {/* Hero - sin animación de entrada (es lo primero que se ve) */}
      <HeroSection />

      <AnimatedSection animation="fade-up" delay={0}>
        <PhilosophySection />
      </AnimatedSection>

      {/* <AnimatedSection animation="fade-up" delay={100}>
        <WhyDifferentSection />
      </AnimatedSection> */}

      {/* AI Tutor - animación desde la derecha */}
      <AnimatedSection animation="fade-left" delay={0}>
        <AITutorSection />
      </AnimatedSection>

      <AnimatedSection animation="scale-up" delay={0}>
        <MethodSection />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={100}>
        <ClassStructureSection />
      </AnimatedSection>

      <AnimatedSection animation="fade-right" delay={0}>
        <GoalSystemSection />
      </AnimatedSection>
      <AnimatedSection animation="fade-left" delay={0}>
        <DailyPracticeSection />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={0}>
        <LevelsSection />
      </AnimatedSection>

      <AnimatedSection animation="scale-up" delay={100}>
        <FeaturesSection />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={0}>
        <TestimonialsSection />
      </AnimatedSection>

     {/*  <AnimatedSection
        animation="scale-up"
        delay={100}
        className="shine-effect"
      >
        <CTASection />
      </AnimatedSection> */}

      <Footer />
    </div>
  );
};
