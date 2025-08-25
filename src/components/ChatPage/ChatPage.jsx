import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
} from "../ui/chat/chat-bubble";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessageList } from "../ui/chat/chat-message-list";
import { ChatInput } from "../ui/chat/chat-input";

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "This is from yesterday",
      sender: "bot",
      createdAt: DateTime.now().minus({ days: 1 }).toISO(),
    },
    {
      id: 2,
      message: "Hover me!",
      sender: "user",
      createdAt: DateTime.now().toISO(),
    },
    {
      id: 3,
      message: "Hover me, too!",
      sender: "bot",
      createdAt: DateTime.now().minus({ minutes: 2 }).toISO(),
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const listRef = useRef(null);

  useEffect(() => {
    // autoscroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  function formatTimestamp(isoString) {
    const now = DateTime.now();
    const messageDate = DateTime.fromISO(isoString);
    const isToday = now.hasSame(messageDate, "day");
    return isToday
      ? messageDate.toLocaleString(DateTime.TIME_SIMPLE)
      : messageDate.toLocaleString({ month: "short", day: "numeric" });
  }

  function toChatML(msgs) {
    return msgs
      .filter((m) => !m.isLoading)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.message,
      }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const userMsg = {
      id: Date.now(),
      message: text,
      sender: "user",
      createdAt: DateTime.now().toISO(),
    };
    const loadingMsg = {
      id: Date.now() + 1,
      message: "",
      sender: "bot",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setBusy(true);

    try {
      const payload = { messages: toChatML([...messages, userMsg]) };
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // { content?: string }

      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((m) => m.isLoading);
        const reply = {
          id: idx !== -1 ? copy[idx].id : Date.now(),
          message: data.content ?? "Sorry, I couldn’t generate a response.",
          sender: "bot",
          createdAt: DateTime.now().toISO(),
        };
        if (idx !== -1) copy[idx] = reply;
        else copy.push(reply);
        return copy;
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((m) => m.isLoading);
        if (idx !== -1) {
          copy[idx] = {
            id: copy[idx].id,
            message: "just breathe sister, we're in this together.",
            sender: "bot",
            createdAt: DateTime.now().toISO(),
          };
        }
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  const actionIcons = []; // plug in 

  return (
    <main className="flex flex-col h-screen bg-muted">
      <Card className="flex flex-col flex-1 max-w-2xl w-full mx-auto my-6 shadow-lg">
        <CardContent className="flex flex-col flex-1 p-4 space-y-4 overflow-hidden">
          <h1 className="text-2xl font-semibold text-left bg-primary text-white flex items-center gap-2 p-2 rounded-lg">
            <img src="diana-bubble.png" alt="Diana" width="50" height="60" />
            Diana
          </h1>

          <div
            ref={listRef}
            className="flex-1 space-y-2 overflow-y-auto pr-1"
          >
            <ChatMessageList>
              {messages.map((message, index) => {
                const variant = message.sender === "user" ? "sent" : "received";
                return (
                  <ChatBubble key={message.id} variant={variant}>
                    <Avatar className="size-8">
                      <AvatarImage
                        src={
                          variant === "sent"
                            ? "/avatar-mouse.png"
                            : "/diana-bubble.png"
                        }
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {variant === "sent" ? "US" : "AI"}
                      </AvatarFallback>
                    </Avatar>

                    <ChatBubbleMessage
                      isLoading={message.isLoading}
                      className={
                        message.sender === "user"
                          ? "color-primary"
                          : "color-secondary"
                      }
                    >
                      {message.message}
                    </ChatBubbleMessage>

                    {message.createdAt && (
                      <ChatBubbleTimestamp
                        timestamp={formatTimestamp(message.createdAt)}
                        className={variant === "sent" ? "text-right" : "text-left"}
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
                              "Action " + type + " clicked for message " + index
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

        <form className="flex items-center gap-2 border-t p-4" onSubmit={handleSubmit}>
          <ChatInput
            type="text"
            placeholder="Type your message..."
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
          />
          <Button type="submit" size="icon" disabled={busy || !input.trim()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`size-5 ${busy ? "animate-spin" : ""}`}
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
