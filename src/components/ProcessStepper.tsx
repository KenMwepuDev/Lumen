'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Button } from './Button';
import { Badge } from './Badge';

export interface ProcessField {
  label: ReactNode;
  value?: ReactNode;
  href?: string;
  complete?: boolean;
}

export interface ProcessStep {
  id: string;
  label: string;
  /** Number of required fields considered complete at this step (demo helper). */
  requiredCount?: number;
  fields?: ProcessField[];
  daysInStep?: number;
  daysInProcess?: number;
  help?: ReactNode;
  doneMessage?: ReactNode;
}

export interface ProcessStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  steps: ProcessStep[];
  currentIndex: number;
  onStepChange: (index: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  statusSlot?: ReactNode;
}

export function ProcessStepper({
  steps,
  currentIndex,
  onStepChange,
  prevLabel = '‹ Étape précédente',
  nextLabel = 'Étape suivante ›',
  statusSlot,
  className,
  ...rest
}: ProcessStepperProps) {
  const step = steps[currentIndex];
  const isDone = currentIndex >= steps.length - 1 && step?.doneMessage != null;
  const required = step?.requiredCount ?? step?.fields?.filter((f) => f.complete).length ?? 0;
  const totalFields = step?.fields?.length ?? 0;

  return (
    <div className={cn(className)} {...rest}>
      <div className="cv" role="list" aria-label="Étapes du processus">
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          return (
            <button
              key={s.id}
              type="button"
              className={cn('st', done && 'dn', current && 'cu')}
              role="listitem"
              aria-current={current ? 'step' : undefined}
              onClick={() => onStepChange(i)}
            >
              {done ? '✓ ' : ''}
              {s.label}
              {current && i < steps.length - 1 ? ' (actif)' : ''}
            </button>
          );
        })}
      </div>
      <div style={{ height: 10, background: 'var(--sf)' }} />
      <div
        className="bp"
        aria-live="polite"
        style={isDone ? { gridTemplateColumns: '1fr' } : undefined}
      >
        {isDone ? (
          <div>
            <Badge variant="ok">✓ Terminé</Badge> <b>{step.doneMessage}</b>
          </div>
        ) : (
          <>
            <div>
              {(step?.fields ?? []).slice(0, 3).map((f, i) => (
                <FieldRow key={i} field={f} />
              ))}
            </div>
            <div>
              {(step?.fields ?? []).slice(3, 6).map((f, i) => (
                <FieldRow key={i} field={f} />
              ))}
            </div>
            <div>
              <b>Étape en cours</b>
              <div className="kn">
                {step?.daysInStep ?? 0} <small>jours</small>
              </div>
            </div>
            <div>
              <b>Lead en cours</b>
              <div className="kn">
                {step?.daysInProcess ?? 0} <small>jours</small>
              </div>
            </div>
            <div>
              <b>Aide</b>
              <div className="hint" style={{ fontSize: 13, marginTop: 6 }}>
                {step?.help}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="bf">
        <Button
          variant="text"
          disabled={currentIndex === 0}
          onClick={() => onStepChange(currentIndex - 1)}
        >
          {prevLabel}
        </Button>
        <span className="hint">
          {statusSlot ??
            (currentIndex < steps.length - 1 && totalFields
              ? `${required} sur ${totalFields} champs requis`
              : '')}
        </span>
        <Button
          variant="primary"
          disabled={currentIndex >= steps.length - 1}
          onClick={() => onStepChange(currentIndex + 1)}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

function FieldRow({ field }: { field: ProcessField }) {
  return (
    <div className="fr">
      <span className="k">
        <span className={field.complete ? 'ok' : undefined} aria-hidden="true">
          {field.complete ? '✓' : '○'}
        </span>{' '}
        {field.label}
      </span>
      <span className="v">
        {field.complete ? (
          field.href ? (
            <a href={field.href} onClick={(e) => e.preventDefault()}>
              {field.value}
            </a>
          ) : (
            field.value
          )
        ) : (
          <span style={{ color: 'var(--tx2)', fontWeight: 400 }}>Non renseigné</span>
        )}
      </span>
    </div>
  );
}
