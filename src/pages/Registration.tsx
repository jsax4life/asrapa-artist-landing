import React from 'react';
import { SignUpForm } from '@/components/signup-components/SignUpForm';
import promoImage from '../assets/images/young-african-american-jazz-musician-singing-song .png'; // Adjust the path as necessary

const Registration = () => {
  return (
    <main className="bg-[#2A2626] min-h-screen px-4 md:pl-16 md:pr-0">
      <div className="flex flex-col lg:flex-row lg:gap-5 min-h-screen">
        <section className="w-full lg:w-[54%] flex items-center justify-center py-8 lg:py-0" aria-label="Sign up form">
          <SignUpForm />
        </section>
        
        <aside className="w-full lg:w-[46%] lg:ml-5 order-first lg:order-last" aria-label="Promotional image">
          <img
            src={promoImage}
            alt="AsrapaMusic promotional image showing musicians and music equipment"
            className="aspect-[0.64] lg:aspect-[0.64] object-cover lg:object-contain w-full h-48 sm:h-64 lg:h-full"
          />
        </aside>
      </div>
    </main>
  );
};

export default Registration;
