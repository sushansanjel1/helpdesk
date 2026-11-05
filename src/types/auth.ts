export type UserRole = 'customer' | 'admin' | 'manager'

export interface UserProfile {
  id: string
  fullName: string | null
  role: UserRole
  avatarUrl: string | null
}
