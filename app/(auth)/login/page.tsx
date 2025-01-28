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
    icon: <MessageSquare className="size-6 text-teal-600 group-hover:scale-110 transition-transform" />,
    title: "Assistant Personnel Intelligent",
    description: "Profitez d'une conversation naturelle et fluide avec une IA qui comprend vos besoins et s'adapte à votre style"
  },
  {
    icon: <Sparkles className="size-6 text-teal-600 group-hover:rotate-12 transition-transform" />,
    title: "Univers Connecté",
    description: "Explorez un monde d'informations en temps réel : marchés financiers, musique, actualités, divertissement et bien plus"
  },
  {
    icon: <HandCoins className="size-6 text-teal-600 group-hover:bounce transition-all" />,
    title: "Impact Positif",
    description: "Contribuez à un avenir meilleur avec nous : 50% de chaque don soutient directement les actions de WWF France"
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

  const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/langfr-195px-OpenAI_Logo.svg.png", alt: "OpenAI" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/2024_Spotify_Logo.svg/langfr-300px-2024_Spotify_Logo.svg.png", alt: "Spotify" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Bitcoin_logo.svg/langfr-330px-Bitcoin_logo.svg.png", alt: "Bitcoin" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/YouTube_2024.svg/langfr-210px-YouTube_2024.svg.png", alt: "YouTube" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Google_News_icon.png/332px-Google_News_icon.png", alt: "Google News" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/langfr-225px-IMDB_Logo_2016.svg.png", alt: "IMDb" },
  ];

  return (
    <div className="min-h-dvh w-full bg-background overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 md:mb-24">
          {/* Left Column */}
            <motion.div
            className="space-y-6 md:space-y-8 text-center lg:text-left mt-24 md:mt-0"
            initial="initial"
            animate="animate"
            >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white -mt-20"
              {...fadeInUp}
            >
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent font-extrabold tracking-tight">
              My Dear <em className="italic font-black">IA</em>
              </span>
              <br />
              Un Assistant<br />
              <span className="text-teal-700 dark:text-teal-400 drop-shadow-sm">Plus Proche de Vous</span>
            </motion.h1>

            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-teal-400 opacity-40 blur-2xl rounded-full animate-pulse" />

              <motion.img
              src="/images/avatar.png"
              alt="Assistant IA"
              className="w-80 h-auto mx-auto lg:mx-0 rounded-full shadow-2xl mt-10 md:mt-0"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.3))'
              }}
              />
            </motion.div>
            </motion.div>

          {/* Right Column */}
          <motion.div
            className="w-full max-w-md mx-auto mt-14"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
              <div className="text-center mb-6">
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
                      S&apos;inscrire gratuitement
                    </Link>
                  </p>
                </div>
              </AuthForm>
            </div>

            <button
              type="button"
              className="w-full hidden md:flex bg-white dark:bg-gray-800 cursor-pointer text-white p-4 rounded-lg items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700"
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
        </div>

        {/* Main Content */}
        <div className="space-y-16 md:space-y-24">
          {/* Description */}
          <motion.p
            className="text-sm sm:text-base md:text-lg text-center font-semibold text-black dark:text-teal-500"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Découvrez une nouvelle façon de travailler et se divertir
            avec un assistant IA connecté
            <br className="hidden sm:block" />
            &nbsp; qui comprend vos besoins plus que jamais
          </motion.p>

            <motion.p
            className="text-xs sm:text-sm md:text-lg text-center text-gray-600 dark:text-gray-400 -mt-10"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            >
            My Dear IA révolutionne l&apos;intelligence artificielle en connectant le modèle GPT-3 d&apos;OpenAI à un écosystème d&apos; APIs en temps réel...<br /> Cours des cryptomonnaies, playlists Spotify, contenus YouTube, flux RSS d&apos;actualités multi-domaines.<br /><br /> Cette interconnexion unique permet à l&apos;assistant de rester constamment informé sur l&apos;actualité mondiale, la finance, la musique et le divertissement pour des interactions toujours plus pertinentes.
            </motion.p>

          {/* Logos Carousel */}
          <div className="w-full overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl relative">
            <div className="relative max-w-7xl mx-auto">
              <div className="flex space-x-16 animate-scroll">
                {[...logos, ...logos].map((logo, index) => (
                  <div
                    key={index}
                    className="flex-none size-40 flex items-center justify-center"
                  >
                    <div className="relative size-20">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        layout="fill"
                        objectFit="contain"
                        className="opacity-60 hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-background to-transparent" />
            <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-background to-transparent" />
          </div>

          {/* Features Grid */}
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
          <br />
          <button
              type="button"
              className="w-full md:hidden flex bg-white dark:bg-gray-800 cursor-pointer text-white p-4 rounded-lg items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700"
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
        </div>



        {/* Footer */}
        <div className="mt-16 md:mt-24">
          <Footer />
        </div>
      </div>

      <style jsx global>{`
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
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
