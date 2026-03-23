'use client'

import React, { useState } from 'react'
import { WorkflowStatus, Proposal } from '@/types/voting'
import { useAddProposal } from '@/hooks/useVoting'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Plus, Loader2 } from 'lucide-react'

interface ProposalsProps {
  currentStatus: WorkflowStatus
  proposals: (Proposal & { id: number })[]
  onProposalsUpdate?: () => void | Promise<void>
}

export function Proposals({ currentStatus, proposals, onProposalsUpdate }: ProposalsProps) {
  const [inputValue, setInputValue] = useState('')
  const { addProposal, isPending } = useAddProposal()

  const canAddProposals = currentStatus === WorkflowStatus.ProposalsRegistrationStarted

  const handleAddProposal = async () => {
    if (!inputValue.trim()) return

    try {
      await addProposal(inputValue)
      setInputValue('')
      // La mise à jour se fera via l'event listener
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la proposition:', error)
    }
  }

  // Filter out proposal with id 0 (GENESIS)
  const displayProposals = proposals.filter((p) => p.id !== 0)

  return (
    <Card className="p-6 bg-slate-900 border-slate-800">
      <h2 className="text-lg font-semibold mb-4">Propositions</h2>

      {!canAddProposals && currentStatus < WorkflowStatus.ProposalsRegistrationStarted && (
        <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded text-slate-300 text-sm">
          ⏳ En attente du démarrage de la phase d&apos;enregistrement des propositions
        </div>
      )}

      {!canAddProposals && currentStatus > WorkflowStatus.ProposalsRegistrationStarted && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-200 text-sm">
          ⚠️ La phase d&apos;enregistrement des propositions est terminée
        </div>
      )}

      {/* Form to add proposal */}
      {canAddProposals && (
        <div className="mb-6">
          <Label htmlFor="proposal-desc" className="text-sm mb-2">
            Ajouter une proposition
          </Label>
          <div className="flex gap-2">
            <Input
              id="proposal-desc"
              placeholder="Description de votre proposition..."
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              disabled={isPending}
              className="flex-1 bg-slate-800 border-slate-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isPending && inputValue.trim()) {
                  handleAddProposal()
                }
              }}
            />
            <Button
              onClick={handleAddProposal}
              disabled={isPending || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Proposer
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Proposals list */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-slate-300">
          Propositions enregistrées ({displayProposals.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {displayProposals.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              {currentStatus < WorkflowStatus.ProposalsRegistrationStarted
                ? 'En attente des propositions...'
                : 'Aucune proposition enregistrée'}
            </p>
          ) : (
            displayProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="p-3 bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-400 mb-1">
                      #{proposal.id}
                    </div>
                    <p className="text-sm text-slate-200 break-words">{proposal.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-2 py-1 bg-blue-600/20 border border-blue-600/50 rounded text-blue-200 text-xs font-semibold">
                      {Number(proposal.voteCount)} votes
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
