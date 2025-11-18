import { useBase, createRouter, defineEventHandler } from 'h3'
import * as AuthController from '~~/server/controllers/auth/auth.controller'

const router = createRouter()

// Auth routes
router.post('/auth/register', defineEventHandler(AuthController.register))
router.post('/auth/verify-email', defineEventHandler(AuthController.verifyEmail))
router.post('/auth/resend-verification', defineEventHandler(AuthController.resendVerification))
router.post('/auth/login', defineEventHandler(AuthController.login))
router.post('/auth/forgot-password', defineEventHandler(AuthController.forgotPassword))
router.post('/auth/reset-password', defineEventHandler(AuthController.resetPassword))
router.post('/auth/logout', defineEventHandler(AuthController.logout))
router.get('/auth/me', defineEventHandler(AuthController.fetchUser))
router.put('/auth/update-me', defineEventHandler(AuthController.updateMe))
router.patch('/auth/change-password', defineEventHandler(AuthController.changePassword))

export default useBase('/api', router.handler)