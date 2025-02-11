// src/components/deals/DealStageBadge.tsx
import { DealStage } from '@/types/deal';
import { clsx } from 'clsx';

interface DealStageBadgeProps {
  stage: DealStage;
}

const stageConfig = {
  INITIAL_CONTACT: {
    color: 'bg-blue-100 text-blue-800',
    label: 'Contato Inicial'
  },
  NEGOTIATION: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Negociação'
  },
  PROPOSAL: {
    color: 'bg-purple-100 text-purple-800',
    label: 'Proposta'
  },
  CLOSED_WON: {
    color: 'bg-green-100 text-green-800',
    label: 'Ganho'
  },
  CLOSED_LOST: {
    color: 'bg-red-100 text-red-800',
    label: 'Perdido'
  }
};

export function DealStageBadge({ stage }: DealStageBadgeProps) {
  return (
    <span
      className={clsx(
        'px-2 py-1 text-xs font-medium rounded-full',
        stageConfig[stage].color
      )}
    >
      {stageConfig[stage].label}
    </span>
  );
}