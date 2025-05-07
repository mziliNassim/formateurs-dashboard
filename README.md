# Dashboard de Gestion de Cours

## Description

Ce projet est un dashboard permettant aux formateurs de créer et gérer des cours multimédias (textes, vidéos, images, fichiers PDF, etc.) pour leurs formations. L'application offre une interface intuitive pour ajouter, modifier, organiser et publier des contenus pédagogiques.

## Fonctionnalités

### Authentification & Autorisations

- Accès réservé aux utilisateurs avec le rôle « formateur » ou « administrateur »
- Sécurité via JWT

### Gestion des Cours

- Ajout de cours avec différents formats de contenu (vidéo, texte, image, PDF)
- Éditeur de texte enrichi (WYSIWYG)
- Upload de médias avec aperçu
- Organisation des cours (ordre, modules)
- Gestion des statuts (brouillon/publié)

### Interface Utilisateur

- Liste des cours avec actions (modifier, supprimer, changer l'ordre, dupliquer)
- Recherche et filtres
- Interface responsive (desktop et mobile)
- Design épuré et accessible (WCAG 2.1 niveau AA)

## Stack Technique

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Base de données**: MongoDB
- **Authentification**: JWT

## Structure du Projet

```
/Dashboard
  /client
    /public
    /src
      /components
        /auth
          LoginForm.jsx
          ProtectedRoute.jsx
        /courses
          CourseForm.jsx
          CourseList.jsx
          CourseItem.jsx
          MediaUploader.jsx
          ContentTypeSelector.jsx
        /ui
          Modal.jsx
          DragDropList.jsx
          RichTextEditor.jsx
          FilePreview.jsx
      /pages
        Dashboard.jsx
        Courses.jsx
        AddCourse.jsx
        EditCourse.jsx
      /context
        AuthContext.jsx
        CourseContext.jsx
      /services
        api.js
        authService.js
        courseService.js
      /hooks
        useForm.js
        useMediaUpload.js
      /utils
        validators.js
        helpers.js
      /assets
        /styles
          tailwind.config.js
          global.css
      App.jsx
      main.jsx

  /server
    /config
      db.js
      storage.js
      jwt.js
    /controllers
      authController.js
      courseController.js
      mediaController.js
    /models
      User.js
      Course.js
      Module.js
    /routes
      authRoutes.js
      courseRoutes.js
      mediaRoutes.js
    /middlewares
      authMiddleware.js
      errorMiddleware.js
      uploadMiddleware.js
    /utils
      logger.js
      validationSchemas.js
    app.js
    server.js
  /docs
    API.md
    ERD.md
  .env
  package.json
  README.md
```

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- npm ou yarn

### Installation du Frontend

```bash
cd client
npm install
npm start
```

### Installation du Backend

```bash
cd server
npm install
npm start
```

## Développement

### Variables d'environnement

Créez un fichier `.env` dans le dossier server avec les variables suivantes :

```
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
PORT=5000
NODE_ENV=development
```

## Déploiement

L'application peut être déployée sur n'importe quelle plateforme supportant Node.js et MongoDB.

## Sécurité

- Authentification JWT
- Protection CSRF
- Validation des données côté serveur
- Stockage sécurisé des médias

## Accessibilité

L'interface est conforme aux normes WCAG 2.1 niveau AA pour garantir l'accessibilité à tous les utilisateurs.
