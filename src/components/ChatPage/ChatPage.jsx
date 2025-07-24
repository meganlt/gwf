import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function ChatPage() {
  return (
    <main className="flex flex-col h-screen bg-muted">
      <Card className="flex flex-col flex-1 max-w-2xl w-full mx-auto my-6 shadow-lg">
        <CardContent className="flex flex-col flex-1 p-4 space-y-4 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-center">Chat with Diana</h1>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {/* Messages will go here */}
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
