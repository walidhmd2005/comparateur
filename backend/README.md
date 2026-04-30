# Backend Comparateur

API Node.js/Express pour le comparateur d'energie.

## Installation

```bash
npm install
```

## Configuration

Copier `.env.example` vers `.env`, puis renseigner les variables MySQL, JWT et email.

## Base de donnees

Les scripts SQL sont dans `database/` :

- `schema.sql` pour creer les tables
- `seed.sql` pour inserer les donnees de depart

## Lancement

```bash
npm run dev
```

Le serveur utilise `PORT` depuis `.env` et expose notamment :

- `GET /health`
- `/api/auth`
- `/api/offers`
- `/api/compare`
- `/api/history`
- `/api/admin`

## Tests

```bash
npm test
```
