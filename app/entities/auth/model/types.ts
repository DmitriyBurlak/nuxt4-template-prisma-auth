import type { USERS } from '~~/shared/types/users'

export interface AuthStore {
	accessToken: string;
	user: USERS.UserBase | null;
	isInitialized: boolean;
}