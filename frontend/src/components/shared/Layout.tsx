import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "./ToastContainer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default Layout