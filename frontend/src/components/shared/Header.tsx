import ConnectButton from "./ConnectButton"
import { Vote } from "lucide-react"

const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <Vote className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white">Voting DApp</h1>
            <p className="text-xs text-slate-400">Décentralisé & Transparent</p>
          </div>
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}

export default Header
