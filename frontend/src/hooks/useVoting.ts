'use client'

import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config'
import { WorkflowStatus, Voter, Proposal, PendingTransaction } from '@/types/voting'
import { useToast } from '@/context/ToastContext'
import { useCallback, useEffect, useState } from 'react'

// Hook pour obtenir le statut du workflow
export function useWorkflowStatus() {
  const { data: status, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'workflowStatus',
  })

  return {
    status: (status as unknown as bigint | undefined) !== undefined ? Number(status) : undefined,
    isLoading,
    refetch,
  }
}

// Hook pour obtenir les informations du voteur courant
export function useCurrentVoter() {
  const { address } = useAccount()
  const { data: voterData, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getVoter',
    args: address ? [address] : undefined,
    account: address,
  })

  const voter: Voter | undefined =
    voterData
      ? {
          isRegistered: (voterData as any).isRegistered ?? false,
          hasVoted: (voterData as any).hasVoted ?? false,
          votedProposalId: BigInt((voterData as any).votedProposalId ?? 0),
        }
      : undefined
  
  return {
    voter,
    isLoading,
    refetch,
  }
}

// Hook pour obtenir une proposition
export function useProposal(proposalId: number) {
  const { data: proposalData, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getOneProposal',
    args: [BigInt(proposalId)],
  })

  const proposal: Proposal | undefined =
    proposalData && typeof proposalData === 'object'
      ? {
          description: (proposalData as any)[0] ?? '',
          voteCount: BigInt((proposalData as any)[1] ?? 0),
        }
      : undefined

  return {
    proposal,
    isLoading,
    refetch,
  }
}

// Hook pour obtenir l'owner du contrat
export function useContractOwner() {
  const { data: owner, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  })

  return {
    owner: owner as `0x${string}` | undefined,
    isLoading,
    refetch,
  }
}

// Hook pour obtenir la proposition gagnante
export function useWinningProposal() {
  const { data: winningId, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'winningProposalID',
  })

  return {
    winningId: winningId !== undefined ? Number(winningId) : undefined,
    isLoading,
    refetch,
  }
}

// Hook pour ajouter un électeur (admin)
export function useAddVoter() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const addVoter = useCallback(
    (address: string) => {
      return new Promise<void>((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'addVoter',
            args: [address as `0x${string}`],
          },
          {
            onSuccess: () => {
              addToast({
                type: 'success',
                message: `Électeur ${address.slice(0, 6)}...${address.slice(-4)} ajouté`,
              })
              resolve()
            },
            onError: (error: any) => {
              addToast({
                type: 'error',
                message: `Erreur: ${error?.message || 'Impossible d\'ajouter l\'électeur'}`,
              })
              reject(error)
            },
          }
        )
      })
    },
    [writeContract, addToast]
  )

  return { addVoter, isPending }
}

// Hook pour retirer un électeur (admin)
export function useRemoveVoter() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const removeVoter = useCallback(
    (address: string) => {
      return new Promise<void>((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'removeVoter',
            args: [address as `0x${string}`],
          },
          {
            onSuccess: () => {
              addToast({
                type: 'success',
                message: `Électeur ${address.slice(0, 6)}...${address.slice(-4)} supprimé`,
              })
              resolve()
            },
            onError: (error: any) => {
              addToast({
                type: 'error',
                message: `Erreur: ${error?.message || 'Impossible de supprimer l\'électeur'}`,
              })
              reject(error)
            },
          }
        )
      })
    },
    [writeContract, addToast]
  )

  return { removeVoter, isPending }
}

// Hook pour ajouter une proposition
export function useAddProposal() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const addProposal = useCallback(
    (description: string) => {
      return new Promise<void>((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'addProposal',
            args: [description],
          },
          {
            onSuccess: () => {
              addToast({
                type: 'success',
                message: 'Proposition enregistrée',
              })
              resolve()
            },
            onError: (error: any) => {
              addToast({
                type: 'error',
                message: `Erreur: ${error?.message || 'Impossible d\'enregistrer la proposition'}`,
              })
              reject(error)
            },
          }
        )
      })
    },
    [writeContract, addToast]
  )

  return { addProposal, isPending }
}

