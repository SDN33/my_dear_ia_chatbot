'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';
import { Footer } from '../../../components/footer';

import { ArrowRight, MessageSquare, Sparkles, HandCoins } from 'lucide-react';

import { motion } from 'framer-motion';
import { login, type LoginActionState } from '../actions';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const features = [
  {
    icon: <MessageSquare className="size-6 text-teal-600" />,
    title: "Chat Intuitif",
    description: "Nous Simplifions la Communication avec une IA plus Humaine"
  },
  {
    icon: <Sparkles className="size-6 text-teal-600" />,
    title: "Contenus Connectés",
    description: "Actualités, Cryptomonnaies, Spotify et bien plus encore"
  },
  {
    icon: <HandCoins className="size-6 text-teal-600" />,
    title: "Engagement Éthique",
    description: "Engagé pour la Planète avec 50% de vos Dons reversés à WWF France"
  }
];

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(login, {
    status: 'idle',
  });

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Mauvais email ou mot de passe');
    } else if (state.status === 'invalid_data') {
      toast.error('Échec de validation de votre soumission!');
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="min-h-dvh w-full bg-background overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Column - Hero Section */}
          <motion.div
            className="space-y-6 md:space-y-8 text-center lg:text-left"
            initial="initial"
            animate="animate"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white -mb-4 md:-mb-8"
              {...fadeInUp}
            >
              <span className="text-black dark:text-teal-700">My Dear <em>IA</em></span> <br />
              Un Assistant<br />
              <span className="text-teal-700 dark:text-teal-400">Plus Proche de Vous</span>
            </motion.h1>

            <motion.img
              src="/images/avatar.png"
              alt="Assistant IA"
              className="w-34 h-auto neon-effect"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            />
          </motion.div>

          {/* Right Column - Auth Form */}
          <motion.div
            className="w-full max-w-md mx-auto lg:ml-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-2 dark:text-white">
                  Connectez-vous
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Accédez à votre assistant personnel
                </p>
              </div>

              <AuthForm action={handleSubmit} defaultEmail={email}>
                <SubmitButton isSuccessful={isSuccessful}>
                  Se Connecter <ArrowRight className="ml-2 size-4" />
                </SubmitButton>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {"Pas encore de compte? "}
                    <Link
                      href="/register"
                      className="font-semibold text-teal-700 hover:text-teal-500 dark:text-teal-400"
                    >
                      <br />S&apos;inscrire gratuitement
                    </Link>
                  </p>
                </div>
              </AuthForm>
            </div>

            <button
              type="button"
              className="w-full cursor-pointer text-white mt-8 md:mt-14 pb-3 px-4 rounded-lg flex items-center justify-center"
              onClick={() => {
                window.location.href = "https://buy.stripe.com/9AQdU74ZCeMm4Ks28a";
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="text-left flex flex-col items-start">
                  <span className="text-black dark:text-white text-lg font-medium tracking-tight">
                    Faire un don
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 text-xs leading-tight mt-1">
                    50% reversé à <span className="font-medium">WWF France</span>
                    <br />
                    <span className="text-[11px] opacity-75">
                      Pour la préservation de notre planète
                    </span>
                  </span>
                </div>
                <Image
                  src="/images/wwf.svg"
                  alt="WWF Logo"
                  width={24}
                  height={24}
                  className="size-8 md:size-10 rounded-xl z-20 ml-4"
                />
              </div>
            </button>
          </motion.div>

          <div className="flex md:hidden">
            <br />
          </div>

          {/* Features Section */}
          <div className="col-span-2 ">
            <motion.p
              className="text-base text-center -mt-4 mb-10 md:text-lg mx-auto max-w-xl flex justify-center items-center text-black dark:text-teal-500 font-bold
              transition-all duration-300 hover:-translate-y-1"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Découvrez une nouvelle façon de travailler et se divertir avec un assistant IA qui comprend
              vos besoins plus que jamais...
            </motion.p>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/20 dark:border-gray-700/30 backdrop-blur-sm"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 rounded-full bg-teal-50 dark:bg-teal-900/20">
                      {feature.icon}
                    </div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-transparent group-hover:from-teal-50/20 group-hover:to-transparent transition-all duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      <style jsx>{`
        .neon-effect {
          position: relative;
          z-index: 1;
        }
        .neon-effect::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255, 20, 147, 0.6), rgba(0, 128, 128, 0.3));
          transform: translate(-50%, -50%);
          z-index: -1;
          filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
