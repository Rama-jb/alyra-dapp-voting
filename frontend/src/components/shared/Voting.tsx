'use client'

import React from 'react'
import { WorkflowStatus, Proposal } from '@/types/voting'
import { useVote, useCurrentVoter } from '@/hooks/useVoting'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface VotingProps {
  currentStatus: WorkflowStatus
  proposals: (Proposal & { id: number })[]
  currentUserVotedProposalId?: bigint
  onVotingUpdate?: () => void
}

export function Voting({ currentStatus, proposals, currentUserVotedProposalId, onVotingUpdate }: VotingProps) {
  const { vote, isPending } = useVote()
  const { voter } = useCurrentVoter()

  const canVote = currentStatus === WorkflowStatus.VotingSessionStarted && voter?.isRegistered
  const hasAlreadyVoted = voter?.hasVoted

  const handleVote = async (proposalId: number) => {
    try {
      await vote(proposalId);
      setTimeout(onVotingUpdate, 1000);
    } catch (error) {
      console.error('Erreur lors du vote:', error)
    }
  }

  // Filter out proposal with id 0 (GENESIS)
  const displayProposals = proposals.filter((p) => p.id !== 0)

  if (!voter?.isRegistered) {
    return (
      <Card className="p-6 bg-slate-900 border-slate-800">
        <h2 className="text-lg font-semibold mb-4">Scrutin</h2>
        <div className="p-4 bg-red-900/30 border border-red-700 rounded text-red-200">
          ❌ Vous n&apos;êtes pas enregistré comme électeur
        </div>
      </Card>
    )
  }

  if (currentStatus < WorkflowStatus.VotingSessionStarted) {
    return (
      <Card className="p-6 bg-slate-900 border-slate-800">
        <h2 className="text-lg font-semibold mb-4">Scrutin</h2>
        <div className="p-4 bg-slate-800 border border-slate-700 rounded text-slate-300">
          ⏳ En attente du démarrage de la session de vote
        </div>
      </Card>
    )
  }

  if (currentStatus > WorkflowStatus.VotingSessionStarted) {
    return (
      <Card className="p-6 bg-slate-900 border-slate-800">
        <h2 className="text-lg font-semibold mb-4">Scrutin</h2>
        <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-200">
          ⚠️ La session de vote est terminée
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-slate-900 border-slate-800">
      <h2 className="text-lg font-semibold mb-4">Scrutin</h2>

      {hasAlreadyVoted && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded text-green-200 text-sm flex items-center gap-2">
          <CheckCircle2 size={18} />
          Vous avez déjà voté pour la proposition #{Number(currentUserVotedProposalId)}
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {displayProposals.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Aucune proposition disponible</p>
        ) : (
          displayProposals.map((proposal) => (
            <div
              key={proposal.id}
              className={`p-4 rounded border transition ${
                hasAlreadyVoted && Number(currentUserVotedProposalId) === proposal.id
                  ? 'bg-green-900/20 border-green-700 ring-2 ring-green-600/50'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-400 mb-1">
                    Proposition #{proposal.id}
                  </div>
                  <p className="text-sm text-slate-200 break-words">{proposal.description}</p>
                </div>
                <Button
                  onClick={() => handleVote(proposal.id)}
                  disabled={hasAlreadyVoted || isPending}
                  className={`flex-shrink-0 ${
                    hasAlreadyVoted && Number(currentUserVotedProposalId) === proposal.id
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : hasAlreadyVoted && Number(currentUserVotedProposalId) === proposal.id ? (
                    <>
                      <CheckCircle2 size={16} className="mr-2" />
                      Votre choix
                    </>
                  ) : (
                    'Voter'
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
