'use client';

import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import { memo, useEffect, useState } from 'react';
import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { VisibilityType, VisibilitySelector } from './visibility-selector';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(windowWidth < 768);
  }, [windowWidth]);

  return (
    <header className="relative flex flex-col bg-background">
      {/* Top Bar avec les contrôles */}
      <div className="flex items-center p-2 border-b">
        <div className="flex items-center gap-2 flex-1">
          <SidebarToggle />

          {(!open || isMobile) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`${
                    isMobile ? 'px-2' : 'md:px-2'
                  } h-9 ml-auto md:ml-0`}
                  onClick={() => {
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <PlusIcon size={isMobile ? 20 : 16} />
                  <span className={isMobile ? 'sr-only' : 'md:sr-only ml-2'}>
                    Nouvelle discussion
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nouvelle discussion</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Warning Message */}
        <div className={`flex justify-center py-2 px-4 text-center w-full text-xs`}>
            <span className="text-muted-foreground text-center mx-auto hidden md:flex">
            My Dear IA peut faire des erreurs. Envisagez de vérifier les informations importantes.
            </span>
        </div>
        {/* Selectors Container - Hidden on Mobile */}
        <div className={`items-center gap-2`}>
          {!isReadonly && (
            <>
              <ModelSelector
                selectedModelId={selectedModelId}
                className="w-40"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
