import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const GetStartedFormSection: React.FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const fieldClass =
    'bg-[#2a2a2a] border-[#444] text-white placeholder:text-[#888] focus-visible:ring-[#C40505]';

  const industries = ['Technology', 'Food & Beverage', 'Fashion & Apparel', 'Health & Wellness', 'Entertainment', 'Finance', 'Other'];
  const roles = ['Marketing Manager', 'Brand Manager', 'CEO / Founder', 'Media Buyer', 'Agency Representative', 'Other'];

  return (
    <section id="get-started-form" className="w-full max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        {t('advertising.getStarted')}
      </h2>

      {submitted ? (
        <div className="text-center py-12">
          <p className="text-white text-xl font-bold mb-2">{t('advertising.thankYou')}</p>
          <p className="text-[#D2D8DA]">{t('advertising.teamReachOut')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input placeholder={t('advertising.form.firstName')} required className={fieldClass} />
          <Input placeholder={t('advertising.form.lastName')} required className={fieldClass} />
          <Input type="email" placeholder={t('advertising.form.email')} required className={fieldClass} />
          <Input type="email" placeholder={t('advertising.form.workEmail')} className={fieldClass} />
          <Input type="tel" placeholder={t('advertising.form.phone')} className={fieldClass} />
          <Input type="url" placeholder={t('advertising.form.website')} className={fieldClass} />

          <Select>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder={t('advertising.form.industry')} />
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
              <SelectValue placeholder={t('advertising.form.role')} />
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
              {t('common.submit')}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default GetStartedFormSection;
