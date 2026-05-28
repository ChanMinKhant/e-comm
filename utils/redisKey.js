const redisKey = {
  // products
  products: 'products',
  product: (id) => `product:${id}`,

  // users
  users: 'users',
  user: (id) => `user:${id}`,
};
module.exports = redisKey;
