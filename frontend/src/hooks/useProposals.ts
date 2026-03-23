'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config'
import { Proposal } from '@/types/voting'
import { parseAbiItem } from "viem";

// Hook pour récupérer toutes les propositions
export function useAllProposals() {
  const publicClient = usePublicClient()
  const [proposals, setProposals] = useState<(Proposal & { id: number })[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [maxProposalId, setMaxProposalId] = useState(0)
  const isLoadingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  const loadProposals = useCallback(async () => {
    if (!publicClient || isLoadingRef.current) return

    isLoadingRef.current = true
    try {
      setIsLoading(true)

      // Get past ProposalRegistered events to know the count
      const events = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem('event ProposalRegistered(uint proposalId)'),
        fromBlock: 0n,  
        toBlock: 'latest'
      })

      // The proposalId in ProposalRegistered is the index
      const lastEvent = events[events.length - 1]
      const eventBasedCount = lastEvent ? Number(lastEvent.args?.proposalId || 0) + 1 : 0

      if (eventBasedCount === 0) {
        setProposals([])
        return
      }

      setMaxProposalId(eventBasedCount - 1)

      // Fetch all proposals
      const loadedProposals: (Proposal & { id: number })[] = []

      for (let i = 1; i < eventBasedCount; i++) {
        try {
          const proposal = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getOneProposal',
            args: [BigInt(i)],
          })

          if (proposal && typeof proposal === 'object') {
            loadedProposals.push({
              id: i,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              description: (proposal as any).description || '',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              voteCount: BigInt((proposal as any).voteCount || 0),
            })
          }
        } catch (error) {
          console.error(`Error loading proposal ${i}:`, error)
        }
      }

      setProposals(loadedProposals)
    } catch (error) {
      console.error('Error loading proposals:', error)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [publicClient])

  useEffect(() => {
    if (!hasInitializedRef.current && !isLoading) {
      hasInitializedRef.current = true
      loadProposals()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    proposals,
    isLoading,
    maxProposalId,
    refetch: loadProposals,
  }
}

// Hook pour surveiller les changements de propositions via événements
export function useProposalsUpdates(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAdd?: (proposalId: number) => void
) {
  useEffect(() => {
    // Vous pourriez implémenter ici un système de polling ou de WebSocket
    // Pour maintenant, les événements sont écoutés via useVotingEvents
  }, [])
}
