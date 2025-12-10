import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Target, Zap } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-6 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-8 bg-brand-500 text-2xl font-bold text-white">
              T
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Todone</h1>
              <p className="text-white/70">From to-do to todone</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white">
            Get your work and life organized
          </h2>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-brand-400" />
              <div>
                <p className="font-medium text-white">Stay organized</p>
                <p className="text-sm text-white/60">
                  Manage tasks, projects, and priorities in one beautiful interface
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Target className="mt-1 h-5 w-5 text-brand-400" />
              <div>
                <p className="font-medium text-white">Achieve your goals</p>
                <p className="text-sm text-white/60">
                  Build habits, track progress, and celebrate every win
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="mt-1 h-5 w-5 text-brand-400" />
              <div>
                <p className="font-medium text-white">Work smarter</p>
                <p className="text-sm text-white/60">
                  Natural language input, keyboard shortcuts, and powerful automation
                </p>
              </div>
            </li>
          </ul>
        </div>

        <Card className="flex flex-col justify-center" padding="lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-sm text-white/60">
              {mode === 'login'
                ? 'Log in to your account to continue'
                : 'Create an account to start achieving more'}
            </p>
          </div>

          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode('login')} />
          )}
        </Card>
      </div>
    </div>
  );
};
