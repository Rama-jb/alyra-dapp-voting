'use client'

import React, { useEffect, useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { useWorkflowStatus, useContractOwner, useVotingEvents, useCurrentVoter } from '@/hooks/useVoting'
import { useAllProposals } from '@/hooks/useProposals'
import { useAllVoters } from '@/hooks/useVoters'
import { WorkflowStatus, Proposal } from '@/types/voting'
import { WorkflowBreadcrumb } from './WorkflowBreadcrumb'
import { AdminVoters } from './AdminVoters'
import { AdminActions } from './AdminActions'
import { Proposals } from './Proposals'
import { Voting } from './Voting'
import { Results } from './Results'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoaderIcon } from 'lucide-react'

interface VotingAppLayoutProps {
  onlyVoters?: boolean
}

export function VotingAppLayout({ onlyVoters }: VotingAppLayoutProps) {
  const { address } = useAccount()
  const { status, isLoading, refetch } = useWorkflowStatus()
  const { owner } = useContractOwner()
  const { voter } = useCurrentVoter()
  const { proposals, isLoading: isProposalsLoading, refetch: refetchProposals } = useAllProposals()
  const { voters, isLoading: isVotersLoading, refetch: refetchVoters } = useAllVoters()  

  // Listen to contract events
  useVotingEvents((eventName, logs) => {
    if (eventName === 'WorkflowStatusChange' || eventName === 'ProposalRegistered' || eventName === 'VoterRegistered' || eventName === 'VoterRemoved') {
      // Refresh data after a short delay to allow contract to update
      setTimeout(() => {
        refetch()
        if (eventName === 'ProposalRegistered') {
          refetchProposals()
        }
        if (eventName === 'VoterRegistered' || eventName === 'VoterRemoved') {
          refetchVoters()
        }
      }, 1000)
    }
  })

  const isAdmin = address?.toLowerCase() === owner?.toLowerCase()

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  if (isLoading || status === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoaderIcon className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-slate-400">Chargement de l&apos;application...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vote Décentralisé</h1>
          <p className="text-slate-400 mt-1">Adresse: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        </div>
        <div className="space-y-1 text-right">
          {isAdmin && <Badge className="bg-purple-600">Administrateur</Badge>}
          {voter?.isRegistered && <Badge className="bg-green-600">Électeur</Badge>}
        </div>
      </div>

      {/* Workflow Breadcrumb */}
      <WorkflowBreadcrumb currentStatus={status} isLoading={false} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admin Voters Section */}
          {isAdmin && (
            <AdminVoters
              currentStatus={status}
              voters={voters as string[]}
              onVotersUpdate={refetchVoters}
            />
          )}

          {/* Proposals Section */}
          <Proposals
            currentStatus={status}
            proposals={proposals}
            onProposalsUpdate={refetchProposals}
          />

          {/* Voting Section */}
          {/* On doit faire un refresh une fois que le vote est enregistré */}

          {voter?.isRegistered && (
            <Voting
              currentStatus={status}
              proposals={proposals}
              currentUserVotedProposalId={voter?.votedProposalId}
              onVotingUpdate={refetchProposals}
            />
          )}

          {/* Results Section */}
          {status === WorkflowStatus.VotesTallied && (
            <Results
              currentStatus={status}
              proposals={proposals}
            />
          )}
        </div>

        {/* Right Column - Admin Actions */}
        {isAdmin && (
          <div className="lg:col-span-1 space-y-">
            <AdminActions
              currentStatus={status}
              onStatusChange={handleRefresh}
            />
          </div>
        )}
      </div>

      {/* Not Connected / Not Voter Warning */}
      {!voter?.isRegistered && !isAdmin && (
        <Card className="p-4 bg-yellow-900/20 border border-yellow-700 text-yellow-200">
          <p className="text-sm">
            ⚠️ Vous n&apos;êtes pas enregistré comme électeur. Contactez l&apos;administrateur pour être ajouté à la liste des électeurs.
          </p>
        </Card>
      )}
    </div>
  )
}
