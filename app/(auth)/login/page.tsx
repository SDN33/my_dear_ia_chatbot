'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';
import { ArrowRight, Brain, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { login, type LoginActionState } from '../actions';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const features = [
  {
    icon: <Brain className="size-6" />,
    title: "IA Personnalisée",
    description: "Un assistant qui apprend et s'adapte à vos besoins"
  },
  {
    icon: <MessageSquare className="size-6" />,
    title: "Chat Intuitif",
    description: "Conversations naturelles et fluides"
  },
  {
    icon: <Sparkles className="size-6" />,
    title: "Contenus Connecté",
    description: "Accédez à des contenus connectés et dynamiques"
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
    <div className="min-h-dvh w-full bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ">

          {/* Left Column - Hero Section */}
            <motion.div
            className="space-y-8"
            initial="initial"
            animate="animate"
            >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white -mb-8"
              {...fadeInUp}
            >
              <span className="text-black dark:text-teal-700">My Dear <em>IA</em></span> <br />
              Un Assistant<br />
              <span className="text-teal-700 dark:text-teal-400">Plus Proche de Vous</span><br />
            </motion.h1>

            <motion.img
              src="/images/avatar.png"
              alt="Assistant IA"
              className="w-50 h-auto neon-effect"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            />
            </motion.div>

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

          {/* Right Column - Auth Form */}
          <motion.div
            className="lg:ml-auto w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 dark:text-white">
                  Connectez-vous
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Accédez à votre assistant personnel
                </p>
              </div>

              <AuthForm action={handleSubmit} defaultEmail={email}>
                <SubmitButton isSuccessful={isSuccessful}>
                  Se Connecter <ArrowRight className="ml-2 size-4" />
                </SubmitButton>

                <div className="mt-6 text-center">
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
          </motion.div>

          <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 text-bold"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Découvrez une nouvelle façon de travailler, se divertir avec un assistant IA qui comprend
              vos besoins plus que jamais.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className=" dark:text-white mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-1 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </motion.div>

            <footer className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <p>
                &copy; {new Date().getFullYear()} My Dear IA - Une création de <a href="https://stillinov.com" className='underline'>Still-inov Agency</a>. Tous droits réservés.
                </p>
                <p>
                <a href="/legal" className='underline'>Mentions Légales</a> - <a href="/privacy" className='underline'>Politique de Confidentialité</a> - <a href="/cookies" className='underline'>Cookies</a>
                </p>
            </footer>

        </div>
      </div>
    </div>
  );
}
