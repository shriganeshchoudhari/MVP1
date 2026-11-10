import { z } from 'zod';

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  userId: z.string(),
  expiresIn: z.number().optional(),
  message: z.string().optional(),
});

export const OtpVerificationSchema = z.object({
  verified: z.boolean(),
  sessionId: z.string().optional(),
  message: z.string().optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type OtpVerificationResponse = z.infer<typeof OtpVerificationSchema>;
