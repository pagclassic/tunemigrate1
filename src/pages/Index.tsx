
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import AccuracySection from '@/components/home/AccuracySection';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';

const Index = () => {
  return (
    <AppLayout>
      <Hero />
      <Features />
      <AccuracySection />
      <Testimonials />
      <CTA />
    </AppLayout>
  );
};

export default Index;
