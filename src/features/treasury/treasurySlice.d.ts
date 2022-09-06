interface Owner {
  id: number
  role: string
  wallet_address: string
  name: string
}

export interface Treasury {
  id: number
  archived: boolean
  owners: Owner[]
  name: string
  treasury_address: string
  transaction_hash: string
  treasury_escrow: string
  uuid: string
  min_confirmations: number
}

export interface TreasuryState {
  loading: boolean
  treasuries: {
    count: number
    next: string | null
    previous: string | null
    results: Treasury[]
  }
  error: string
  activeTreasury: Treasury | null
  updating: boolean
  updatingError: string
  archiving: boolean
  archiveError: string
}

export interface UpdateTreasuryProps {
  uuid: string
  name?: string
  archived?: boolean
  callback?: () => void
}
export interface UpdateTreasuryResponse {
  data: { name: string; archived: boolean }
  uuid: string
}

interface CreateTreasuryDataProps {
  owners: {
    name: string
    wallet_address: string
  }[]
  name: string
  min_confirmations: number
  treasury_address: string
  treasury_escrow: string
  transaction_hash: string
}

export interface CreateTreasuryProps {
  data: CreateTreasuryDataProps
  callback: () => void
}
