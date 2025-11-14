# Guide de Test - Système de Gestion d'Erreurs

## 🧪 Tests à effectuer

### 1. Test de l'Intercepteur HTTP

#### Test 1.1 : Ajout automatique du token
```typescript
// Dans un composant
this.etudiantService.index().subscribe({
  next: (data) => console.log('Données reçues:', data)
});

// Vérifier dans les DevTools (Network) :
// ✅ Header "Authorization: Bearer {token}" présent
```

#### Test 1.2 : Gestion erreur 401
```typescript
// Simuler une erreur 401 (token expiré)
// 1. Modifier le token dans localStorage avec une valeur invalide
localStorage.setItem('auth_token', 'invalid_token');

// 2. Faire une requête
this.etudiantService.index().subscribe();

// Résultat attendu :
// ✅ Redirection automatique vers /signin
// ✅ Token supprimé du localStorage
// ✅ Pas de notification affichée (redirection suffit)
```

### 2. Test du HandleErrorsService

#### Test 2.1 : Erreur 404
```typescript
// Tenter d'accéder à une ressource inexistante
this.etudiantService.show('999999').subscribe();

// Résultat attendu :
// ✅ Notification rouge : "Ressource introuvable."
// ✅ Log dans console avec détails
```

#### Test 2.2 : Erreur 422 (Validation)
```typescript
// Envoyer des données invalides
const etudiant = { email: 'invalid', password: '123' };
this.etudiantService.store(formData).subscribe();

// Résultat attendu :
// ✅ Notification avec erreurs formatées
// ✅ Exemple : "email: Email invalide | password: Mot de passe trop court"
```

#### Test 2.3 : Erreur 500
```typescript
// Provoquer une erreur serveur
// Résultat attendu :
// ✅ Notification rouge : "Erreur interne du serveur."
// ✅ Log détaillé dans console
```

#### Test 2.4 : Erreur réseau (code 0)
```typescript
// Arrêter le serveur backend et faire une requête
this.etudiantService.index().subscribe();

// Résultat attendu :
// ✅ Notification : "Impossible de se connecter au serveur. Vérifiez votre connexion Internet."
```

### 3. Test du NotificationService

#### Test 3.1 : Notification Success
```typescript
this.notificationService.showSuccess('Opération réussie !');

// Résultat attendu :
// ✅ Notification verte en haut à droite
// ✅ Icône ✓
// ✅ Disparaît après 5 secondes
```

#### Test 3.2 : Notification Warning
```typescript
this.notificationService.showWarning('Attention aux données !');

// Résultat attendu :
// ✅ Notification jaune
// ✅ Icône ⚠
// ✅ Disparaît après 7 secondes
```

#### Test 3.3 : Notification Error
```typescript
this.notificationService.showError('Une erreur est survenue !');

// Résultat attendu :
// ✅ Notification rouge
// ✅ Icône ✕
// ✅ Disparaît après 10 secondes
```

#### Test 3.4 : Notification Info
```typescript
this.notificationService.showInfo('Information importante');

// Résultat attendu :
// ✅ Notification bleue
// ✅ Icône ℹ
// ✅ Disparaît après 5 secondes
```

#### Test 3.5 : Durée personnalisée
```typescript
this.notificationService.showSuccess('Message long', 15000);

// Résultat attendu :
// ✅ Notification verte
// ✅ Disparaît après 15 secondes
```

#### Test 3.6 : Multiples notifications
```typescript
this.notificationService.showSuccess('Message 1');
this.notificationService.showWarning('Message 2');
this.notificationService.showError('Message 3');

// Résultat attendu :
// ✅ 3 notifications empilées verticalement
// ✅ Chacune avec sa couleur et durée
// ✅ Fermeture indépendante
```

### 4. Test des Services simplifiés

#### Test 4.1 : Service sans catchError
```typescript
// Vérifier qu'aucun service n'a de catchError
// Fichiers à vérifier :
// - etablissement.service.ts
// - etudiant.service.ts
// - enseignant.service.ts
// - annee.service.ts
// - niveau.service.ts
// - filiere.service.ts
// - matiere.service.ts
// - role.service.ts
// - permission.service.ts
// - user.service.ts
// - ue.service.ts

// Résultat attendu :
// ✅ Aucun import de catchError
// ✅ Aucun import de HandleErrorsService
// ✅ Code propre et simple
```

