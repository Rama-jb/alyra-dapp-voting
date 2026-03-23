'use client'

import React from 'react'
import { WorkflowStatus } from '@/types/voting'
import {
  useStartProposalsRegistering,
  useEndProposalsRegistering,
  useStartVotingSession,
  useEndVotingSession,
  useTallyVotes,
} from '@/hooks/useVoting'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, ChevronRight } from 'lucide-react'

interface AdminActionsProps {
  currentStatus: WorkflowStatus
  onStatusChange: () => void
}

export function AdminActions({ currentStatus, onStatusChange }: AdminActionsProps) {
  const { start: startProposals, isPending: isPendingStartProposals } = useStartProposalsRegistering()
  const { end: endProposals, isPending: isPendingEndProposals } = useEndProposalsRegistering()
  const { start: startVoting, isPending: isPendingStartVoting } = useStartVotingSession()
  const { end: endVoting, isPending: isPendingEndVoting } = useEndVotingSession()
  const { tally, isPending: isPendingTally } = useTallyVotes()

  const handleAction = async (action: () => Promise<void>) => {
    try {
      await action()
      // Refresh status
      setTimeout(onStatusChange, 1000)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const actions: Array<{
    label: string
    condition: boolean
    action: () => Promise<void>
    isPending: boolean
  }> = [
    {
      label: 'Démarrer l\'enregistrement des propositions',
      condition: currentStatus === WorkflowStatus.RegisteringVoters,
      action: startProposals,
      isPending: isPendingStartProposals,
    },
    {
      label: 'Terminer l\'enregistrement des propositions',
      condition: currentStatus === WorkflowStatus.ProposalsRegistrationStarted,
      action: endProposals,
      isPending: isPendingEndProposals,
    },
    {
      label: 'Démarrer la session de vote',
      condition: currentStatus === WorkflowStatus.ProposalsRegistrationEnded,
      action: startVoting,
      isPending: isPendingStartVoting,
    },
    {
      label: 'Terminer la session de vote',
      condition: currentStatus === WorkflowStatus.VotingSessionStarted,
      action: endVoting,
      isPending: isPendingEndVoting,
    },
    {
      label: 'Comptabiliser les votes',
      condition: currentStatus === WorkflowStatus.VotingSessionEnded,
      action: tally,
      isPending: isPendingTally,
    },
  ]

  const availableActions = actions.filter((a) => a.condition)

  return (
    <Card className="p-6 bg-slate-900 border-slate-800">
      <h2 className="text-lg font-semibold mb-4">Administration</h2>

      {availableActions.length === 0 ? (
        <div className="text-slate-400 text-sm">
          {currentStatus === WorkflowStatus.VotesTallied
            ? '✓ Tous les scrutins sont terminés'
            : 'Aucune action disponible'}
        </div>
      ) : (
        <div className="space-y-3">
          {availableActions.map((action, index) => (
            <Button
              key={index}
              onClick={() => handleAction(action.action)}
              disabled={action.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold flex items-center justify-center gap-2 min-h-[44px] py-3 px-4 whitespace-normal break-words text-center"
            >
              {action.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  {action.label}
                  <ChevronRight size={18} />
                </>
              )}
            </Button>
          ))}
        </div>
      )}
    </Card>
  )
}
