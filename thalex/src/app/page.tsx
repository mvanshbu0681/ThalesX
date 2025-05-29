"use client";

import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  ArrowRight,
  ChevronDown,
  Brain,
  Database,
  Settings,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

const AnimatedCounter = ({
  end,
  duration = 2,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min(
        (currentTime - startTime) / (duration * 1000),
        1
      );

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
};

const ArchitectureStep = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: any;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
    <p className="text-muted-foreground text-center text-sm">
      {description}
    </p>
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "10%", left: "10%" }}
          />
          <motion.div
            className="absolute w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 100, 0],
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ bottom: "10%", right: "10%" }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Secure Your AI
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Protect sensitive data in LLM interactions with enterprise-grade
              privacy technology. Prevent PII leakage while maintaining AI
              functionality.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/functionality">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 flex items-center gap-2 glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See How It Works
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-foreground font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Hidden Risk
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Organizations are unknowingly exposing sensitive data through AI
              interactions, creating compliance risks and security vulnerabilities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Data Exposure</h3>
              <p className="text-muted-foreground">
                PII, financial data, and confidential information leak through AI
                prompts, creating regulatory and business risks.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Compliance Violations</h3>
              <p className="text-muted-foreground">
                GDPR, HIPAA, and other regulations require strict data protection
                that traditional AI solutions cannot guarantee.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lost Productivity</h3>
              <p className="text-muted-foreground">
                Teams avoid AI tools due to security concerns, missing
                productivity gains and competitive advantages.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Architecture */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Solution</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced privacy-preserving architecture that secures data while
              maintaining AI functionality
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ArchitectureStep
              icon={Filter}
              title="NER Detection"
              description="Advanced named entity recognition identifies sensitive data patterns in real-time"
              delay={0.1}
            />
            <ArchitectureStep
              icon={Brain}
              title="Context Classification"
              description="AI-powered context analysis determines data sensitivity and handling requirements"
              delay={0.2}
            />
            <ArchitectureStep
              icon={Settings}
              title="Policy Engine"
              description="Configurable privacy policies enforce data protection rules and compliance requirements"
              delay={0.3}
            />
            <ArchitectureStep
              icon={Shield}
              title="Pseudonymization"
              description="Intelligent data masking preserves utility while protecting sensitive information"
              delay={0.4}
            />
          </div>

          {/* Flow Animation */}
          <motion.div
            className="relative mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <motion.div
                className="w-4 h-4 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.div
                className="w-4 h-4 bg-purple-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </div>
            <div className="flex justify-between mt-4 text-sm text-muted-foreground">
              <span>Raw Data Input</span>
              <span>Protected Output</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Measurable Impact
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results for enterprise security and compliance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="text-5xl font-bold text-green-600 mb-2">
                <AnimatedCounter end={99} />%
              </div>
              <p className="text-lg font-semibold mb-2">PII Detection Rate</p>
              <p className="text-muted-foreground">
                Industry-leading accuracy in identifying sensitive data patterns
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-5xl font-bold text-blue-600 mb-2">
                <AnimatedCounter end={75} />%
              </div>
              <p className="text-lg font-semibold mb-2">Risk Reduction</p>
              <p className="text-muted-foreground">
                Significant decrease in data exposure incidents and compliance
                violations
              </p>
            </motion.div>

            <motion.div
              className="text-center p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="text-5xl font-bold text-purple-600 mb-2">
                <AnimatedCounter end={40} />%
              </div>
              <p className="text-lg font-semibold mb-2">Productivity Gain</p>
              <p className="text-muted-foreground">
                Teams confidently adopt AI tools with built-in privacy protection
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Secure Your AI?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Experience the difference with our interactive demo. See how our
              technology protects sensitive data while maintaining AI
              functionality.
            </p>

            <Link href="/functionality">
              <motion.button
                className="px-12 py-6 bg-white text-blue-600 font-bold rounded-full text-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Interactive Demo
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
