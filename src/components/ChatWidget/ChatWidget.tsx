'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { generateResponse, QUICK_SUGGESTIONS, ChatResponse } from '@/lib/festivalSearch';
import FestivalCard from '@/components/FestivalCard/FestivalCard';
import styles from './ChatWidget.module.css';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  festivals?: import('@/data/festivals').Festival[];
  suggestions?: string[];
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! Looking for your next festival? 🎪\n\nI'm your AI Festival Assistant. I can search through our fictional demo dataset of 12 made-up festivals scheduled for 2027. Ask me anything!",
  suggestions: [
    'Find festivals near me',
    'Explore techno festivals',
    'Find festivals by artist',
    'Compare festivals',
  ],
  timestamp: new Date(),
};

function formatMessageContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    // Bold text: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return (
      <span key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Message ID counter
  const msgIdCounter = useRef(1);
  const getNextId = useCallback((prefix: string) => {
    msgIdCounter.current += 1;
    return `${prefix}-${msgIdCounter.current}`;
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Keep input & messages visible when mobile virtual keyboard opens
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const handleViewportResize = () => {
      if (isOpen) {
        scrollToBottom();
      }
    };
    window.visualViewport.addEventListener('resize', handleViewportResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, [isOpen, scrollToBottom]);

  const addAssistantMessage = useCallback((response: ChatResponse) => {
    const msg: Message = {
      id: getNextId('msg'),
      role: 'assistant',
      content: response.message,
      festivals: response.festivals,
      suggestions: response.suggestions,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setIsTyping(false);
  }, [getNextId]);

  const handleSend = useCallback((text?: string) => {
    const query = (text ?? input).trim();
    if (!query) return;

    const userMessage: Message = {
      id: getNextId('user'),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Controlled delay
    const delay = 650;
    setTimeout(() => {
      let response: ChatResponse;

      // Check quick suggestions first
      if (QUICK_SUGGESTIONS[query]) {
        response = QUICK_SUGGESTIONS[query]();
      } else {
        response = generateResponse(query);
      }

      addAssistantMessage(response);
    }, delay);
  }, [input, getNextId, addAssistantMessage]);

  const handleSendRef = useRef(handleSend);
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      setIsOpen(true);
      setHasUnread(false);
      if (customEvent.detail?.query) {
        const query = customEvent.detail.query;
        setTimeout(() => {
          handleSendRef.current(query);
        }, 120);
      }
    };
    window.addEventListener('open-festival-chat', handleOpenChat);
    return () => {
      window.removeEventListener('open-festival-chat', handleOpenChat);
    };
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleToggle() {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setHasUnread(false);
      }
      return next;
    });
  }

  function handleSuggestion(suggestion: string) {
    handleSend(suggestion);
  }

  return (
    <>
      {/* Floating button */}
      <button
        id="chat-toggle-btn"
        className={`${styles.floatBtn} ${isOpen ? styles.floatBtnOpen : ''}`}
        onClick={handleToggle}
        aria-label={isOpen ? 'Close chat assistant' : 'Open Festival AI Assistant'}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
      >
        <span className={styles.floatBtnIcon} aria-hidden="true">
          {isOpen ? (
            '✕'
          ) : (
            <Image
              src="/logo.png"
              alt="That Festival Site AI"
              width={38}
              height={38}
              className={styles.floatBtnImg}
            />
          )}
        </span>
        {!isOpen && hasUnread && (
          <span className={styles.unreadDot} aria-label="New messages" />
        )}
        {!isOpen && (
          <span className={styles.floatBtnPulse} aria-hidden="true" />
        )}
      </button>

      {/* Chat panel */}
      <div
        id="chat-panel"
        role="dialog"
        aria-label="Festival AI Assistant Chat"
        aria-modal="false"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar} aria-hidden="true">
              <Image
                src="/logo.png"
                alt="That Festival Site"
                width={36}
                height={36}
                className={styles.headerLogoImg}
              />
            </div>
            <div>
              <div className={styles.headerTitle}>That Festival Site AI</div>
              <div className={styles.headerSub}>
                <span className={styles.statusDot} aria-hidden="true" />
                Online
              </div>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleToggle}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Disclaimer banner */}
        <div className={styles.disclaimer} role="note">
          ⚠️ <strong>Demo only.</strong> All festivals, artists & data are entirely fictional.
        </div>

        {/* Messages */}
        <div
          className={styles.body}
          ref={chatBodyRef}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
            >
              {msg.role === 'assistant' && (
                <div className={styles.msgAvatar} aria-hidden="true">
                  <Image
                    src="/logo.png"
                    alt="That Festival Site"
                    width={26}
                    height={26}
                    className={styles.msgAvatarImg}
                  />
                </div>
              )}
              <div className={styles.msgContent}>
                <div className={styles.msgBubble}>
                  {formatMessageContent(msg.content)}
                </div>

                {/* Festival cards */}
                {msg.festivals && msg.festivals.length > 0 && (
                  <div className={styles.festivalResults}>
                    {msg.festivals.map((festival, idx) => (
                      <FestivalCard key={festival.id} festival={festival} index={idx} />
                    ))}
                  </div>
                )}

                {/* Suggestion chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className={styles.suggestions} role="list" aria-label="Suggested queries">
                    {msg.suggestions.map((s) => (
                      <button
                        key={s}
                        role="listitem"
                        className={styles.suggestionChip}
                        onClick={() => handleSuggestion(s)}
                        aria-label={`Suggested: ${s}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={styles.msgAvatar} aria-hidden="true">
                <Image
                  src="/logo.png"
                  alt="That Festival Site"
                  width={26}
                  height={26}
                  className={styles.msgAvatarImg}
                />
              </div>
              <div className={styles.msgContent}>
                <div className={`${styles.msgBubble} ${styles.typingBubble}`} aria-label="Assistant is typing">
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.dot} aria-hidden="true" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={styles.inputArea}>
          <label htmlFor="chat-input" className="sr-only">
            Type your festival question
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about genres, locations, artists…"
            aria-label="Type your festival question"
            autoComplete="off"
            disabled={isTyping}
          />
          <button
            id="chat-send-btn"
            className={styles.sendBtn}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
