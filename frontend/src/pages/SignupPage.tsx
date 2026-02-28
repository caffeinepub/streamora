import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !username.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = registerUser(name.trim(), username.trim(), password);
      if (result.success) {
        login({
          secretUsername: username.trim(),
          name: name.trim(),
          isAdmin: false,
        });
        toast.success('Account created! Welcome to Streamora!');
        navigate({ to: '/home' });
      } else {
        setError(result.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 text-center">
        <img
          src="/assets/generated/streamora-wordmark.dim_400x80.png"
          alt="Streamora"
          className="h-10 w-auto mx-auto mb-3"
        />
        <p className="text-muted-foreground text-sm">Create your account</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your display name"
                className="bg-surface-2 border-border focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">
                Secret Username
                <span className="text-xs text-muted-foreground ml-1.5 font-normal">(private, not searchable)</span>
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Choose a secret username"
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
                  placeholder="Create a password"
                  className="bg-surface-2 border-border focus:border-brand pr-10"
                  autoComplete="new-password"
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

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Re-enter Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="bg-surface-2 border-border focus:border-brand"
                autoComplete="new-password"
              />
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
                  Creating account...
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-brand hover:underline">Privacy &amp; Policy</a>
            </p>
            <div className="pt-3 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-brand hover:underline font-medium">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
