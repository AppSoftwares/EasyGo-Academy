const bcrypt = require('bcryptjs');
const hash = '$2a$10$LToaDSTnu9bCCxxAcYWlte0YGX0bWmXWxSuBvsvwLSWcnnC1GAdma';
bcrypt.compare('123456', hash).then(res => {
  console.log('Match 123456:', res);
});
