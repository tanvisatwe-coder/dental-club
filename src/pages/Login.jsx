import React from 'react';

const Login = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border border-slate-200">
        
        {/* Branding header */}
        <div>
          <span className="text-5xl">🦷</span>
          <h2 className="text-3xl font-extrabold text-indigo-950 mt-2">DentalClub</h2>
          <p className="text-sm text-slate-400 mt-1">Select your portal role to begin</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* DENTIST LOGIN BUTTON */}
          <button 
            onClick={() => onLogin('dentist')}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            <span>👨‍⚕️</span> Staff / Dentist Login
          </button>

          {/* PATIENT LOGIN BUTTON */}
          <button 
            onClick={() => onLogin('patient')}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-4 rounded-2xl shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            <span>😊</span> Patient Portal Login
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Demo Mode: Click either button to instantly access full frontend interfaces.
        </p>
      </div>
    </div>
  );
};

export default Login;