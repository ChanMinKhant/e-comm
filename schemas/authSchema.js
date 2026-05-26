const z = require('zod');

exports.registerSchema = z.object({
  // can accept email address (@ucspyay.edu.mm)
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith('@ucspyay.edu.mm'), {
      message:
        'Email must be a valid email address ending with @ucspyay.edu.mm',
    }),
  password: z.string().min(6),
});

exports.verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

exports.resendOtpSchema = z.object({
  email: z.string().email(),
});

exports.forgotPasswordSchema = z.object({
  email: z.string().email(),
});

exports.resetPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
