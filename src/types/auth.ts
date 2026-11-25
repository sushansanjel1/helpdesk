export type UserRole = 'customer' | 'admin' | 'manager'

export type UserProfile = {
  id: string
  fullName: string | null
  email: string | null
  role: UserRole
  avatarUrl: string | null
}

export type CSRProfile = {
  id: string
  full_name: string | null
}
