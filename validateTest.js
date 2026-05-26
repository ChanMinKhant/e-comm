const z = require('zod');

const PlayerSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

const input = {
  name: 'John Doe',
  age: '30',
  email: 'johndoe@gmail.com',
  role: 'admin',
};

// const result = PlayerSchema.safeParse(input);
// if (!result.success) {
//   console.error(result.error.flatten());
// } else {
//   console.log('Valid player data:', result.data);
// }

try {
  const result = PlayerSchema.parse(input);
  console.log('Valid player data:', result);
} catch (error) {
  console.log(error.flatten());
}
