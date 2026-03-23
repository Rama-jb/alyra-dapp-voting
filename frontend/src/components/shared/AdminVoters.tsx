'use client'

import React, { useState } from 'react'
import { WorkflowStatus } from '@/types/voting'
import { useAddVoter, useRemoveVoter, useCurrentVoter } from '@/hooks/useVoting'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Trash2, Plus, CheckCircle2, Loader2 } from 'lucide-react'

interface AdminVotersProps {
  currentStatus: WorkflowStatus
  voters: string[]
  onVotersUpdate: () => void | Promise<void>
}

export function AdminVoters({ currentStatus, voters, onVotersUpdate }: AdminVotersProps) {
  const [inputValue, setInputValue] = useState('')
  const { addVoter, isPending: isAddPending } = useAddVoter()
  const { removeVoter, isPending: isRemovePending } = useRemoveVoter()
  const { voter: currentVoter } = useCurrentVoter()

  const canManageVoters = currentStatus === WorkflowStatus.RegisteringVoters

  const handleAddVoter = async () => {
    if (!inputValue.trim()) return

    if (!/^0x[a-fA-F0-9]{40}$/.test(inputValue)) {
      alert('Adresse invalide')
      return
    }

    try {
      await addVoter(inputValue)
      setInputValue('')
      onVotersUpdate()
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'électeur:', error)
    }
  }

  const handleRemoveVoter = async (address: string) => {
    try {
      await removeVoter(address)
      onVotersUpdate()
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'électeur:', error)
    }
  }

  return (
    <Card className="p-6 bg-slate-900 border-slate-800">
      <h2 className="text-lg font-semibold mb-4">Gestion des Électeurs</h2>

      {!canManageVoters && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-200 text-sm">
          ⚠️ La phase d&apos;enregistrement des électeurs est terminée
        </div>
      )}

      {/* Form to add voter */}
      <div className="mb-6">
        <Label htmlFor="voter-address" className="text-sm mb-2">
          Ajouter un électeur
        </Label>
        <div className="flex gap-2">
          <Input
            id="voter-address"
            placeholder="0x..."
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            disabled={!canManageVoters || isAddPending}
            className="flex-1 bg-slate-800 border-slate-700"
          />
          <Button
            onClick={handleAddVoter}
            disabled={!canManageVoters || isAddPending || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAddPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Ajouter
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Voters list */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-slate-300">
          Électeurs enregistrés ({voters.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {voters.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Aucun électeur enregistré</p>
          ) : (
            voters.map((voter) => (
              <div
                key={voter}
                className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {currentVoter?.isRegistered && voter === voter ? (
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  ) : null}
                  <span className="text-sm text-slate-200 truncate font-mono">{voter}</span>
                </div>
                <button
                  onClick={() => handleRemoveVoter(voter)}
                  disabled={!canManageVoters || isRemovePending}
                  className="ml-2 p-1 text-red-400 hover:text-red-300 disabled:opacity-50 transition flex-shrink-0"
                >
                  {isRemovePending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
