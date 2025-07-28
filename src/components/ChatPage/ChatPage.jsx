import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  chatBubbleVariant,
  chatBubbleMessageVariants,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
} from '../ui/chat/chat-bubble';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessageList } from '../ui/chat/chat-message-list';
import { ChatInput } from '../ui/chat/chat-input';
import MessageLoading from '../ui/chat/message-loading';

function ChatPage() {
  const messages = [
    {
      id: 1,
      message: 'Hover me!',
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      id: 2,
      message: 'Hover me too!',
      sender: 'bot',
      timestamp: new Date(Date.now() - 2 * 60000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }), // 2 minutes ago
    },
    {
      id: 3,
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
          <h1 className="text-2xl font-semibold text-center text-primary">
            Chat with Diana
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
                    {message.timestamp && (
                      <ChatBubbleTimestamp
                        timestamp={message.timestamp}
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
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </Card>
    </main>
  );
}

export default ChatPage;
