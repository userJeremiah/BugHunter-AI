
import React, { useState, useMemo } from 'react';
import { BugIcon } from './icons';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clean up language identifier if present
  const cleanedCode = code.replace(/^\w+\n/, '');

  return (
    <div className="relative bg-slate-900/70 rounded-lg my-4 border border-slate-700">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-slate-700 text-slate-300 px-3 py-1 text-xs font-bold rounded-md hover:bg-slate-600 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="p-4 pt-10 text-sm text-slate-200 overflow-x-auto">
        <code>{cleanedCode.trim()}</code>
      </pre>
    </div>
  );
};

interface AnalysisDisplayProps {
  analysis: string;
  onReset: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, onReset }) => {
  const parsedAnalysis = useMemo(() => {
    const extractedMatch = analysis.match(/\*\*Extracted Error\/Context:\*\*\s*([\s\S]*?)(?=\*\*Explanation:\*\*|$)/);
    const explanationMatch = analysis.match(/\*\*Explanation:\*\*\s*([\s\S]*?)(?=\*\*Suggested Fix:\*\*|$)/);
    const fixMatch = analysis.match(/\*\*Suggested Fix:\*\*\s*([\s\S]*)/);

    return {
      extracted: extractedMatch ? extractedMatch[1].trim() : 'Could not extract context.',
      explanation: explanationMatch ? explanationMatch[1].trim() : 'Could not generate explanation.',
      fix: fixMatch ? fixMatch[1].trim() : 'No fix suggested.',
    };
  }, [analysis]);

  const renderFixContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        return <CodeBlock key={index} code={part.slice(3, -3)} />;
      }
      return <p key={index} className="text-slate-300 leading-relaxed my-2">{part}</p>;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-3">Extracted Error/Context</h2>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm">{parsedAnalysis.extracted}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-3">Explanation</h2>
        <p className="text-slate-300 leading-relaxed">{parsedAnalysis.explanation}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-green-400 mb-3">Suggested Fix</h2>
        <div>{renderFixContent(parsedAnalysis.fix)}</div>
      </div>
      
      <div className="pt-6 text-center border-t border-slate-700">
        <button
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Analyze Another Bug
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
