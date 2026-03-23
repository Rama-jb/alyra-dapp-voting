'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from '@/types/voting'

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`
    const newToast: Toast = {
      ...toast,
      id,
    }
    setToasts((prev: Toast[]) => [...prev, newToast])

    if (toast.duration !== 0) {
      const timeout = toast.duration || 3000
      setTimeout(() => {
        removeToast(id)
      }, timeout)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
