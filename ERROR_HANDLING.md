# Système de Gestion d'Erreurs - ISMB App

## 📋 Vue d'ensemble

Le système de gestion d'erreurs a été complètement refactorisé pour offrir une meilleure expérience utilisateur et faciliter la maintenance du code.

## 🏗️ Architecture

### 1. **Intercepteur HTTP** (`auth.interceptor.ts`)
L'intercepteur centralise deux fonctionnalités principales :
- **Ajout automatique du token JWT** : Toutes les requêtes HTTP incluent automatiquement le header `Authorization: Bearer {token}`
- **Gestion des erreurs 401** : Déconnexion automatique et redirection vers `/signin` en cas d'erreur d'authentification

### 2. **Service de gestion d'erreurs** (`handle-errors.service.ts`)
Service amélioré qui :
- Extrait intelligemment les messages d'erreur du backend
- Gère les erreurs de validation (422) avec formatage des champs
- Supporte plusieurs formats de réponse d'erreur
- Affiche des notifications appropriées selon le type d'erreur
- Retourne des objets d'erreur structurés avec détails

#### Formats d'erreur supportés :
```typescript
// Format 1: String direct
"Message d'erreur"

// Format 2: Objet avec message
{ message: "Message d'erreur" }

// Format 3: Objet avec error
{ error: "Message d'erreur" }

// Format 4: Erreurs de validation (422)
{
  errors: {
    email: ["Email invalide", "Email déjà utilisé"],
    password: ["Mot de passe trop court"]
  }
}
```

### 3. **Service de notifications** (`notification.service.ts`)
Service amélioré avec :
- **4 types de notifications** : success, warning, error, info
- **Durées configurables** par type :
  - Success : 5 secondes
  - Warning : 7 secondes
  - Error : 10 secondes
  - Info : 5 secondes
- **IDs uniques** pour chaque notification
- **Méthodes personnalisables** : possibilité de spécifier une durée custom

#### Utilisation :
```typescript
constructor(private notificationService: NotificationService) {}

// Notification de succès (5s par défaut)
this.notificationService.showSuccess('Opération réussie !');

// Notification d'erreur (10s par défaut)
this.notificationService.showError('Une erreur est survenue');

// Notification avec durée personnalisée
this.notificationService.showWarning('Attention !', 15000); // 15 secondes
```

### 4. **Composant de notification** (`notification.component.ts`)
Composant amélioré qui :
- Affiche les notifications en haut à droite
- Utilise les durées configurables
- Affiche des icônes selon le type
- Permet la fermeture manuelle
- Auto-dismiss selon la durée spécifiée

## 🔧 Services simplifiés

Tous les services CRUD ont été simplifiés :
- **Suppression des `catchError` redondants** : L'intercepteur gère maintenant toutes les erreurs
- **Code plus propre et maintenable**
- **Moins de duplication de code**

### Avant :
```typescript
index(): Observable<Etudiant[]> {
  return this.http.get<Etudiant[]>(this.baseUrl).pipe(
    catchError((error) => this.errorHandler.handleError(error))
  );
}
```

### Après :
```typescript
index(): Observable<Etudiant[]> {
  return this.http.get<Etudiant[]>(this.baseUrl);
}
```

## 📊 Codes HTTP gérés

| Code | Message | Action |
|------|---------|--------|
| 0 | Impossible de se connecter au serveur | Vérifier la connexion |
| 400 | Requête invalide | Vérifier les données envoyées |
| 401 | Non autorisé | Déconnexion automatique + redirection |
| 403 | Accès refusé | Notification d'erreur |
| 404 | Ressource introuvable | Notification d'erreur |
| 409 | Conflit | Notification d'erreur |
| 422 | Erreur de validation | Affichage des erreurs de champs |
| 500 | Erreur serveur | Notification d'erreur |
| 502 | Passerelle incorrecte | Notification d'erreur |
| 503 | Service indisponible | Notification d'erreur |
| 504 | Délai dépassé | Notification d'erreur |

## 🎨 Styles de notifications

Les notifications utilisent Tailwind CSS avec des couleurs adaptées :
- **Success** : Vert (`bg-green-100 border-green-400 text-green-700`)
- **Warning** : Jaune (`bg-yellow-100 border-yellow-400 text-yellow-700`)
- **Error** : Rouge (`bg-red-100 border-red-400 text-red-700`)
- **Info** : Bleu (`bg-blue-100 border-blue-400 text-blue-700`)

## 🚀 Utilisation dans les composants

### Exemple complet :
```typescript
import { Component } from '@angular/core';
import { EtudiantService } from './services/etudiant.service';
import { NotificationService } from './services/notification.service';

@Component({...})
export class EtudiantComponent {
  constructor(
    private etudiantService: EtudiantService,
    private notificationService: NotificationService
  ) {}

  loadEtudiants(): void {
    this.etudiantService.index().subscribe({
      next: (etudiants) => {
        this.etudiants = etudiants;
        this.notificationService.showSuccess('Étudiants chargés avec succès');
      },
      error: (error) => {
        // L'erreur est déjà gérée par l'intercepteur
        // Pas besoin de traitement supplémentaire
        console.error('Erreur lors du chargement:', error);
      }
    });
  }

  deleteEtudiant(id: number): void {
    this.etudiantService.delete(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Étudiant supprimé avec succès');
        this.loadEtudiants();
      }
      // Les erreurs sont automatiquement gérées
    });
  }
}
```

## ✅ Avantages du nouveau système

1. **Centralisation** : Toute la logique d'erreur en un seul endroit
2. **Cohérence** : Même comportement pour toutes les erreurs
3. **Maintenabilité** : Code plus simple et facile à modifier
4. **Expérience utilisateur** : Messages d'erreur clairs et informatifs
5. **Sécurité** : Gestion automatique de l'authentification
6. **Flexibilité** : Durées de notification configurables
7. **Debugging** : Logs détaillés dans la console

## 🔍 Debugging

Les erreurs sont loggées dans la console avec tous les détails :
```javascript
console.error('Erreur côté serveur :', {
  status: error.status,
  message: error.message,
  body: error.error,
  url: error.url
});
```

## 📝 Notes importantes

- **L'intercepteur est automatiquement appliqué** à toutes les requêtes HTTP
- **Les notifications sont automatiques** pour toutes les erreurs
- **Le token JWT est ajouté automatiquement** à chaque requête
- **La déconnexion est automatique** en cas d'erreur 401
- **Les services n'ont plus besoin de gérer les erreurs** manuellement
