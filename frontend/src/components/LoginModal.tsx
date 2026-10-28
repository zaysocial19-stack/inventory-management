import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('manager@inventory.local');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      onClose();
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please make sure the backend is running on http://localhost:3000.');
      } else {
        setError(
          err.response?.data?.message || 'Invalid email or password. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-100">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-700/80">
          <div>
            <h2 className="text-lg font-bold text-white">Sign In to Inventory</h2>
            <p className="text-xs text-slate-400 mt-0.5">Authenticate for role-based permissions</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-semibold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-700 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              placeholder="user@inventory.local"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-700/60">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Demo Logins (Click to Fill):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('manager@inventory.local')}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-sky-500 text-left transition-colors cursor-pointer"
            >
              <div className="font-semibold text-emerald-400">👔 Manager</div>
              <div className="text-[11px] text-slate-400 truncate">manager@inventory.local</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('barista@inventory.local')}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-sky-500 text-left transition-colors cursor-pointer"
            >
              <div className="font-semibold text-amber-400">☕ Staff</div>
              <div className="text-[11px] text-slate-400 truncate">barista@inventory.local</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
