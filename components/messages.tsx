import { ChatRequestOptions, Message } from 'ai';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { memo, useEffect, useState } from 'react';
import { Vote } from '@/lib/db/schema';
import equal from 'fast-deep-equal';

interface MessagesProps {
  chatId: string;
  isLoading: boolean;
  votes: Array<Vote> | undefined;
  messages: Array<Message>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  isBlockVisible: boolean;
}

function PureMessages({
  chatId,
  isLoading,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getMessageSpacing = () => {
    if (isMobile) {
      return messages.length <= 2 ? 'gap-4' : 'gap-3';
    }
    return 'gap-6';
  };

  return (
    <div
      ref={messagesContainerRef}
      className={`flex flex-col min-w-0 flex-1 overflow-y-scroll
        ${getMessageSpacing()}
        ${isMobile ? 'pt-2 px-2' : 'pt-4 px-4'}
        ${isMobile ? 'pb-24' : 'pb-6'}
        scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
        scrollbar-track-transparent`}
    >
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`${
            isMobile ? 'animate-fadeIn' : ''
          }`}
        >
          <PreviewMessage
            chatId={chatId}
            message={message}
            isLoading={isLoading && messages.length - 1 === index}
            vote={
              votes
                ? votes.find((vote) => vote.messageId === message.id)
                : undefined
            }
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
          />
        </div>
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && (
          <div className={isMobile ? 'mx-2' : ''}>
            <ThinkingMessage />
          </div>
        )}

      <div
        ref={messagesEndRef}
        className={`shrink-0 ${isMobile ? 'min-h-[16px]' : 'min-h-[24px]'}
          ${isMobile ? 'min-w-[16px]' : 'min-w-[24px]'}`}
      />
    </div>
  );
}

// Ajout d'une animation de fondu pour mobile
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
`;

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isBlockVisible && nextProps.isBlockVisible) return true;
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;
  return true;
});
