const express = require('express');
const app = express();
const port = 3000;

app.use('/', require('./controller/login-controller'));
app.use('/order', require('./controller/order-controller'));
app.use('/menu', require('./controller/menu-controller'));

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});