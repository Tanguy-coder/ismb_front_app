# 🎓 ISMB App Front

Application frontend de gestion scolaire pour l'ISMB - Interface d'administration moderne et complète pour la gestion académique.

![Angular](https://img.shields.io/badge/Angular-20.0.6-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

---

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Déploiement Docker](#-déploiement-docker)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Contribution](#-contribution)
- [License](#-license)

---

## 🎯 Vue d'ensemble

**ISMB App Front** est une application web moderne de gestion scolaire développée avec Angular 20. Elle offre une interface intuitive et complète pour gérer tous les aspects académiques d'un établissement d'enseignement supérieur.

### Domaine fonctionnel

L'application couvre les domaines suivants :
- 📚 Gestion académique (filières, niveaux, matières, UE)
- 👨‍🎓 Gestion des étudiants et enseignants
- 📝 Gestion des notes (CC, TP, Examen)
- 🆔 Génération de cartes d'étudiant
- 👥 Gestion des utilisateurs et permissions
- 📊 Tableaux de bord et statistiques

---

## ✨ Fonctionnalités

### Gestion Académique
- ✅ **Établissement** : Configuration de l'établissement
- ✅ **Années scolaires** : Gestion des périodes académiques
- ✅ **Niveaux** : Création et gestion des niveaux d'études
- ✅ **Filières** : Gestion des programmes d'études
- ✅ **Matières** : Catalogue des cours
- ✅ **Unités d'Enseignement (UE)** : Modules de formation

### Gestion des Personnes
- ✅ **Étudiants** : Inscription, profils complets avec photos
- ✅ **Enseignants** : Gestion du personnel enseignant
- ✅ **Utilisateurs** : Administration des comptes système

### Gestion des Notes
- ✅ Saisie des notes (CC, TP, Examen)
- ✅ Calcul automatique des moyennes
- ✅ Gestion des sessions (Normale/Rattrapage)
- ✅ Périodes (Harmattan/Mousson)
- ✅ Attribution des mentions

### Fonctionnalités Avancées
- ✅ **Export de données** : PDF et Excel
- ✅ **Cartes d'identité** : Génération automatique
- ✅ **Listes de classe** : Impression et export
- ✅ **Dashboard** : Visualisations et statistiques
- ✅ **Mode sombre** : Interface adaptative
- ✅ **Authentification JWT** : Sécurité renforcée

---

## 🛠️ Technologies

### Core
- **Angular** `20.0.6` - Framework frontend
- **TypeScript** `5.8.3` - Langage fortement typé
- **Tailwind CSS** `4.1.11` - Framework CSS utility-first
- **RxJS** `7.8.0` - Programmation réactive

### Bibliothèques UI
- **ApexCharts** & **amCharts5** - Visualisation de données
- **FullCalendar** - Gestion de calendrier
- **DataTables** - Tables interactives
- **Flatpickr** - Sélecteur de dates
- **Swiper** - Carrousels

### Export & Utilitaires
- **jsPDF** & **jsPDF-autotable** - Génération de PDF
- **xlsx** - Export Excel
- **Prism.js** - Coloration syntaxique

### Déploiement
- **Docker** - Conteneurisation
- **Nginx** - Serveur web et proxy

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** : version 18.x ou supérieure (20.x recommandé)
- **npm** : version 9.x ou supérieure
- **Angular CLI** : version 20.x

```bash
# Installer Angular CLI globalement
npm install -g @angular/cli@20
```

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd ismb_app_front
```

### 2. Installer les dépendances

```bash
npm install
```

> **Note** : Si vous rencontrez des problèmes de dépendances, utilisez :
> ```bash
> npm install --legacy-peer-deps
> ```

### 3. Vérifier l'installation

```bash
npm run ng version
```

---

## ⚙️ Configuration

### Variables d'environnement

Le projet utilise deux fichiers d'environnement :

#### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'  // URL relative - nginx fait le proxy
};
```

#### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

### Configuration de l'API

Les endpoints sont centralisés dans `src/app/config/api.config.ts` :

```typescript
export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    auth: '/auth',
    etudiants: '/etudiants',
    enseignants: '/enseignants',
    // ... autres endpoints
  }
};
```

### Configuration du Proxy (Développement)

Pour le développement local, éditez `proxy.conf.json` :

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

---

## 💻 Utilisation

### Démarrer le serveur de développement

```bash
npm start
# ou
ng serve
```

L'application sera accessible sur **http://localhost:4200**

### Build de production

```bash
npm run build
# ou
ng build
```

Les fichiers compilés seront dans le dossier `dist/ng-tailadmin/browser/`

### Mode Watch (développement)

```bash
npm run watch
```

### Lancer les tests

```bash
npm test
```

---

## 🐳 Déploiement Docker

### Build de l'image Docker

```bash
docker build -t ismb-app-front:latest .
```

### Lancer le conteneur

```bash
docker run -d \
  --name ismb-front \
  -p 80:80 \
  ismb-app-front:latest
```

### Docker Compose (avec backend)

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - ismb-network

  backend:
    image: ismb-backend:latest
    ports:
      - "8080:8080"
    networks:
      - ismb-network

networks:
  ismb-network:
    driver: bridge
```

### Configuration Nginx

Le fichier `nginx.conf` configure :
- ✅ Proxy vers le backend (`/api`, `/uploads`, `/actuator`)
- ✅ Support SPA (Single Page Application)
- ✅ Compression Gzip
- ✅ Cache des assets statiques (30 jours)
- ✅ Health check endpoint (`/healthz`)

---

## 📁 Structure du projet

```
ismb_app_front/
├── src/
│   ├── app/
│   │   ├── config/              # Configuration (API)
│   │   ├── models/              # Modèles de données TypeScript
│   │   │   ├── etudiant.ts
│   │   │   ├── enseignant.ts
│   │   │   ├── filiere.ts
│   │   │   ├── note.ts
│   │   │   └── ...
│   │   ├── services/            # Services Angular
│   │   │   ├── auth.service.ts
│   │   │   ├── etudiant.service.ts
│   │   │   ├── note.service.ts
│   │   │   └── ...
│   │   ├── pages/               # Composants pages
│   │   │   ├── dashboard/
│   │   │   ├── etudiant/
│   │   │   ├── enseignant/
│   │   │   ├── note/
│   │   │   ├── auth-pages/
│   │   │   └── ...
│   │   ├── shared/              # Composants partagés
│   │   │   ├── components/      # Composants réutilisables
│   │   │   ├── layout/          # Layout (sidebar, header)
│   │   │   ├── services/        # Services partagés
│   │   │   └── pipe/            # Pipes personnalisés
│   │   ├── app.component.ts     # Composant racine
│   │   ├── app.config.ts        # Configuration app
│   │   └── app.routes.ts        # Routing
│   ├── environments/            # Variables d'environnement
│   ├── index.html               # Point d'entrée HTML
│   ├── main.ts                  # Bootstrap Angular
│   └── styles.css               # Styles globaux
├── public/                      # Assets statiques
│   ├── images/
│   └── favicon.ico
├── dist/                        # Build de production
├── Dockerfile                   # Configuration Docker
├── nginx.conf                   # Configuration Nginx
├── proxy.conf.json             # Configuration proxy dev
├── angular.json                # Configuration Angular CLI
├── tsconfig.json               # Configuration TypeScript
├── package.json                # Dépendances npm
└── README.md                   # Ce fichier
```

---

## 🔌 API Endpoints

L'application communique avec un backend via les endpoints suivants :

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | Authentification |
| `GET /api/etudiants` | Liste des étudiants |
| `POST /api/etudiants` | Créer un étudiant |
| `GET /api/etudiants/:id` | Détails d'un étudiant |
| `PUT /api/etudiants/:id` | Modifier un étudiant |
| `DELETE /api/etudiants/:id` | Supprimer un étudiant |
| `GET /api/enseignants` | Liste des enseignants |
| `GET /api/filieres` | Liste des filières |
| `GET /api/niveaux` | Liste des niveaux |
| `GET /api/matieres` | Liste des matières |
| `GET /api/ues` | Liste des UE |
| `GET /api/notes` | Liste des notes |
| `GET /api/etablissements` | Informations établissement |
| `GET /api/annees` | Années scolaires |
| `GET /api/roles` | Liste des rôles |
| `GET /api/permissions` | Liste des permissions |

> **Note** : Chaque endpoint suit le pattern REST standard (GET, POST, PUT, DELETE)

---

## 🔐 Authentification

L'application utilise **JWT (JSON Web Token)** pour l'authentification :

1. **Login** : L'utilisateur s'authentifie via `/api/auth/login`
2. **Token** : Le token JWT est stocké dans `localStorage`
3. **Interceptor** : Le token est automatiquement ajouté aux requêtes HTTP
4. **Guard** : Les routes sont protégées par `authGuard`

### Exemple de connexion

```typescript
// Dans votre composant
this.authService.login({
  username: 'admin',
  password: 'password'
}).subscribe({
  next: (response) => {
    // Redirection automatique vers /
  },
  error: (error) => {
    // Gestion de l'erreur
  }
});
```

---

## 🎨 Thème et Personnalisation

### Mode Sombre

L'application supporte le mode sombre natif. Pour activer/désactiver :

```typescript
// Dans votre service de thème
toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}
```

### Couleurs Tailwind

Les couleurs principales sont configurables dans `tailwind.config.js` (à créer si nécessaire).

---

## 📊 Modules Principaux

### 1. Module Étudiant
- Gestion complète du profil étudiant
- Upload de photo
- Assignation à une filière
- Génération de carte d'identité

### 2. Module Notes
- Saisie des notes par UE
- Calcul automatique des moyennes
- Gestion des sessions de rattrapage
- Export des relevés de notes

### 3. Module Enseignant
- Profils des enseignants
- Assignation aux matières/UE

### 4. Module Administration
- Gestion des utilisateurs
- Attribution des rôles et permissions
- Configuration de l'établissement

---

## 🧪 Tests

Le projet utilise Jasmine et Karma pour les tests :

```bash
# Lancer les tests
npm test

# Tests avec couverture
ng test --code-coverage

# Tests en mode watch
ng test --watch
```

Les fichiers de test suivent la convention `*.spec.ts`.

---

## 📈 Performances

### Optimisations implémentées

- ✅ **Lazy Loading** : Chargement différé des modules (ex: Notes)
- ✅ **Build optimization** : Minification, tree-shaking
- ✅ **Nginx caching** : Cache agressif des assets (30 jours)
- ✅ **Gzip compression** : Compression des ressources
- ✅ **Image optimization** : Assets optimisés

### Recommandations supplémentaires

- Utiliser `ChangeDetectionStrategy.OnPush` pour les composants
- Implémenter le virtual scrolling pour les grandes listes
- Utiliser `trackBy` dans les `*ngFor`

---

## 🔧 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur de développement |
| `npm run build` | Build de production |
| `npm run watch` | Build en mode watch |
| `npm test` | Lance les tests unitaires |
| `npm run ng` | Exécute Angular CLI |

---

## 🐛 Dépannage

### Problème : Erreur de dépendances npm

**Solution** :
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Problème : Erreur de proxy en développement

**Solution** : Vérifiez que votre backend tourne sur le port configuré dans `proxy.conf.json`

### Problème : 404 après refresh en production

**Solution** : Vérifiez que votre serveur web (Nginx) est configuré pour le mode SPA avec `try_files $uri $uri/ /index.html;`

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. Créez votre branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Standards de code

- Suivre les conventions Angular
- Utiliser TypeScript strict mode
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les fonctions complexes

---

## 📝 Changelog

### Version 0.0.0 (Actuelle)
- ✨ Gestion complète des étudiants et enseignants
- ✨ Système de notes avec calcul automatique
- ✨ Génération de cartes d'étudiant
- ✨ Authentification JWT
- ✨ Export PDF et Excel
- ✨ Dashboard avec statistiques
- ✨ Mode sombre
- ✨ Déploiement Docker

---

## 📄 License

Ce projet est sous licence [MIT](LICENSE) - voir le fichier LICENSE pour plus de détails.

---

## 👥 Équipe

Développé avec ❤️ par l'équipe ISMB

---

## 📞 Support

Pour toute question ou problème :

- 📧 Email : support@ismb.edu
- 📚 Documentation : [Wiki du projet]
- 🐛 Issues : [GitHub Issues]

---

## 🙏 Remerciements

- [TailAdmin](https://tailadmin.com/) pour le template d'administration
- [Angular](https://angular.dev/) pour le framework
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS
- Tous les contributeurs du projet

---

<div align="center">

**[⬆ Retour en haut](#-ismb-app-front)**

Made with ❤️ using Angular 20 & Tailwind CSS

</div>
