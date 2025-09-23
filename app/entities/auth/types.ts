import type { USERS } from '~~/types/users'

export interface AuthStore {
	accessToken: string;
	user: USERS.UserProfile | null;
	isInitialized: boolean;
}