import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Settings, ShieldAlert, Monitor, Sliders, Globe } from 'lucide-react';
import Button from '../components/ui/Button';

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-dark-400 text-sm mt-1">Configure your default redirect behaviors and security preferences.</p>
      </div>

      <Card className="bg-dark-900/40 border border-dark-700/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-indigo" />
            General Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2.5 border-b border-dark-800">
            <div>
              <span className="text-sm font-bold text-white block">Base Redirection Domain</span>
              <span className="text-xs text-dark-400 mt-0.5 block">Define what URL points to shortcode redirects.</span>
            </div>
            <span className="text-xs font-semibold text-brand-cyan select-all font-mono">
              http://localhost:5000
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-dark-800">
            <div>
              <span className="text-sm font-bold text-white block">Default Link Expiry</span>
              <span className="text-xs text-dark-400 mt-0.5 block">Configure general expiry lifespans for newly created links.</span>
            </div>
            <span className="text-xs font-semibold text-white">
              No Default Expiry
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5">
            <div>
              <span className="text-sm font-bold text-white block">Display Theme</span>
              <span className="text-xs text-dark-400 mt-0.5 block">Manage visual theme values for the dashboard.</span>
            </div>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-brand-indigo/20 text-brand-indigo border border-brand-indigo/35">
              Dark Mode (Default)
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-dark-900/40 border border-dark-700/60 border-brand-indigo/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <ShieldAlert className="w-5 h-5 text-brand-indigo" />
            API & Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-dark-400 leading-relaxed">
            LinkPulse allows integration of link metrics directly into Slack, Discord, and third-party dashboards using developer API Access Tokens.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value="lp_live_728fba10cb39986de1c81cf5d852a"
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-xs text-brand-cyan font-mono focus:outline-none"
            />
            <Button variant="secondary" size="sm" onClick={() => alert('API Key Copied!')}>
              Copy Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
