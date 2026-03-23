// Énumération des états du workflow de vote
export enum WorkflowStatus {
  RegisteringVoters = 0,
  ProposalsRegistrationStarted = 1,
  ProposalsRegistrationEnded = 2,
  VotingSessionStarted = 3,
  VotingSessionEnded = 4,
  VotesTallied = 5,
}

export const WorkflowStatusLabels: Record<WorkflowStatus, string> = {
  [WorkflowStatus.RegisteringVoters]: "Enregistrement des électeurs",
  [WorkflowStatus.ProposalsRegistrationStarted]: "Enregistrement des propositions",
  [WorkflowStatus.ProposalsRegistrationEnded]: "Fin de l'enregistrement des propositions",
  [WorkflowStatus.VotingSessionStarted]: "Session de vote en cours",
  [WorkflowStatus.VotingSessionEnded]: "Fin de la session de vote",
  [WorkflowStatus.VotesTallied]: "Votes comptabilisés",
};

// Type pour les électeurs
export interface Voter {
  isRegistered: boolean;
  hasVoted: boolean;
  votedProposalId: bigint;
}

// Type pour les propositions
export interface Proposal {
  description: string;
  voteCount: bigint;
}

// Type pour les transactions en attente
export interface PendingTransaction {
  id: string;
  type: 'addVoter' | 'removeVoter' | 'addProposal' | 'vote' | 'startProposalsRegistering' | 'endProposalsRegistering' | 'startVotingSession' | 'endVotingSession' | 'tallyVotes';
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

// Type pour les notifications
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Type pour les résultats de vote
export interface VoteResult {
  proposalId: number;
  description: string;
  voteCount: bigint;
  percentage: number;
}
