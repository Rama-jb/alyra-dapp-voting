'use client'

import React from 'react'
import { WorkflowStatus, Proposal, VoteResult } from '@/types/voting'
import { useWinningProposal } from '@/hooks/useVoting'
import { Card } from '@/components/ui/card'
import { Trophy, TrendingUp } from 'lucide-react'

interface ResultsProps {
  currentStatus: WorkflowStatus
  proposals: (Proposal & { id: number })[]
}

export function Results({ currentStatus, proposals }: ResultsProps) {
  const { winningId, isLoading: isWinningLoading } = useWinningProposal()

  // Filter out proposal with id 0 (GENESIS)
  const displayProposals = proposals.filter((p) => p.id !== 0)

  // Calculate total votes
  const totalVotes = displayProposals.reduce((sum, p) => sum + Number(p.voteCount), 0)

  // Sort proposals by vote count
  const sortedProposals = [...displayProposals].sort(
    (a, b) => Number(b.voteCount) - Number(a.voteCount)
  )

  // Create results
  const results: VoteResult[] = sortedProposals.map((p) => ({
    proposalId: p.id,
    description: p.description,
    voteCount: p.voteCount,
    percentage: totalVotes > 0 ? (Number(p.voteCount) / totalVotes) * 100 : 0,
  }))

  const shouldShowResults = currentStatus === WorkflowStatus.VotesTallied

  if (!shouldShowResults) {
    return (
      <Card className="p-6 bg-slate-900 border-slate-800">
        <h2 className="text-lg font-semibold mb-4">Résultats</h2>
        <div className="p-4 bg-slate-800 border border-slate-700 rounded text-slate-300">
          ⏳ Les résultats seront disponibles après la comptabilisation des votes
        </div>
      </Card>
    )
  }

  const winningProposal = results[0]

  return (
    <Card className="p-6 bg-slate-900 border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold">Résultats du Scrutin</h2>
        <Trophy size={24} className="text-yellow-500" />
      </div>

      {isWinningLoading ? (
        <div className="text-slate-400">Chargement des résultats...</div>
      ) : (
        <>
          {/* Winner */}
          {winningProposal && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border border-yellow-700/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Trophy size={24} className="text-yellow-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-200 mb-1">🏆 Proposition Gagnante</h3>
                  <p className="text-sm text-yellow-100 mb-2">{winningProposal.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-yellow-300">
                      {Number(winningProposal.voteCount)}
                    </span>
                    <span className="text-sm text-yellow-200">
                      votes ({winningProposal.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All results */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-slate-300 flex items-center gap-2">
              <TrendingUp size={16} />
              Classement Complet
            </h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={result.proposalId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-semibold text-slate-400">#{index + 1}</span>
                      <span className="text-slate-200 truncate">{result.description}</span>
                    </div>
                    <span className="text-slate-300 font-semibold ml-2">
                      {Number(result.voteCount)} votes
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-500 ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                          : index === 1
                            ? 'bg-gradient-to-r from-slate-500 to-slate-400'
                            : index === 2
                              ? 'bg-gradient-to-r from-amber-700 to-amber-600'
                              : 'bg-gradient-to-r from-blue-600 to-blue-500'
                      }`}
                      style={{
                        width: `${result.percentage}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 text-right">
                    {result.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              <p>Total des votes: <span className="font-semibold text-slate-200">{totalVotes}</span></p>
              <p>Propositions: <span className="font-semibold text-slate-200">{displayProposals.length}</span></p>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
