'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWandMagicSparkles,
  faArrowRight,
  faArrowLeft,
  faCheck,
  faShoppingBag,
  faRotateRight,
  faStar,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { INITIAL_QUIZ_CONFIG } from '@/lib/mock-data';

interface RankedMatch {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  concentration: string;
  price: number;
  images: string[];
  matchScore: number;
  matchPercentage: number;
  matchingMoods: string[];
}

export default function CreateYourMoodPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    rankedProducts: RankedMatch[];
    topMatch: RankedMatch | null;
    targetMoods: string[];
  } | null>(null);

  const { addItem } = useCart();
  const quizConfig = INITIAL_QUIZ_CONFIG;
  const currentStep = quizConfig.steps[currentStepIndex];

  // Check saved session result on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('elyrion_saved_quiz_result');
      if (saved) {
        setResults(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentStepIndex]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < quizConfig.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasionId: selectedAnswers[0],
          moodId: selectedAnswers[1],
          seasonId: selectedAnswers[2],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
        localStorage.setItem('elyrion_saved_quiz_result', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Quiz submission error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setResults(null);
    setCurrentStepIndex(0);
    setSelectedAnswers({});
    try {
      localStorage.removeItem('elyrion_saved_quiz_result');
    } catch (e) {}
  };

  const canProceed = Boolean(selectedAnswers[currentStepIndex]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[var(--border-gold)] bg-[var(--bg-surface)] text-[var(--accent-gold)] text-xs">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="w-3.5 h-3.5" />
          <span className="label-editorial text-[9px]">Olfactory Profiler</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-light">
          Create Your Fragrance Mood
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
          A bespoke 3-step diagnostic pairing your emotional aura and signature occasion with rare botanical extractions.
        </p>
      </div>

      {/* If results are displayed */}
      {results && results.topMatch ? (
        <div className="space-y-12 animate-fadeIn">
          {/* Top Crown Match Card */}
          <div className="luxury-card p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[var(--bg-surface)] via-[var(--bg-raised)] to-[var(--bg-surface)] border-[var(--accent-gold)] shadow-2xl">
            <div className="absolute top-4 right-4 bg-[var(--accent-gold)] text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
              <FontAwesomeIcon icon={faCrown} className="w-3.5 h-3.5" />
              <span>{results.topMatch.matchPercentage}% Resonance Match</span>
            </div>

            <span className="label-editorial text-[var(--accent-gold)]">Your Signature Olfactory Aura</span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
              {/* Bottle Image */}
              <div className="relative aspect-[4/5] rounded border border-[var(--border-subtle)] overflow-hidden bg-neutral-950">
                <Image
                  src={results.topMatch.images[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800'}
                  alt={results.topMatch.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details & Rationale */}
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--accent-gold)] font-medium">
                    {results.topMatch.concentration} • 50ml Signature Flacon
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-light text-[var(--text-primary)] mt-1">
                    {results.topMatch.name}
                  </h2>
                  <p className="text-xl font-semibold tabular-nums text-[var(--accent-gold)] mt-1">
                    {formatPrice(results.topMatch.price)}
                  </p>
                </div>

                <div className="p-4 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="label-editorial text-[9px] text-[var(--accent-gold)]">Why It Resonates</span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    This creation harmonizes seamlessly with your desired aura of{' '}
                    <strong className="text-[var(--text-primary)]">{results.targetMoods.slice(0, 2).join(' & ')}</strong>.
                    Its key accords of{' '}
                    <span className="text-[var(--accent-gold)]">{results.topMatch.notes.top[0]}</span>,{' '}
                    <span className="text-[var(--accent-gold)]">{results.topMatch.notes.heart[0]}</span>, and{' '}
                    <span className="text-[var(--accent-gold)]">{results.topMatch.notes.base[0]}</span> will project effortless sophistication.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      addItem({
                        id: results.topMatch!._id,
                        slug: results.topMatch!.slug,
                        name: results.topMatch!.name,
                        image: results.topMatch!.images[0],
                        price: results.topMatch!.price,
                        volume: 50,
                        concentration: results.topMatch!.concentration,
                      });
                    }}
                    className="btn-gold btn-shine flex-1"
                  >
                    <FontAwesomeIcon icon={faShoppingBag} className="mr-2 w-3.5 h-3.5" />
                    Claim This Flacon
                  </button>
                  <Link
                    href={`/fragrances/${results.topMatch.slug}`}
                    className="btn-outline-gold text-center"
                  >
                    View Pyramid
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Ranked Matches */}
          {results.rankedProducts.length > 1 && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-light text-center">
                Complementary Olfactory Nuances
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {results.rankedProducts.slice(1, 4).map((alt) => (
                  <div key={alt._id} className="luxury-card p-5 space-y-3">
                    <div className="relative aspect-square rounded overflow-hidden bg-neutral-950">
                      <Image
                        src={alt.images[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400'}
                        alt={alt.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[var(--accent-gold)]">
                        <span>{alt.matchPercentage}% Resonance</span>
                        <span>{alt.concentration}</span>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-[var(--text-primary)]">
                        {alt.name}
                      </h4>
                      <p className="text-xs font-semibold tabular-nums text-[var(--text-primary)]">
                        {formatPrice(alt.price)}
                      </p>
                    </div>
                    <Link
                      href={`/fragrances/${alt.slug}`}
                      className="btn-outline-gold w-full text-xs py-2 text-center"
                    >
                      Inspect Flacon
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Retake Button */}
          <div className="text-center pt-4">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
            >
              <FontAwesomeIcon icon={faRotateRight} className="w-3.5 h-3.5" />
              <span>Retake The Mood Profiler</span>
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Step Questionnaire */
        <div className="luxury-card p-8 sm:p-12 space-y-8 shadow-2xl">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-[var(--text-secondary)]">
              <span className="uppercase tracking-widest text-[10px]">
                Step {currentStepIndex + 1} of {quizConfig.steps.length}
              </span>
              <span className="text-[var(--accent-gold)] font-medium">
                {Math.round(((currentStepIndex + 1) / quizConfig.steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-gold)] transition-all duration-300 ease-out"
                style={{
                  width: `${((currentStepIndex + 1) / quizConfig.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[var(--text-primary)]">
              {currentStep.question}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {currentStep.options.map((option) => {
              const isSelected = selectedAnswers[currentStepIndex] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-6 rounded text-left transition-all relative border flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 ring-1 ring-[var(--accent-gold)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--border-gold)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-lg font-medium text-[var(--text-primary)]">
                      {option.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected
                          ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)] text-black'
                          : 'border-[var(--border-subtle)]'
                      }`}
                    >
                      {isSelected && <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {option.tagline}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1">
                    {option.associatedMoods.map((m, i) => (
                      <span
                        key={i}
                        className="text-[9px] uppercase tracking-wider text-[var(--accent-gold)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)]">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="btn-gold"
            >
              {isSubmitting ? (
                'Analyzing Resonance...'
              ) : currentStepIndex === quizConfig.steps.length - 1 ? (
                <>
                  <span>Reveal My Scent</span>
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="ml-2 w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Proceed</span>
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
