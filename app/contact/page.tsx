'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Footer } from '@/components/footer';
import { SubmitButton } from '@/components/submit-button';
import { Mail, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const contactInfo = [
  {
    icon: <Mail className="size-6 text-teal-600 group-hover:rotate-12 transition-transform" />,
    title: "Email",
    description: "stillinovagency@gmail.com",
    link: "mailto:stillinovagency@gmail.com"
  },
];

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Message envoyé avec succès !');
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-dvh w-full bg-background overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 md:mb-24">
          {/* Left Column */}
          <motion.div className="space-y-6 md:space-y-8 text-center lg:text-left" initial="initial" animate="animate">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
              {...fadeInUp}
            >
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Contactez-nous
              </span>
              <br />
              <span className="text-teal-700 dark:text-teal-400">Nous Sommes à Votre Écoute</span>
            </motion.h1>

            <motion.p
              className="text-gray-600 dark:text-gray-300"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Une question ? Un besoin spécifique ? Notre équipe est là pour vous accompagner
              et répondre à toutes vos interrogations concernant My Dear IA.
            </motion.p>

            {/* Contact Information Grid */}
            <motion.div
              className="grid grid-cols-1 gap-6 mt-8"
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  className="group flex items-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  whileHover={{ y: -2 }}
                >
                  <div className="p-2 rounded-full bg-teal-50 dark:bg-teal-900/20 mr-4">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {info.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {info.description}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            className="w-full max-w-md mx-auto mt-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <form
                onSubmit={handleSubmit}
                action="https://formspree.io/f/mkgornel"
                method="POST"
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <SubmitButton isSuccessful={isSubmitting}>
                  <MessageSquare className="ml-2 size-4" />
                </SubmitButton>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-16 md:mt-24">
          <Footer />
        </div>
      </div>
    </div>
  );
}
