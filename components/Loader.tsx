
import React from 'react';
import { BugIcon } from './icons';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-300">
      <BugIcon className="w-16 h-16 text-green-400 animate-pulse mb-6" />
      <h2 className="text-2xl font-bold mb-2 tracking-wide">Hunting for bugs...</h2>
      <p className="text-slate-400">The AI assistant is analyzing your screenshot.</p>
    </div>
  );
};

export default Loader;
