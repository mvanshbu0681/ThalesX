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
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  maskedContent?: string;
  sensitiveItems?: string[];
  isLoading?: boolean;
}

// API service functions
const API_BASE_URL = "https://amartyasaran-cape.hf.space";

const apiService = {
  async sendPseudonymizedInput(text: string) {
    const response = await fetch(`${API_BASE_URL}/pseudonymized-input`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("Failed to send pseudonymized input");
    return response.json();
  },

  async getRawOutput() {
    const response = await fetch(`${API_BASE_URL}/raw-output`);
    if (!response.ok) throw new Error("Failed to get raw output");
    return response.json();
  },

  async getPseudonymizedOutput() {
    const response = await fetch(`${API_BASE_URL}/pseudonymized-output`);
    if (!response.ok) throw new Error("Failed to get pseudonymized output");
    return response.json();
  },
};

const ChatInterface = ({
  title,
  description,
  messages,
  onSendMessage,
  showMasking = false,
  icon: Icon,
  accentColor,
  isLoading = false,
}: {
  title: string;
  description: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
  showMasking?: boolean;
  icon: any;
  accentColor: string;
  isLoading?: boolean;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
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
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Processing...</span>
                  </div>
                ) : (
                  <>
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
                  </>
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
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 disabled:opacity-50"
          />
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`px-4 py-2 ${accentColor} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            whileHover={{ scale: inputValue.trim() && !isLoading ? 1.05 : 1 }}
            whileTap={{ scale: inputValue.trim() && !isLoading ? 0.95 : 1 }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default function FunctionalityPage() {
  const [withoutMessages, setWithoutMessages] = useState<Message[]>([]);
  const [withMessages, setWithMessages] = useState<Message[]>([]);
  const [isWithoutLoading, setIsWithoutLoading] = useState(false);
  const [isWithLoading, setIsWithLoading] = useState(false);

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

  const handleWithoutMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setWithoutMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsWithoutLoading(true);

    try {
      // Send input and get raw output
      await apiService.sendPseudonymizedInput(content);
      const rawResponse = await apiService.getRawOutput();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          rawResponse.output ||
          `Raw response: "${content}" - processed without privacy protection.`,
        isUser: false,
        timestamp: new Date(),
      };

      setWithoutMessages((prev) => [...prev.slice(0, -1), botResponse]);
    } catch (error) {
      console.error("Error in without cape chat:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your message.",
        isUser: false,
        timestamp: new Date(),
      };
      setWithoutMessages((prev) => [...prev.slice(0, -1), errorResponse]);
    } finally {
      setIsWithoutLoading(false);
    }
  };

  const handleWithMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setWithMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsWithLoading(true);

    try {
      // Use hardcoded masking
      const { maskedContent, detectedItems } = maskSensitiveData(content);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Original response for: "${content}"`,
        maskedContent: `Privacy-protected response for: "${maskedContent}"`,
        isUser: false,
        timestamp: new Date(),
        sensitiveItems: detectedItems,
      };

      setWithMessages((prev) => [...prev.slice(0, -1), botResponse]);
    } catch (error) {
      console.error("Error in with cape chat:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your message.",
        isUser: false,
        timestamp: new Date(),
      };
      setWithMessages((prev) => [...prev.slice(0, -1), errorResponse]);
    } finally {
      setIsWithLoading(false);
    }
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
              disabled={isWithoutLoading || isWithLoading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              whileHover={{
                scale: !(isWithoutLoading || isWithLoading) ? 1.05 : 1,
              }}
              whileTap={{
                scale: !(isWithoutLoading || isWithLoading) ? 0.95 : 1,
              }}
            >
              {isWithoutLoading || isWithLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Try Sample Data"
              )}
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
            see real-time protection powered by our FastAPI backend.
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
              title="Without CaPE"
              description="Traditional AI chat without privacy protection"
              messages={withoutMessages}
              onSendMessage={handleWithoutMessage}
              showMasking={false}
              icon={AlertTriangle}
              accentColor="bg-red-500"
              isLoading={isWithoutLoading}
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
              title="With CaPE"
              description="Privacy-protected AI chat with real-time data masking"
              messages={withMessages}
              onSendMessage={handleWithMessage}
              showMasking={true}
              icon={Shield}
              accentColor="bg-green-500"
              isLoading={isWithLoading}
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
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Live API Integration:</strong> Messages are now processed
              through our FastAPI backend for real-time pseudonymization and
              privacy protection.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
