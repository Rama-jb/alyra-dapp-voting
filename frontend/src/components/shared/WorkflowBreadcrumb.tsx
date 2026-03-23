'use client'

import React from 'react'
import { WorkflowStatus, WorkflowStatusLabels } from '@/types/voting'
import { CheckCircle2, Clock } from 'lucide-react'

interface BreadcrumbProps {
  currentStatus?: WorkflowStatus
  isLoading?: boolean
}

const STATUS_STEPS = [
  WorkflowStatus.RegisteringVoters,
  WorkflowStatus.ProposalsRegistrationStarted,
  WorkflowStatus.ProposalsRegistrationEnded,
  WorkflowStatus.VotingSessionStarted,
  WorkflowStatus.VotingSessionEnded,
  WorkflowStatus.VotesTallied,
]

export function WorkflowBreadcrumb({ currentStatus, isLoading }: BreadcrumbProps) {
  if (isLoading || currentStatus === undefined) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 rounded-lg border border-slate-800">
        <Clock className="animate-spin" size={16} />
        <span className="text-sm text-slate-400">Chargement...</span>
      </div>
    )
  }

  const currentIndex = STATUS_STEPS.indexOf(currentStatus)

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between px-4 py-3 bg-slate-900 rounded-lg border border-slate-800">
        {STATUS_STEPS.map((status, index) => (
          <React.Fragment key={status}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                  ${
                    index < currentIndex
                      ? 'bg-green-600 text-white'
                      : index === currentIndex
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-slate-700 text-slate-400'
                  }
                `}
              >
                {index < currentIndex ? (
                  <CheckCircle2 size={20} />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs text-center max-w-[80px]
                  ${index === currentIndex ? 'text-blue-400 font-semibold' : 'text-slate-400'}
                `}
              >
                {WorkflowStatusLabels[status]}
              </span>
            </div>

            {/* Connector Line */}
            {index < STATUS_STEPS.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-1 rounded transition-all
                  ${index < currentIndex ? 'bg-green-600' : 'bg-slate-700'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
