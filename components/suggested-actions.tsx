'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
    const suggestedActions = [
         {
      title: "Quelle tenue porter ce soir ? 🧥",
      label: "à Bordeaux en fonction de la météo",
      action: "En tenant compte de la météo à Bordeaux ce soir, quelle tenue me conseilles-tu de porter pour sortir ?",
    },
      {
        title: "Mon meilleur ami m'a ghosté 😢",
        label: "comment gérer ça ?",
        action: "Mon meilleur ami m'a ghosté et je ne sais pas comment réagir. Peux-tu m'aider à gérer ça ?",
      },
      {
        title: "J'ai le teint pale et fatigué 😴",
        label: "routine beauté et soins",
        action: "J'ai le teint pâle et fatigué. Peux-tu me conseiller une routine beauté et soins pour retrouver de l'éclat ?",
      },
      {
        title: "Je ne sais pas quoi cuisiner ce soir 🍲",
        label: "recette facile et rapide de saison et équilibrée",
        action: "Je ne sais pas quoi cuisiner ce soir. Peux-tu me donner une recette facile, rapide, de saison et équilibrée ?",
      },
    ];


  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
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
