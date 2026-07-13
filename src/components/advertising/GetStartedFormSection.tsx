import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const industries = [
  'Technology',
  'Food & Beverage',
  'Fashion & Apparel',
  'Health & Wellness',
  'Entertainment',
  'Finance',
  'Other',
];

const roles = [
  'Marketing Manager',
  'Brand Manager',
  'CEO / Founder',
  'Media Buyer',
  'Agency Representative',
  'Other',
];

const GetStartedFormSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const fieldClass =
    'bg-[#2a2a2a] border-[#444] text-white placeholder:text-[#888] focus-visible:ring-[#C40505]';

  return (
    <section id="get-started-form" className="w-full max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        Get Started
      </h2>

      {submitted ? (
        <div className="text-center py-12">
          <p className="text-white text-xl font-bold mb-2">Thank you for your interest!</p>
          <p className="text-[#D2D8DA]">
            Our advertising team will reach out to you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input placeholder="First name" required className={fieldClass} />
          <Input placeholder="Last name" required className={fieldClass} />
          <Input type="email" placeholder="Email" required className={fieldClass} />
          <Input type="email" placeholder="Work email" className={fieldClass} />
          <Input type="tel" placeholder="Phone number" className={fieldClass} />
          <Input type="url" placeholder="Company Website" className={fieldClass} />

          <Select>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#444] text-white">
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry} className="focus:bg-[#444]">
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#444] text-white">
              {roles.map((role) => (
                <SelectItem key={role} value={role} className="focus:bg-[#444]">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#C40505] hover:bg-[#a00404] text-white font-bold text-lg px-16 py-3 rounded-full transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default GetStartedFormSection;
