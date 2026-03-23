'use client';
import { useConnection } from "wagmi";
import { VotingAppLayout } from "@/components/shared/VotingAppLayout";
import NotConnected from "@/components/shared/NotConnected";

export default function Home() {

  const { isConnected } = useConnection();

  return (
    <div>
      {isConnected ? (
        <VotingAppLayout />
      ) : (
        <NotConnected />
      )}
    </div>
  );
}
