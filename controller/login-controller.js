require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { loginSchema } = require('../validation/loginValidation');

const router = express.Router();
const secretKey = process.env.SECRET;

router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.id, username: user.login }, secretKey, {
      expiresIn: '8h',
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

router.post('/register', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { username, password } = req.body;

  try {
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
          return res.status(400).json({ error: 'Usuário já existe' });
      }

      const newUser = await User.createUser(username, password);
      res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
  } catch (err) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

module.exports = router;
