'use client'

import { store } from '@/store'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'

interface ReduxProviderProps {
  children: ReactNode
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>
}