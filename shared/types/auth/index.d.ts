import type { USERS } from '~~/shared/types/users'

export declare namespace AUTH {
	interface RegisterRequest {
    email: string
    password: string
    fullname: string
  }

	interface RegisterResponse {
    message: string
  }

  interface LoginRequest {
    email: string
    password: string
  }

	interface LoginResponse {
    user: USERS.UserBase
  }

	interface FetchUserResponse {
		user: USERS.UserBase
	}

  interface VerifyEmailRequest {
    token: string
  }

	interface VerifyEmailResponse {
    message: string
  }

	type UpdateMeParams = Partial<USERS.UserBase>

	interface ChangePasswordResponse {
		message: string
	}

	interface ChangePasswordParams {
		newPass: string;
		oldPass: string;
	}
 
	interface LogoutResponse {
    message: string
  }

  interface ForgotPasswordResponse {
    message: string
  }

  interface ResetPasswordRequest {
    token: string
    newPassword: string
  }

	interface ResetPasswordResponse {
    message: string
  }

  interface RefreshTokenResponse {
    accessToken: string
  }
}