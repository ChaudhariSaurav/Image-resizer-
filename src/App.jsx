import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataStore from './zustand/userDataStore';
import HeroSection from './components/HeroSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import ImageResizer from './components/ImageResizer';
import ContactSection from './components/ContactSection';
import LoginPage from './components/LoginPage';

const App = () => {
  const { isLoggedIn } = useDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/welcome');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {isLoggedIn ? (
        <>
          <HeroSection />
          <TestimonialsSection />
          <PricingSection />
          <ImageResizer />
          <ContactSection />
        </>
      ) : (
        <LoginPage />
      )}
    </>
  );
};

export default App;
