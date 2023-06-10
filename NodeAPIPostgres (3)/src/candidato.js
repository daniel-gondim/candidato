const pool = require('./database');

  class Candidato {
  constructor(id, nome, login, senha, email) {
    this.id = id;
    this.nome = nome;
    this.login = login;
    this.senha = senha;
    this.email = email;
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM candidatos');
    return rows.map((row) => new Candidato(row.id, row.nome, row.login, row.senha, row.email));
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM candidatos WHERE id = $1', [id]);
    if (rows.length === 0) {
      return null;
    }
    const row = rows[0];
    return new Candidato(row.id, row.nome, row.login, row.senha, row.email);
  }

  async save() {
    if (this.id) {
      await pool.query('UPDATE candidatos SET nome = $1, login = $2 WHERE id = $3', [this.nome, this.login, this.id]);
    } else {
      const { rows } = await pool.query('INSERT INTO candidatos (nome, login) VALUES ($1, $2) RETURNING id', [this.nome, this.login]);
      this.id = rows[0].id;
    }
  }

  async delete() {
    await pool.query('DELETE FROM candidatos WHERE id = $1', [this.id]);
  }
}

module.exports = Candidato;
