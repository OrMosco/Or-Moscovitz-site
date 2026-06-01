/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, MapPin, Check } from 'lucide-react';

export default function AboutView() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-10 py-4"
    >
      {/* Editorial Title Header */}
      <section className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-[#F43F5E] block font-semibold">
          02 / ABOUT ME
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight" id="about-main-title">
          Hi! I'm Or Moscovitz, and I help make the internet.
        </h1>
        <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 font-mono mt-1">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Haifa, Israel</span>
        </div>
      </section>

      {/* Main Columnized Narrative Bio */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-dashed border-neutral-200 dark:border-neutral-800 py-8">
        {/* Left Side: Photo with real-time vintage layout frame */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="relative aspect-square md:aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
            <img 
              src="https://github.com/OrMosco.png" 
              alt="Or Moscovitz" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
              referrerPolicy="no-referrer" 
            />
            {/* Vintage photog tag accent */}
            <div className="absolute bottom-2 left-2 right-2 bg-neutral-900/95 text-[10px] text-white/95 font-mono px-2 py-1.5 text-center rounded border border-white/10 select-none backdrop-blur-xs">
              Haifa • 2026/06
            </div>
          </div>

          <div className="flex flex-col gap-2.5 font-mono text-xs mt-2 text-neutral-600 dark:text-neutral-400">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">CONTACT METRICS</span>
            <a href="mailto:ormosco41@gmail.com" className="hover:text-rose-500 transition-colors flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>ormosco41@gmail.com</span>
            </a>
            <a href="https://github.com/OrMosco" target="_blank" rel="noreferrer" className="hover:text-rose-500 transition-colors flex items-center gap-2">
              <Github className="w-3.5 h-3.5" />
              <span>github.com/OrMosco</span>
            </a>
          </div>
        </div>

        {/* Center & Right Sides: Story */}
        <div className="md:col-span-2 flex flex-col gap-5 text-neutral-600 dark:text-neutral-400 font-light leading-relaxed font-sans text-sm md:text-base">
          <p>
            I am a software developer and builder. I build tools for the built environment.  I’ve spent most of my career in and around design, architecture, cities, the building sciences, and construction technologies.
          </p>
          <p>
            Over the last decade, I have focused on developing automation and product solutions across the construction, urban planning, and real estate sectors. With a strong emphasis on solving intricate spatial and geometric challenges, I bridge the gap between advanced computational design and modern full-stack environments. My work extends beyond industry applications into academic research; I have worked as a researcher at the Technion and published papers at international conferences dedicated to innovation in the construction industry. I share my passion for the field as a lecturer at the University of Haifa, teaching the next generation how to navigate the intersection of design, architecture, and technology.
          </p>
          <p>
            When I am not writing code or building new technologies, I spend my time surfing, playing beach volleyball, and being with my family.
          </p>
          
          <h4 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50 mt-4">
            How I Think About Creation
          </h4>
          <p className="text-sm font-light">
            I believe code should exist as a silent, aesthetic partner. I dislike bloated structures, tracking metrics, pixel-pushing committees, and gratuitous scrolling frameworks. I build simple, solid visual tools using high-contrast typography, plenty of negative whitespace, and responsive custom layout variables. 
          </p>
        </div>
      </section>

      {/* Staying in the loop form section */}
      <section className="bg-neutral-50 dark:bg-neutral-900/20 p-6 md:p-8 rounded-lg border border-neutral-250 dark:border-neutral-800 flex flex-col gap-6" id="about-stay-in-loop-section">
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-xl font-semibold text-neutral-950 dark:text-neutral-50">
            Stay in the loop
          </h3>
          <p className="font-sans text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-light max-w-xl">
            Occasional dispatches regarding what I am currently making, guitar pedal configurations, and writing essays on developer automation.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@address.com"
            required
            className="flex-grow px-3 py-2 border border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950/40 text-xs md:text-sm text-neutral-900 dark:text-neutral-50 rounded bg-white focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
            id="about-newsletter-input"
          />
          <button
            type="submit"
            disabled={subscribed}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 dark:bg-rose-600 dark:hover:bg-rose-500 text-white rounded text-xs md:text-sm font-mono cursor-pointer transition-colors flex items-center justify-center shrink-0 focus:outline-none"
            id="about-newsletter-btn"
          >
            {subscribed ? <Check className="w-3.5 h-3.5 text-white" /> : 'Subscribe'}
          </button>
        </form>
      </section>
    </motion.div>
  );
}
