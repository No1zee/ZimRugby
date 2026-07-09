import { login, signup } from './actions'
import SlantedButton from '@/components/ui/SlantedButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-rich-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl glow-green-card">
        <h1 className="font-heading text-4xl text-white mb-6 tracking-widest text-center uppercase">
          ZRU Portal Login
        </h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Email:</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="bg-rich-black border border-white/20 rounded p-3 text-white focus:border-zru-green focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <label htmlFor="password" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Password:</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-rich-black border border-white/20 rounded p-3 text-white focus:border-zru-green focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-col gap-3">
            <SlantedButton formAction={login} variant="primary" className="w-full justify-center">
              Log in
            </SlantedButton>
            <SlantedButton formAction={signup} variant="outline" className="w-full justify-center">
              Sign up
            </SlantedButton>
          </div>
        </form>
      </div>
    </div>
  )
}
