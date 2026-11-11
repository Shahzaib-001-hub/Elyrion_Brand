'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faPlus, faCheck, faTrashAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { INITIAL_QUIZ_CONFIG } from '@/lib/mock-data';

export default function AdminMoodsPage() {
  const [quizConfig, setQuizConfig] = useState(INITIAL_QUIZ_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="label-editorial text-[var(--accent-gold)]">Interactive Diagnostic</span>
          <h1 className="font-serif text-3xl font-light mt-1">
            Mood Quiz Architecture & Note Mappings
          </h1>
        </div>
        <button onClick={handleSave} className="btn-gold text-xs py-2">
          <FontAwesomeIcon icon={faSave} className="mr-1.5 w-3 h-3" />
          Save Mapping Rules
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded text-emerald-200 text-xs flex items-center gap-2">
          <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
          <span>Mood quiz algorithm rules updated and applied to live diagnostics!</span>
        </div>
      )}

      {/* Steps Editor */}
      <div className="space-y-6">
        {quizConfig.steps.map((step, sIdx) => (
          <div key={step.stepNumber} className="luxury-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <span className="label-editorial text-[var(--accent-gold)]">
                  Step 0{step.stepNumber} Diagnostic
                </span>
                <h2 className="font-serif text-2xl font-light text-[var(--text-primary)]">
                  {step.question}
                </h2>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">
                {step.options.length} Answer Choices
              </span>
            </div>

            {/* Step Options Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {step.options.map((opt) => (
                <div
                  key={opt.id}
                  className="p-4 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-medium text-[var(--text-primary)]">
                      {opt.label}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--accent-gold)]">#{opt.id}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">{opt.tagline}</p>
                  <div className="space-y-1 pt-1 border-t border-[var(--border-subtle)]">
                    <div className="text-[10px] text-[var(--accent-gold)]">
                      Associated Moods:{' '}
                      <span className="text-[var(--text-primary)]">
                        {opt.associatedMoods?.join(', ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-[var(--accent-gold)]">
                      Key Target Notes:{' '}
                      <span className="text-[var(--text-primary)]">
                        {opt.associatedNotes?.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
