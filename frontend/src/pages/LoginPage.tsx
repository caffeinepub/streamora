import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const result = loginUser(username.trim(), password);
      if (result.success && result.user) {
        login({
          secretUsername: result.user.secretUsername,
          name: result.user.name,
          isAdmin: result.isAdmin || false,
        });
        toast.success(`Welcome back, ${result.user.name}!`);
        if (result.isAdmin) {
          navigate({ to: '/admin' });
        } else {
          navigate({ to: '/home' });
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <img
          src="/assets/generated/streamora-wordmark.dim_400x80.png"
          alt="Streamora"
          className="h-10 w-auto mx-auto mb-3"
        />
        <p className="text-muted-foreground text-sm">Sign in to your account</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">Secret Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your secret username"
                className="bg-surface-2 border-border focus:border-brand"
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-surface-2 border-border focus:border-brand pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-bright text-white font-semibold gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
