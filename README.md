# BioBooks — Site de vente de livres de biologie

Site web moderne, responsive et multilingue (Arabe, Français, Anglais) pour la vente de livres de biologie et d'analyses médicales, optimisé pour Facebook Ads.

## Fonctionnalités

- Landing page complète avec 10 sections
- Multilingue AR / FR / EN avec support RTL pour l'arabe
- Formulaire de commande avec validation
- Calcul automatique des prix (1600 DA/pack + 400 DA livraison)
- Panneau d'administration (commandes, statuts, export Excel)
- Base de données MySQL
- Bouton WhatsApp flottant
- Animations modernes (Framer Motion)
- SEO optimisé (meta tags Open Graph)

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+

## Installation

### 1. Base de données

```bash
mysql -u root -p < backend/database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Modifier .env avec vos identifiants MySQL
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le site démarre sur `http://localhost:5173`

## Configuration

### Backend (.env)

| Variable | Description | Défaut |
|----------|-------------|--------|
| DB_HOST | Hôte MySQL | localhost |
| DB_USER | Utilisateur MySQL | root |
| DB_PASSWORD | Mot de passe MySQL | (vide) |
| DB_NAME | Nom de la base | biobooks |
| ADMIN_PASSWORD | Mot de passe admin | admin123 |
| JWT_SECRET | Clé secrète JWT | change-this... |
| PORT | Port du serveur | 3001 |

### Personnalisation

- **Liens sociaux** : `frontend/src/utils/constants.js` (Messenger, Facebook)
- **Numéros WhatsApp** : déjà configurés (0674790645, 0557345457)
- **Images** : remplacer les SVG dans `frontend/public/images/` par vos photos réelles
- **Prix** : modifier `PRICE_PER_PACK` et `DELIVERY_FEE` dans `constants.js`

## Administration

Accédez au panneau admin : `http://localhost:5173/admin`

- Mot de passe par défaut : `admin123`
- Voir toutes les commandes
- Modifier le statut (en attente, confirmée, expédiée, livrée, annulée)
- Supprimer une commande
- Exporter en Excel

## Production

```bash
# Build frontend
cd frontend
npm run build

# Le dossier dist/ contient les fichiers statiques
# Servir avec nginx ou configurer Express pour servir le build
```

## Structure du projet

```
Site_web/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/   # Composants de la landing page
│   │   ├── i18n/         # Traductions AR/FR/EN
│   │   ├── pages/        # Page Admin
│   │   └── utils/        # Constantes et configuration
│   └── public/images/    # Images du produit
├── backend/           # Express + MySQL
│   ├── routes/           # API commandes et admin
│   ├── database/         # Schéma SQL
│   └── middleware/       # Authentification JWT
└── README.md
```

## Pages

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/admin` | Panneau d'administration |

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/orders` | Créer une commande |
| POST | `/api/admin/login` | Connexion admin |
| GET | `/api/admin/orders` | Liste des commandes |
| PATCH | `/api/admin/orders/:id/status` | Modifier le statut |
| DELETE | `/api/admin/orders/:id` | Supprimer une commande |
| GET | `/api/admin/orders/export` | Export Excel |