#### Test 4.2 : Fonctionnement CRUD complet
```typescript
// Créer
this.etudiantService.store(formData).subscribe({
  next: () => this.notificationService.showSuccess('Créé !'),
  error: (err) => console.log('Erreur gérée automatiquement')
});

// Lire
this.etudiantService.index().subscribe({
  next: (data) => this.etudiants = data
});

// Modifier
this.etudiantService.update(id, formData).subscribe({
  next: () => this.notificationService.showSuccess('Modifié !')
});

// Supprimer
this.etudiantService.delete(id).subscribe({
  next: () => this.notificationService.showSuccess('Supprimé !')
});

// Résultat attendu :
// ✅ Toutes les opérations fonctionnent
// ✅ Erreurs gérées automatiquement
// ✅ Notifications appropriées
```

### 5. Test de l'AuthService

#### Test 5.1 : Login réussi
```typescript
this.authService.login({ username: 'admin', password: 'password' }).subscribe();

// Résultat attendu :
// ✅ Token stocké dans localStorage
// ✅ Redirection vers /
// ✅ Pas de notification
```

#### Test 5.2 : Login échoué
```typescript
this.authService.login({ username: 'wrong', password: 'wrong' }).subscribe();

// Résultat attendu :
// ✅ Notification d'erreur affichée
// ✅ Pas de redirection
// ✅ Pas de token stocké
```

#### Test 5.3 : Logout
```typescript
this.authService.logout();

// Résultat attendu :
// ✅ Token supprimé du localStorage
// ✅ Redirection vers /signin
```

### 6. Test du composant NotificationComponent

#### Test 6.1 : Fermeture manuelle
```typescript
// Afficher une notification
this.notificationService.showSuccess('Test');

// Cliquer sur le bouton X
// Résultat attendu :
// ✅ Notification disparaît immédiatement
```

#### Test 6.2 : Auto-dismiss
```typescript
// Afficher une notification
this.notificationService.showSuccess('Test');

// Attendre 5 secondes
// Résultat attendu :
// ✅ Notification disparaît automatiquement
```

## 📋 Checklist de validation

### Configuration
- [ ] `app.config.ts` contient `withInterceptors([authInterceptor])`
- [ ] Aucune erreur de compilation TypeScript
- [ ] Application démarre sans erreur

### Intercepteur
- [ ] Token ajouté automatiquement aux requêtes
- [ ] Erreur 401 redirige vers /signin
- [ ] Token supprimé lors de la déconnexion

### Gestion d'erreurs
- [ ] Erreurs 400, 404, 500 affichent des notifications
- [ ] Erreurs 422 formatent les champs correctement
- [ ] Erreurs réseau (0) affichent un message approprié
- [ ] Logs détaillés dans la console

### Notifications
- [ ] 4 types fonctionnent (success, warning, error, info)
- [ ] Durées par défaut correctes (5s, 7s, 10s)
- [ ] Durées personnalisées fonctionnent
- [ ] Fermeture manuelle fonctionne
- [ ] Auto-dismiss fonctionne
- [ ] Multiples notifications s'empilent correctement

### Services
- [ ] Tous les services CRUD fonctionnent
- [ ] Aucun catchError dans les services
- [ ] Aucun import de HandleErrorsService dans les services CRUD
- [ ] Code propre et lisible

### AuthService
- [ ] Login réussi stocke le token
- [ ] Login échoué affiche une erreur
- [ ] Logout supprime le token et redirige

## 🐛 Problèmes connus et solutions

### Problème 1 : Notifications ne s'affichent pas
**Solution** : Vérifier que `<app-notification></app-notification>` est présent dans le template principal

### Problème 2 : Token non ajouté aux requêtes
**Solution** : Vérifier que l'intercepteur est bien enregistré dans `app.config.ts`

### Problème 3 : Erreurs 401 ne redirigent pas
**Solution** : Vérifier que `AuthService` et `Router` sont bien injectés dans l'intercepteur

### Problème 4 : Notifications ne disparaissent pas
**Solution** : Vérifier que les IDs sont uniques et que la comparaison utilise `n.id !== notification.id`

## 📊 Métriques de performance

- **Temps de réponse** : Les notifications doivent apparaître en < 100ms
- **Mémoire** : Pas de fuite mémoire (vérifier avec Chrome DevTools)
- **Requêtes** : Token ajouté sans latence supplémentaire

## ✅ Validation finale

Une fois tous les tests passés :
1. Tester l'application en conditions réelles
2. Vérifier les logs de production
3. Monitorer les erreurs utilisateurs
4. Collecter les retours utilisateurs

## 📝 Notes

- Tester avec différents navigateurs (Chrome, Firefox, Safari)
- Tester sur mobile (responsive)
- Tester avec connexion lente (throttling)
- Tester avec serveur backend arrêté
