# Voting DApp - Guide d'Utilisation et Mise en Place

## 📋 Overview

Application de vote décentralisée (DApp) construite avec Next.js, TypeScript, Taiwail CSS, Wagmi et Reown AppKit. L'application permet une gestion complète du processus de vote sur la blockchain, du enregistrement des électeurs jusqu'à la comptabilisation des résultats.

## 🏗️ Architecture

### Backend (Hardhat + Solidity)
- **Smart Contract**: `backend/contracts/Voting.sol`
- Inclut les méthodes pour:
  - Enregistrement des électeurs (`addVoter`, `removeVoter`)
  - Gestion des propositions (`addProposal`)
  - Système de vote (`setVote`)
  - Gestion du workflow (`startProposalsRegistering`, `endProposalsRegistering`, `startVotingSession`, `endVotingSession`, `tallyVotes`)

### Frontend (Next.js)
- **Pages**: `src/app/page.tsx` - Page principale
- **Composants**: `src/components/shared/*`
  - `VotingAppLayout.tsx` - Layout principal orchestrateur
  - `WorkflowBreadcrumb.tsx` - Affichage du workflow
  - `AdminVoters.tsx` - Gestion des électeurs (Admin)
  - `AdminActions.tsx` - Boutons d'actions admin
  - `Proposals.tsx` - Liste des propositions
  - `Voting.tsx` - Interface de vote
  - `Results.tsx` - Affichage des résultats
  - `ToastContainer.tsx` - Notifications

- **Hooks**: `src/hooks/useVoting.ts`
  - Interactions complètes avec le smart contract via Wagmi
  - Écoute des événements blockchain

- **Types**: `src/types/voting.ts`
  - Types TypeScript pour Voting
  - Enums WorkflowStatus
  - Interfaces Voter, Proposal, Toast

- **Context**: 
  - `src/context/index.tsx` - Providers principaux (Wagmi, Query, Toast)
  - `src/context/ToastContext.tsx` - Gestion des notifications

## 🚀 Installation et Démarrage

### Backend
```bash
cd backend

# Compiler le contrat
npm run compile

# Déployer localement (Hardhat)
npm run deploy

# Exécuter les tests
npm test
```

### Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Développement
npm run dev

