import React, { useState, useCallback } from 'react';
import { BugIcon } from './components/icons';
import ImageUploader from './components/ImageUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import { analyzeBugScreenshot } from './services/geminiService';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setError(null);
  }, []);

  const handleClearImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  }, [previewUrl]);

  const handleAnalyzeClick = async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeBugScreenshot(imageFile);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please check the console and your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-4xl text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
          <BugIcon className="w-12 h-12 text-green-400" />
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 tracking-tight">Bug Hunter</h1>
        </div>
        <p className="text-lg text-slate-400">Your AI Debugging Assistant</p>
      </header>

      <main className="w-full max-w-4xl bg-slate-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700">
        {isLoading ? (
          <Loader />
        ) : analysis ? (
          <AnalysisDisplay analysis={analysis} onReset={handleClearImage} />
        ) : (
          <>
            <ImageUploader 
              onImageUpload={handleImageUpload}
              previewUrl={previewUrl}
              onClearImage={handleClearImage}
            />
            {error && (
              <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
            {previewUrl && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <BugIcon className="w-6 h-6 mr-2" />
                  Hunt for Bugs
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <footer className="mt-8 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;