import React from 'react';
import { DateTime } from 'luxon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
} from '../ui/chat/chat-bubble';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessageList } from '../ui/chat/chat-message-list';
import { ChatInput } from '../ui/chat/chat-input';

function ChatPage() {
  function formatTimestamp(isoString) {
    const now = DateTime.now();
    const messageDate = DateTime.fromISO(isoString);
    const isToday = now.hasSame(messageDate, 'day');

    if (isToday) {
      return messageDate.toLocaleString(DateTime.TIME_SIMPLE);
    } else {
      return messageDate.toLocaleString({ month: 'short', day: 'numeric' });
    }
  }

  const messages = [
    {
      id: 1,
      message: 'This is from yesterday',
      sender: 'bot',
      createdAt: DateTime.now().minus({ days: 1 }).toISO(), // Yesterday as ISO string
    },
    {
      id: 2,
      message: 'Hover me!',
      sender: 'user',
      createdAt: DateTime.now().toISO(), // Now as ISO string
    },
    {
      id: 3,
      sender: 'bot',
      createdAt: DateTime.now().minus({ minutes: 2 }).toISO(), // 2 minutes ago as ISO string
    },
    {
      id: 4,
      message: '',
      sender: 'bot',
      isLoading: true,
    },
  ];

  const actionIcons = [];

  return (
    <main className="flex flex-col h-screen bg-muted">
      <Card className="flex flex-col flex-1 max-w-2xl w-full mx-auto my-6 shadow-lg">
        <CardContent className="flex flex-col flex-1 p-4 space-y-4 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-left bg-primary text-white flex items-center gap-2 p-2 rounded-lg">
            <img src="diana-bubble.png" alt="Diana" width="50" height="60" />
            Diana
          </h1>
          <div className="flex-1 space-y-2 overflow-y-auto">
            <ChatMessageList>
              {messages.map((message, index) => {
                const variant = message.sender === 'user' ? 'sent' : 'received';
                return (
                  <ChatBubble key={message.id} variant={variant}>
                    <Avatar className="size-8">
                      <AvatarImage
                        src={
                          variant === 'sent'
                            ? '/avatar-mouse.png'
                            : '/diana-bubble.png'
                        }
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {variant === 'sent' ? 'US' : 'AI'}
                      </AvatarFallback>
                    </Avatar>
                    <ChatBubbleMessage
                      isLoading={message.isLoading}
                      className={
                        message.sender === 'user'
                          ? 'color-primary'
                          : 'color-secondary'
                      }
                    >
                      {message.message}
                    </ChatBubbleMessage>
                    {/* Action Icons */}
                    {message.createdAt && (
                      <ChatBubbleTimestamp
                        timestamp={formatTimestamp(message.createdAt)}
                        className={
                          variant === 'sent' ? 'text-right' : 'text-left'
                        }
                      />
                    )}
                    <ChatBubbleActionWrapper>
                      {actionIcons.map(({ icon: Icon, type }) => (
                        <ChatBubbleAction
                          className="size-7"
                          key={type}
                          icon={<Icon className="size-4" />}
                          onClick={() =>
                            console.log(
                              'Action ' + type + ' clicked for message ' + index
                            )
                          }
                        />
                      ))}
                    </ChatBubbleActionWrapper>
                  </ChatBubble>
                );
              })}
            </ChatMessageList>
          </div>
        </CardContent>
        <form className="flex items-center gap-2 border-t p-4">
          <ChatInput
            type="text"
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default ChatPage;
