'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
                <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer flex items-center gap-2">
                My Dear IA
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-8 h-auto">
                  {/* Fond décoratif */}
                  <circle cx="100" cy="100" r="90" fill="#F8E1E8" opacity="0.3"/>

                  {/* Cercle principal */}
                  <circle cx="100" cy="100" r="60" fill="#E8B4BC"/>

                  {/* Motifs géométriques élégants */}
                  <path d="M100 40 L120 60 L100 80 L80 60 Z" fill="#B4D7D9" opacity="0.6"/>
                  <path d="M40 100 L60 120 L40 140 L20 120 Z" fill="#B4D7D9" opacity="0.6"/>
                  <path d="M160 100 L180 120 L160 140 L140 120 Z" fill="#B4D7D9" opacity="0.6"/>

                  {/* Éléments abstraits */}
                  <circle cx="100" cy="100" r="35" fill="#F8E1E8"/>

                  {/* Lignes décoratives courbes */}
                  <path d="M65 100 Q100 130 135 100" stroke="#B4D7D9" strokeWidth="3" fill="none"/>
                  <path d="M65 90 Q100 120 135 90" stroke="#B4D7D9" strokeWidth="3" fill="none"/>

                  {/* Détails élégants */}
                  <circle cx="70" cy="85" r="5" fill="#B4D7D9"/>
                  <circle cx="130" cy="85" r="5" fill="#B4D7D9"/>

                  {/* Éléments de connexion subtils */}
                  <path d="M40 70 Q70 40 100 40" stroke="#E8B4BC" strokeWidth="2" fill="none" opacity="0.6"/>
                  <path d="M160 70 Q130 40 100 40" stroke="#E8B4BC" strokeWidth="2" fill="none" opacity="0.6"/>
                </svg>
                </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">Nouvelle discussion</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
        <span className="block text-xs text-gray-500 dark:text-zinc-400 -mt-2 ml-2 mb-4">
          Votre compagnon IA personnelle
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
