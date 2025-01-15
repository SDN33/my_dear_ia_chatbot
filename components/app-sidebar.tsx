'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
                <h1 className="text-xl font-bold tracking-wide text-gray-800 dark:text-zinc-200" style={{ fontFamily: "'Jersey 15'" }}>
                  My Dear <span className="font-bold bg-teal-700 bg-clip-text text-transparent">IA</span>
                </h1>
                <Image
                  src="/images/avatar.png"
                  alt="My Dear IA"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
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
          Votre compagnon IA personnel
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
