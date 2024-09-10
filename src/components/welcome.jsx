// src/WelcomePage.js
import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";
import ImageResizer from "./ImageResizer";
import ContactSection from "./ContactSection";
const WelcomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TestimonialsSection />
      <PricingSection />
      <ImageResizer />
      <ContactSection />
    </>
  );
};

export default WelcomePage;
