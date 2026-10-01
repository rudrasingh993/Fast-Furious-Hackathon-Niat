import React from 'react';
import { KageLandingPage } from '../../shaders/landing-pages/LandingPages.js';
import '../../shaders/threeui.css';

export function Scene() {
  return (
    <div className="shader-frame relative w-full h-[540px] md:h-[640px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
      <KageLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
      />
    </div>
  );
}
