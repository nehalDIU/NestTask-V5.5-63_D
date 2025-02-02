import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import type { LoginCredentials, SignupCredentials } from '../types/auth';

interface AuthPageProps {
  onLogin: (credentials: LoginCredentials) => void;
  onSignup: (credentials: SignupCredentials) => void;
  error?: string;
}

export function AuthPage({ onLogin, onSignup, error }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          NestTask
        </h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {isLogin ? (
          <LoginForm
            onSubmit={onLogin}
            onSwitchToSignup={() => setIsLogin(false)}
            error={error}
          />
        ) : (
          <SignupForm
            onSubmit={onSignup}
            onSwitchToLogin={() => setIsLogin(true)}
            error={error}
          />
        )}
      </div>
    </div>
  );
}