# Production
npm run build
npm run start
```

## 🔌 Configuration Wallet

### Reown AppKit
L'application utilise Reown AppKit pour la connexion du wallet. Configurez votre `NEXT_PUBLIC_PROJECT_ID`:

1. Allez sur: https://dashboard.reown.com
2. Créez un projet
3. Copiez votre Project ID
4. Ajoutez-le à votre `.env.local`:
   ```
   NEXT_PUBLIC_PROJECT_ID=your_project_id_here
   ```

### Réseau Configuré
- **Réseau actuel**: Hardhat (localhost)
- **Adresse du contrat**: définie dans `src/config/index.tsx` (CONTRACT_ADDRESS)

Pour utiliser sur Sepolia/autre testnet, mettez à jour:
- `src/config/index.tsx` - networks, CONTRACT_ADDRESS
- `backend/hardhat.config.ts` - configuration réseau

## 📊 Workflow du Vote

### États du Workflow (6 phases)

1. **RegisteringVoters** (État 0)
   - Admin ajoute/retire les électeurs
   - Seul l'admin peut agir

2. **ProposalsRegistrationStarted** (État 1)
   - Les électeurs enregistrés proposent
   - Admin démarre cette phase

3. **ProposalsRegistrationEnded** (État 2)
   - Plus de nouvelles propositions
   - Admin termine cette phase

4. **VotingSessionStarted** (État 3)
   - Les électeurs enregistrés votent
   - Admin démarre cette phase

5. **VotingSessionEnded** (État 4)
   - Plus de votes possibles
   - Admin termine cette phase

6. **VotesTallied** (État 5)
   - Résultats comptabilisés et affichés
   - Admin comptabilise les votes

## 👥 Rôles Utilisateurs

### Administrateur (Owner du contrat)
Accès à:
- Gestion des électeurs (ajouter/retirer)
- Contrôle du workflow (boutons d'action)
- Visibilité complète du processus

### Électeur (Voter enregistré)
Accès à:
- Proposer pendant ProposalsRegistrationStarted
- Voter pendant VotingSessionStarted
- Voir les résultats après VotesTallied

### Utilisateur Non Enregistré
- Peut consulter le contrat
- Message indiquant qu'il n'est pas un électeur

## 🎨 Composants UI Principaux

### VotingAppLayout
- Orchestre tous les sous-composants
- Gère le statut du workflow
- Affiche les sections appropriées selon le rôle

### WorkflowBreadcrumb
- Affiche visuellement les 6 phases
- Indique la phase actuelle (en bleu, pulsante)
- Phase complétées en vert

### AdminVoters
- Ajouter électeur par adresse
- Voir liste des électeurs
- Retirer un électeur (avant qu'il vote)
- Validation des adresses

### Proposals
- Affiche la liste des propositions
- Compte des votes en temps réel
- Masque la propostion "GENESIS" (id 0)
- Formulaire d'ajout de proposition

### Voting
- Liste des propositions avec bouton de vote
- Indication visuelle du vote déjà effectué
- Blocage du revote

### Results
- Classement complet des propositions
- Barres de progression avec pourcentages
- Affichage du gagnant en évidence
- Affichage uniquement en phase VotesTallied

### AdminActions
- Bouton pour chaque transition d'état
- Affichage contextuel du bouton approprié
- Status pendant la transaction

## 🔔 Système de Notifications

Toast automatiques pour:
- ✅ Actions réussies
- ❌ Erreurs de transaction
- ⏳ État des transactions pendant le traitement

Gérés via React Context (`ToastContext`) avec:
- Auto-dismiss après 3s par défaut
- Fermeture manuelle possible
- Styles basés sur le type (success, error, info, warning)

## 🪝 Hooks Personnalisés (useVoting.ts)

| Hook | Description |
|------|-------------|
| `useWorkflowStatus()` | État du workflow actuel |
| `useCurrentVoter()` | Info du voteur connecté |
| `useProposal(id)` | Détails d'une proposition |
| `useContractOwner()` | Adresse du owner/admin |
| `useWinningProposal()` | ID de la proposition gagnante |
| `useAddVoter()` | Ajouter un voteur |
| `useRemoveVoter()` | Retirer un voteur |
| `useAddProposal()` | Proposer |
| `useVote()` | Voter |
| `useStartProposalsRegistering()` | Phase 1 |
| `useEndProposalsRegistering()` | Fin Phase 1  |
| `useStartVotingSession()` | Phase 3 |
| `useEndVotingSession()` | Fin Phase 3 |
| `useTallyVotes()` | Comptabiliser votes |
| `useVotingEvents()` | Écouter événements |

## 🔒 Sécurité

Le contrat Solidity implémente:
- **Access Control**: Modificateurs `onlyOwner`, `onlyVoters`
- **Prévention de reentrancy**: Pas d'appels externes
- **Validation des états**: Workflow à états strictes
- **Pas de force feeding**: Pas d'acceptation d'ETH
- **Protection contre les DoS**: Pas de boucles non-bornées sur données externes

## 📝 Variables d'Environnement Frontend

```
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend (à implémenter selon vos besoins)
cd frontend
npm run test
```

## 🌐 Déploiement

### Sur testnet (Sepolia)
1. Configurez Hardhat pour Sepolia
2. Déployez le contrat
3. Mettez à jour `CONTRACT_ADDRESS` dans `frontend/src/config`
4. Changez `networks` dans config pour inclure Sepolia
5. Déployez le frontend (Vercel, Netlify, etc.)

## 🔧 Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui
- **Blockchain**: Wagmi v3, Viem v2, Reown AppKit
- **Backend**: Hardhat v3, Solidity 0.8.28, OpenZeppelin Contracts
- **State Management**: React Context, React Query

## 📞 Support

Pour toute question ou bug:
1. Vérifiez que MetaMask/Wallet est connecté à Hardhat
2. Assurez-vous que le smart contract est déployé
3. Vérifiez que l'adresse du contrat dans `config` est correcte
4. Consultez la console du navigateur pour les erreurs détaillées

## 📄 Licence

MIT © 2026 Alyra
