'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESS } from '@/config'
import { parseAbiItem } from "viem";

// Hook pour récupérer tous les electorates (via les événements)
export function useAllVoters() {
  const publicClient = usePublicClient()
  const [voters, setVoters] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  const loadVoters = useCallback(async () => {
    if (!publicClient || isLoadingRef.current) return
    
    isLoadingRef.current = true
    try {
      setIsLoading(true)

      // Get all VoterRegistered events
      const registeredEvents = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem('event VoterRegistered(address voterAddress)'),
        fromBlock: 0n,  
        toBlock: 'latest'        
      })

      // Get all VoterRemoved events
      const removedEvents = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem('event VoterRemoved(address voterAddress)'),
        fromBlock: 0n,  
        toBlock: 'latest'   
      })

      // Build set of voters (registered minus removed)
      const voterSet = new Set<string>()

      registeredEvents.forEach((event) => {
        const voterAddress = event.args?.voterAddress as string | undefined
        if (voterAddress) {
          voterSet.add(voterAddress.toLowerCase())
        }
      })

      removedEvents.forEach((event) => {
        const voterAddress = event.args?.voterAddress as string | undefined
        if (voterAddress) {
          voterSet.delete(voterAddress.toLowerCase())
        }
      })

      setVoters(
        Array.from(voterSet).map(
          (addr) => '0x' + addr.slice(2)
        )
      )
    } catch (error) {
      console.error('Error loading voters:', error)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [publicClient])

  useEffect(() => {
    if (!hasInitializedRef.current && !isLoading) {
      hasInitializedRef.current = true
      loadVoters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    voters,
    isLoading,
    refetch: loadVoters,
  }
}
