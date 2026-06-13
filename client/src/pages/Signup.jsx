import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, Link2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const Signup = () => {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      toast.success('Account created successfully! Welcome to LinkPulse.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-grid text-dark-100 flex items-center justify-center p-6 relative">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-indigo/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-cyan flex items-center justify-center text-white">
              <Link2 className="w-5 h-5 rotate-45" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Link<span className="text-brand-cyan">Pulse</span>
            </span>
          </Link>
          <p className="text-dark-400 text-sm mt-2 font-medium">
            Join LinkPulse today to streamline your links.
          </p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-2xl border border-dark-700/60 bg-dark-900/60 backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="name@company.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[34px] text-dark-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full mt-2 py-3 text-sm shadow-neon-indigo"
            >
              Get Started
            </Button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs text-dark-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-indigo hover:text-brand-indigo/80 font-bold transition-colors">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
