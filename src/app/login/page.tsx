import { login, signup } from './actions'

export default async function LoginPage(props: {
  searchParams: Promise<{ message?: string }>
}) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-24 mx-auto relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 rounded-[100%] blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="flex-1 flex flex-col w-full justify-center gap-2 glass-panel p-8 rounded-3xl shadow-2xl border border-white/10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-extrabold mb-3 text-on-surface">Sign In</h1>
          <p className="text-on-surface-variant">Initialize your custom intelligence feed.</p>
        </div>
        
        <form className="flex flex-col w-full" action={login}>
          <label className="text-sm font-semibold text-on-surface-variant mb-1 ml-1" htmlFor="email">
            Email address
          </label>
          <input
            className="rounded-xl px-4 py-3 bg-surface-container border border-white/10 text-on-surface mb-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />

          <label className="text-sm font-semibold text-on-surface-variant mb-1 ml-1" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-xl px-4 py-3 bg-surface-container border border-white/10 text-on-surface mb-6 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
          
          <div className="flex flex-col gap-3">
            <button type="submit" formAction={login} className="bg-primary text-on-primary rounded-xl px-4 py-3 font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(173,198,255,0.4)]">
              Sign In
            </button>
            <button type="submit" formAction={signup} className="glass bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl px-4 py-3 font-bold transition-all duration-300 border border-white/5">
              Create Account
            </button>
          </div>
          
          {searchParams?.message && (
            <div className="mt-6 p-4 bg-error/10 text-error text-sm font-medium text-center rounded-xl border border-error/20">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
