import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 transition-all duration-300">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-display font-extrabold tracking-tight text-primary hover:text-primary-container transition-colors">
            AI News.
          </Link>
          {user && (
            <Link href="/saved" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2">
              Saved Articles
            </Link>
          )}
        </div>
        
        <div>
          {user ? (
            <form action="/auth/signout" method="post">
              <button className="text-sm font-medium text-on-surface-variant hover:text-error transition-colors">
                Sign Out
              </button>
            </form>
          ) : (
            <Link href="/login" className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(173,198,255,0.4)] transition-all duration-300">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