// Hook pour voter
export function useVote() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const vote = useCallback(
    (proposalId: number) => {
      return new Promise<void>((resolve, reject) => {
        writeContract(
          {
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'setVote',
            args: [BigInt(proposalId)],
          },
          {
            onSuccess: () => {
              addToast({
                type: 'success',
                message: 'Vote enregistré',
              })
              resolve()
            },
            onError: (error: any) => {
              addToast({
                type: 'error',
                message: `Erreur: ${error?.message || 'Impossible de voter'}`,
              })
              reject(error)
            },
          }
        )
      })
    },
    [writeContract, addToast]
  )

  return { vote, isPending }
}

// Hook pour start propositions registering (admin)
export function useStartProposalsRegistering() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const start = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      writeContract(
        {
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'startProposalsRegistering',
        },
        {
          onSuccess: () => {
            addToast({
              type: 'success',
              message: 'Enregistrement des propositions commencé',
            })
            resolve()
          },
          onError: (error: any) => {
            addToast({
              type: 'error',
              message: `Erreur: ${error?.message || 'Impossible de démarrer l\'enregistrement'}`,
            })
            reject(error)
          },
        }
      )
    })
  }, [writeContract, addToast])

  return { start, isPending }
}

// Hook pour end propositions registering (admin)
export function useEndProposalsRegistering() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const end = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      writeContract(
        {
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'endProposalsRegistering',
        },
        {
          onSuccess: () => {
            addToast({
              type: 'success',
              message: 'Enregistrement des propositions terminé',
            })
            resolve()
          },
          onError: (error: any) => {
            addToast({
              type: 'error',
              message: `Erreur: ${error?.message || 'Impossible de terminer l\'enregistrement'}`,
            })
            reject(error)
          },
        }
      )
    })
  }, [writeContract, addToast])

  return { end, isPending }
}

// Hook pour start voting session (admin)
export function useStartVotingSession() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const start = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      writeContract(
        {
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'startVotingSession',
        },
        {
          onSuccess: () => {
            addToast({
              type: 'success',
              message: 'Session de vote commencée',
            })
            resolve()
          },
          onError: (error: any) => {
            addToast({
              type: 'error',
              message: `Erreur: ${error?.message || 'Impossible de démarrer la session'}`,
            })
            reject(error)
          },
        }
      )
    })
  }, [writeContract, addToast])

  return { start, isPending }
}

// Hook pour end voting session (admin)
export function useEndVotingSession() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const end = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      writeContract(
        {
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'endVotingSession',
        },
        {
          onSuccess: () => {
            addToast({
              type: 'success',
              message: 'Session de vote terminée',
            })
            resolve()
          },
          onError: (error: any) => {
            addToast({
              type: 'error',
              message: `Erreur: ${error?.message || 'Impossible de terminer la session'}`,
            })
            reject(error)
          },
        }
      )
    })
  }, [writeContract, addToast])

  return { end, isPending }
}

// Hook pour tally votes (admin)
export function useTallyVotes() {
  const { writeContract, isPending } = useWriteContract()
  const { addToast } = useToast()

  const tally = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      writeContract(
        {
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'tallyVotes',
        },
        {
          onSuccess: () => {
            addToast({
              type: 'success',
              message: 'Votes comptabilisés',
            })
            resolve()
          },
          onError: (error: any) => {
            addToast({
              type: 'error',
              message: `Erreur: ${error?.message || 'Impossible de comptabiliser les votes'}`,
            })
            reject(error)
          },
        }
      )
    })
  }, [writeContract, addToast])

  return { tally, isPending }
}

// Hook pour écouter les événements du contrat
export function useVotingEvents(
  onEvent?: (eventName: string, args: any[]) => void
) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    eventName: 'WorkflowStatusChange',
    onLogs: (logs: any) => {
      onEvent?.('WorkflowStatusChange', logs)
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    eventName: 'ProposalRegistered',
    onLogs: (logs: any) => {
      onEvent?.('ProposalRegistered', logs)
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    eventName: 'Voted',
    onLogs: (logs: any) => {
      onEvent?.('Voted', logs)
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    eventName: 'VoterRegistered',
    onLogs: (logs: any) => {
      onEvent?.('VoterRegistered', logs)
    },
  })

  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    eventName: 'VoterRemoved',
    onLogs: (logs: any) => {
      onEvent?.('VoterRemoved', logs)
    },
  })
}
