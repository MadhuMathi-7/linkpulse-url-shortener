import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Profile</h1>
        <p className="text-dark-400 text-sm mt-1">Review your personal settings and verification levels.</p>
      </div>

      <Card className="bg-dark-900/40 border border-dark-700/60">
        <CardHeader>
          <CardTitle className="text-lg">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-indigo/15 border border-brand-indigo/35 text-brand-indigo flex items-center justify-center font-bold text-2xl uppercase shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{user.name}</h3>
              <span className="text-xs text-dark-400 font-semibold uppercase tracking-wider block mt-1">
                Authorized Platform User
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dark-700/50 pt-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-dark-400 font-bold uppercase tracking-wider block">Full Name</span>
              <div className="flex items-center gap-2 text-white font-medium">
                <User className="w-4 h-4 text-brand-indigo" />
                {user.name}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-dark-400 font-bold uppercase tracking-wider block">Email Address</span>
              <div className="flex items-center gap-2 text-white font-medium select-all">
                <Mail className="w-4 h-4 text-brand-cyan" />
                {user.email}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-dark-400 font-bold uppercase tracking-wider block">Member Since</span>
              <div className="flex items-center gap-2 text-white font-medium">
                <Calendar className="w-4 h-4 text-brand-violet" />
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'June 13, 2026'}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-dark-400 font-bold uppercase tracking-wider block">Security Tier</span>
              <div className="flex items-center gap-2 text-white font-medium">
                <Shield className="w-4 h-4 text-brand-success" />
                JWT / Hashed Crypt Credentials
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
