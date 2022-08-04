import { Owner } from "components/treasury/create/CreateTreasury"

export interface Treasury {
  id: string
  safe_name: string
  multisig_vault: string
  owners: Owner[]
}

export interface TreasuryState {
  loading: boolean
  treasuries: Treasury[]
  error: string
}

export interface FetchTreasuryProps {
  address: string
  name: string
}
