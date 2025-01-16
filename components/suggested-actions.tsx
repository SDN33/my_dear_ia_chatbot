'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo, useState, useEffect, useMemo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = useMemo(() => [
    { title: "Quelle tenue porter ce soir ? 🧥", label: "à Bordeaux en fonction de la météo", action: "En tenant compte de la météo à Bordeaux ce soir, quelle tenue me conseilles-tu de porter pour sortir ?" },
    { title: "Mon meilleur ami m'a ghosté 😢", label: "comment gérer ça ?", action: "Mon meilleur ami m'a ghosté et je ne sais pas comment réagir. Peux-tu m'aider à gérer ça ?" },
    { title: "J'ai le teint pale et fatigué 😴", label: "routine beauté et soins", action: "J'ai le teint pâle et fatigué. Peux-tu me conseiller une routine beauté et soins pour retrouver de l'éclat ?" },
    { title: "Je ne sais pas quoi cuisiner ce soir 🍲", label: "recette facile et rapide de saison et équilibrée", action: "Je ne sais pas quoi cuisiner ce soir. Peux-tu me donner une recette facile, rapide, de saison et équilibrée ?" },
    { title: "J'ai vraiment besoin de motivation 💪", label: "génère un planning hebdomadaire", action: "Peux-tu m'aider à créer un planning hebdomadaire motivant avec des objectifs de vie et bien être réalisables ?" },
    { title: "Analyse ce message ✍️", label: "vérifie le style et le ton", action: "Peux-tu analyser ce texte pour me dire si le style et le ton sont appropriés ? Je te l'enverrai dans le prochain message." },
    { title: "Aide-moi à méditer, pour faire le vide 🧘‍♀️", label: "séance guidée de 10 minutes", action: "Guide-moi pour une séance de méditation de 10 minutes avec des instructions étape par étape." },
    { title: "Révise avec moi 📚", label: "créer des questions-réponses", action: "Je vais te donner un sujet, peux-tu créer un quiz interactif pour m'aider à réviser ?" },
    { title: "Idées de date 💝 pour aujourd'hui", label: "suggestions romantiques", action: "Propose-moi des idées de rendez-vous romantiques originaux adaptés à la saison." },
    { title: "J'ai besoin d'un Coach sportif virtuel 🏃‍♂️", label: "programme personnalisé", action: "Peux-tu me créer un programme d'entraînement adapté à mon niveau débutant ?" },
    { title: "Je veux apprendre à jouer d'un instrument 🎸", label: "cours en ligne", action: "Je veux apprendre à jouer de la guitare. Peux-tu me recommander un cours en ligne pour débutant ?" },
    { title: "Je veux faire un régime alimentaire 🥗", label: "conseils et astuces", action: "Je veux faire un régime alimentaire. Peux-tu me donner des conseils et astuces pour m'aider à bien démarrer ?" },
    { title: "Je veux apprendre une nouvelle langue 🗣️", label: "méthode efficace", action: "Je veux apprendre une nouvelle langue. Peux-tu me recommander une méthode efficace pour démarrer ?" },
    { title: "Je veux apprendre plus sur le Bitcoin 👩‍💻", label: "Le Bitcoin : Comment cela ça fonctione ?", action: "Peux tu me faire un cours documenté et illustré pour débutant sur le bitcoin et les cryptomonnais ?" },
  ], []);

  // State to handle hydration
  const [hydrated, setHydrated] = useState(false);
  const [randomizedActions, setRandomizedActions] = useState<any[]>([]);

  useEffect(() => {
    // Randomly select 4 actions only after the component has hydrated
    setRandomizedActions([...suggestedActions].sort(() => Math.random() - 0.5).slice(0, 4));
    setHydrated(true); // Indicate that the component is hydrated
  }, [suggestedActions]);

  if (!hydrated) {
    return null; // Render nothing before hydration
  }

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {randomizedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);
              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
