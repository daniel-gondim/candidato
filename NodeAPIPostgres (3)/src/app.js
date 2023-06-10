const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Candidato = require('./candidato');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/candidatos', async (req, res) => {
  const candidatos = await Candidato.findAll();
  res.json(candidatos);
});

app.get('/candidatos/:id', async (req, res) => {
  const candidato = await Candidato.findById(req.params.id);
  if (!candidato) {
    res.status(404).send('Candidato não encontrado');
  } else {
    res.json(candidato);
  }
});

// corrigir rota de candidatos com os parâmetros corretos (eliminar os produtos)
app.post('/candidatos', async (req, res) => {
  const { nome, login, email, senha } = req.body;
  const candidato = new Candidato(null, nome, login, senha, email);
  await candidato.save();
  res.json(candidato);
});

app.put('/candidatos/:id', async (req, res) => {
  const candidato = await Candidato.findById(req.params.id);
  if (!candidato) {
    res.status(404).send('Candidato não encontrado');
  } else {
    const { nome, login, senha, email } = req.body;
    candidato.nome = nome;
    candidato.login = login;
    candidato.senha = senha;
    candidato.email = email;
    await candidato.save();
    res.json(candidato); //200 fica implícito
  }
});

app.delete('/candidatos/:id', async (req, res) => {
  const candidato = await Candidato.findById(req.params.id);
  if (!candidato) {
    res.status(404).send('Candidato não encontrado');
  } else {
    await candidato.delete();
    res.status(204).send('Candidato removido com sucesso');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
