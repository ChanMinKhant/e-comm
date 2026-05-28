const z = require('zod');

exports.createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z
    .string()
    .min(8, 'Phone is required')
    .max(15, 'Phone must be at most 15 characters'),
  address: z.string().min(1, 'Address is required'),
});
