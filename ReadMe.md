# 🚀 Quick Start Guide - Voting DApp

## ⚡ Démarrage Rapide (5 minutes)

### 1️⃣ **Configuration Reown** (1 min)

```bash
# Allez sur https://dashboard.reown.com
# Créez un nouveau projet
# Copiez votre Project ID
# Créez frontend/.env.local
```

**frontend/.env.local**:
```
NEXT_PUBLIC_PROJECT_ID=paste_your_project_id_here
```

### 2️⃣ **Démarrer le Backend** (1 min)

```bash
cd backend

# Compiler et déployer le contrat
npm run deploy

# Vous verrez quelque chose comme:
# Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Note**: L'adresse du contrat est déjà configurée dans `frontend/src/config/index.tsx` par défaut.

### 3️⃣ **Démarrer le Frontend** (1 min)

```bash
cd frontend

# Application en développement
npm run dev

# Ouvert sur http://localhost:3000
```

### 4️⃣ **Connecter votre Wallet** (1 min)

1. Clickez sur le bouton "Connect Wallet" (haut-droit)
2. Sélectionnez votre wallet (MetaMask, etc.)
3. Approuvez la connexion
4. ✅ Connecté!

### 5️⃣ **Commencer à Voter** (1 min)

- **Si vous êtes Admin (deployer)**: Vous voyez la section "Gestion des Électeurs"
- **Ajouter un électeur**: Entrez une adresse → Cliquez "Ajouter"
- **Démarrer le vote**: Cliquez sur les boutons dans la section "Administration"
- **Ensemble des électeurs**: Proposez → Votez → Voyez les résultats!

---

## 📋 Workflow Complet (Guide d'Utilisation)

### Phase 1: Enregistrement des Électeurs 🔐
```
Admin:
1. Ajouter les adresses des électeurs
2. Cliquer "Démarrer l'enregistrement des propositions" → Phase 2
```

### Phase 2 & 3: Enregistrement des Propositions 💡
```
Électeurs:
1. Connectez-vous
2. Entrez votre proposition
3. Cliquez "Proposer"

Admin:
4. Quand terminé, cliquez "Terminer l'enregistrement des propositions" → Phase 4
```

### Phase 4 & 5: Session de Vote ✅
```
Admin:
1. Cliquez "Démarrer la session de vote" → Phase 6

Électeurs:
2. Voyez toutes les propositions
3. Cliquez "Voter" sur votre choix
4. ✓ Confirmé! Vous voyez "Votre choix"

Admin:
5. Quand terminé, cliquez "Terminer la session de vote" → Phase 7
```

### Phase 6: Comptabilisation 📊
```
Admin:
1. Cliquez "Comptabiliser les votes" → Phase 8

Tous:
2. Voyez le classement complet
3. Le gagnant en relief
4. Statistiques détaillées
```

---

## 🔑 Comptes de Test Recommandés

### Setup Hardhat Local
```bash
# Dans backend/
npx hardhat node

# Dans une nouveau terminal
npm run deploy

# Compte 0 (Owner/Admin):
Adresse: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Comptes additionnels (electeurs):
0x70997970C51812e339D9B73b0245ad59e5E05A55
0x3C44CdDdB6a900c6671B62119FB46f6F6D5f1D1C
0x1CBd3b2770909D4e10f157cABC84C7264073C9Ea
... (Hardhat en génère 20 total)
```

---

## 🛠️ Troubleshooting Rapide

### ❌ "Cannot find module 'react'"
```bash
# Solution:
cd frontend
npm install
```

### ❌ "Contract not found at address"
```bash
# Solution 1: Redéployer
cd backend
npm run deploy

# Solution 2: Mettez à jour l'adresse dans frontend/src/config/index.tsx
export const CONTRACT_ADDRESS = "0x..."
```

### ❌ "Wallet not connected"
```
Solution: Clickez le bouton "Connect" en haut-droit et approuvez la connexion
```

### ❌ "Not registered as a voter"
```
Solution (Admin): 
1. Allez à "Gestion des Électeurs"
2. Entrez l'adresse du wallet et cliquez "Ajouter"
3. Attendez la confirmation
4. Reconnectez-vous
```

### ❌ Application très lente
```bash
# Vérifiez que Hardhat tourne:
# Terminal 1: cd backend && npx hardhat node
# Terminal 2: cd frontend && npm run dev
```

---

## 📁 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `frontend/src/app/page.tsx` | Page principale |
| `frontend/src/config/index.tsx` | Configuration du contrat (ABI & address) |
| `frontend/src/hooks/useVoting.ts` | Toutes les interactions au contrat |
| `backend/contracts/Voting.sol` | Smart contract |
| `VOTING_GUIDE.md` | Documentation complète |

---

## 🔍 Debugging

## ✨ Fonctionnalités Principales

✅ Workflow complet à 6 phases
✅ Gestion des électeurs (ajouter/retirer)
✅ Propositions avec auto-incrémentation
✅ Système de vote sécurisé
✅ Comptabilisation automatique
✅ Résultats en temps réel
✅ Notifications toast
✅ Design responsive
✅ Support Hardhat + testnet ready
✅ Code 100% TypeScript
✅ Composants réutilisables

---

## 🎯 Cas d'Usage Recommandés

### Démo Simple (10 min)
1. Déployer contrat ✓
2. Ajouter 3 électeurs ✓
3. Proposer 2-3 propositions ✓
4. Voter ✓
5. Voir résultats ✓

### Audit/Tests (30 min)
1. Tester chaque phase
2. Tester les validations
3. Tester la sécurité (tentatives invalides)
4. Vérifier les événements

### Production/Sepolia
1. Mettre à jour hardhat.config.ts
2. Déployer sur Sepolia
3. Mettre à jour CONTRACT_ADDRESS
4. Changer networks dans config
5. Deploy frontend sur Vercel/Netlify

---

## 📞 Support Rapide

**Bloc sur une phase?** → Consultez VOTING_GUIDE.md
**Erreur TypeScript?** → Vérifiez que npm install a tourné
**Wallet ne connect pas?** → Cherchez Reown AppKit configuration
**Contrat ne répond pas?** → Vérifiez que Hardhat tourne

---

## 🎓 Apprentissage Progressif

1. **Jour 1**: Comprenez le workflow (VOTING_GUIDE.md)
2. **Jour 2**: Explorez les hooks (src/hooks/useVoting.ts)
3. **Jour 3**: Modifiez les composants UI
4. **Jour 4**: Deployez sur testnet
5. **Jour 5**: Optimisez pour production

---

## 🚀 Prêt à Démarrer?

```bash
# Copy-paste complet:

# Terminal 1 - Backend
cd backend
npm install  # Si nécessaire
npm run deploy

# Terminal 2 - Frontend
cd frontend
npm install  # Si nécessaire
echo "NEXT_PUBLIC_PROJECT_ID=your_id" > .env.local
npm run dev

# Browse: http://localhost:3000
```

---

**Status**: ✅ Ready to Demo!
Enjoy your decentralized voting app! 🎉
