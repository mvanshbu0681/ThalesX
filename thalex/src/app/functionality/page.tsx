"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Send,
  Shield,
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  maskedContent?: string;
  sensitiveItems?: string[];
}

const ChatInterface = ({
  title,
  description,
  messages,
  onSendMessage,
  showMasking = false,
  icon: Icon,
  accentColor,
}: {
  title: string;
  description: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  showMasking?: boolean;
  icon: any;
  accentColor: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${accentColor} text-white`}>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-6 h-6" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm opacity-90">{description}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Start a conversation to see the difference</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-foreground"
                }`}
              >
                <p className="text-sm">
                  {showMasking && message.maskedContent && !message.isUser
                    ? message.maskedContent
                    : message.content}
                </p>
                {showMasking &&
                  message.sensitiveItems &&
                  message.sensitiveItems.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {message.sensitiveItems.length} sensitive item(s)
                        protected
                      </p>
                    </div>
                  )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          />
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`px-4 py-2 ${accentColor} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
            whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default function FunctionalityPage() {
  const [withoutMessages, setWithoutMessages] = useState<Message[]>([]);
  const [withMessages, setWithMessages] = useState<Message[]>([]);

  const sampleSensitiveData = [
    "My social security number is 123-45-6789",
    "Please process payment for john.doe@email.com using card 4532-1234-5678-9012",
    "The patient John Smith (DOB: 03/15/1985) needs treatment",
    "Contact me at +1-555-123-4567 or my address 123 Main St, NYC",
    "My account number is ACC-98765432 with PIN 1234",
  ];

  const maskSensitiveData = (content: string) => {
    const patterns = [
      {
        regex: /\b\d{3}-\d{2}-\d{4}\b/g,
        replacement: "***-**-****",
        type: "SSN",
      },
      {
        regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        replacement: "***@***.***",
        type: "Email",
      },
      {
        regex: /\b\d{4}-\d{4}-\d{4}-\d{4}\b/g,
        replacement: "****-****-****-****",
        type: "Credit Card",
      },
      {
        regex: /\b\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
        replacement: "***-***-****",
        type: "Phone",
      },
      {
        regex: /\b\d{1,5}\s\w+\s\w+,?\s\w+\b/g,
        replacement: "*** *** ***, ***",
        type: "Address",
      },
      { regex: /\bACC-\d+\b/g, replacement: "ACC-********", type: "Account" },
      { regex: /\bPIN\s\d+\b/g, replacement: "PIN ****", type: "PIN" },
      {
        regex: /\b\d{2}\/\d{2}\/\d{4}\b/g,
        replacement: "**/**/****",
        type: "Date",
      },
    ];

    let maskedContent = content;
    const detectedItems: string[] = [];

    patterns.forEach((pattern) => {
      if (pattern.regex.test(content)) {
        maskedContent = maskedContent.replace(
          pattern.regex,
          pattern.replacement
        );
        detectedItems.push(pattern.type);
      }
    });

    return { maskedContent, detectedItems };
  };

  const handleWithoutMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: `I can see your message: "${content}". I'll process this information as provided.`,
      isUser: false,
      timestamp: new Date(),
    };

    setWithoutMessages((prev) => [...prev, userMessage, botResponse]);
  };

  const handleWithMessage = (content: string) => {
    const { maskedContent, detectedItems } = maskSensitiveData(content);

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: `I can see your message: "${content}". I'll process this information as provided.`,
      maskedContent: `I can see your message: "${maskedContent}". I'll process this information safely with sensitive data protected.`,
      isUser: false,
      timestamp: new Date(),
      sensitiveItems: detectedItems,
    };

    setWithMessages((prev) => [...prev, userMessage, botResponse]);
  };

  const insertSampleData = () => {
    const randomSample =
      sampleSensitiveData[
        Math.floor(Math.random() * sampleSensitiveData.length)
      ];
    handleWithoutMessage(randomSample);
    handleWithMessage(randomSample);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ x: -2 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </motion.button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold">Interactive Demo</h1>
            </div>

            <motion.button
              onClick={insertSampleData}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Sample Data
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See the Difference in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Compare how traditional AI handles sensitive data versus our
            privacy-preserving approach. Try entering personal information to
            see real-time protection.
          </p>
        </motion.div>

        {/* Split Screen Layout */}
        <div className="grid lg:grid-cols-2 gap-8 h-[600px]">
          {/* Without Utility */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <ChatInterface
              title="Without ThalesX"
              description="Traditional AI chat without privacy protection"
              messages={withoutMessages}
              onSendMessage={handleWithoutMessage}
              showMasking={false}
              icon={AlertTriangle}
              accentColor="bg-red-500"
            />
          </motion.div>

          {/* With Utility */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-full"
          >
            <ChatInterface
              title="With ThalesX"
              description="Privacy-protected AI chat with real-time data masking"
              messages={withMessages}
              onSendMessage={handleWithMessage}
              showMasking={true}
              icon={Shield}
              accentColor="bg-green-500"
            />
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          className="mt-8 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Try These Examples
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground mb-2">
                Personal Information:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Social Security Numbers (123-45-6789)</li>
                <li>• Email addresses (user@domain.com)</li>
                <li>• Phone numbers (+1-555-123-4567)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-muted-foreground mb-2">
                Financial Data:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Credit card numbers (4532-1234-5678-9012)</li>
                <li>• Account numbers (ACC-98765432)</li>
                <li>• Personal addresses (123 Main St, NYC)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
