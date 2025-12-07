import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { Button } from './components/Button';
import { generateTryOnImage } from './services/geminiService';
import { ImageState } from './types';

function App() {
  const [personImage, setPersonImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null });
  const [garmentImage, setGarmentImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null });
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File, type: 'PERSON' | 'GARMENT') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newState = {
        file,
        previewUrl: URL.createObjectURL(file),
        base64: reader.result as string
      };
      
      if (type === 'PERSON') setPersonImage(newState);
      else setGarmentImage(newState);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!personImage.file || !garmentImage.file) return;

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const generatedImageBase64 = await generateTryOnImage(personImage.file, garmentImage.file);
      setResultImage(generatedImageBase64);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPersonImage({ file: null, previewUrl: null, base64: null });
    setGarmentImage({ file: null, previewUrl: null, base64: null });
    setResultImage(null);
    setError(null);
  };

  const scrollResultIntoView = (node: HTMLDivElement | null) => {
      if (node) {
          node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            AI Virtual Wardrobe
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience the future of fashion. Upload a photo of yourself and a garment to instantly see how it fits, powered by Gemini 2.5.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-indigo-400 font-bold border border-slate-700">1</span>
                <h3 className="text-xl font-semibold text-white">Your Photo</h3>
             </div>
             <p className="text-slate-400 text-sm mb-2">Upload a clear photo of yourself, preferably with good lighting and simple background.</p>
            <ImageUpload 
              id="person-upload"
              label="Upload Person" 
              imageState={personImage} 
              onUpload={(file) => handleImageUpload(file, 'PERSON')}
              onClear={() => setPersonImage({ file: null, previewUrl: null, base64: null })}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-purple-400 font-bold border border-slate-700">2</span>
                <h3 className="text-xl font-semibold text-white">Garment Photo</h3>
             </div>
             <p className="text-slate-400 text-sm mb-2">Upload an image of the clothing item you want to try on (e.g., shirt, dress, jacket).</p>
            <ImageUpload 
              id="garment-upload"
              label="Upload Garment" 
              imageState={garmentImage} 
              onUpload={(file) => handleImageUpload(file, 'GARMENT')}
              onClear={() => setGarmentImage({ file: null, previewUrl: null, base64: null })}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 mb-12">
          <Button 
            onClick={handleGenerate} 
            disabled={!personImage.file || !garmentImage.file || isLoading}
            isLoading={isLoading}
            className="w-full md:w-auto min-w-[200px] text-lg py-4"
          >
            Generate Try-On
          </Button>
          
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-center max-w-lg">
              <p className="font-semibold flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Generation Failed
              </p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>

        {resultImage && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700" ref={scrollResultIntoView}>
             <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-12"></div>
            
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-8 text-white">Your New Look</h2>
              
              <div className="relative group w-full max-w-2xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-800">
                <img 
                  src={resultImage} 
                  alt="Virtual Try-On Result" 
                  className="w-full h-auto"
                />
                
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center pt-20">
                  <a 
                    href={resultImage} 
                    download="gemini-try-on.png"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Image
                  </a>
                </div>
              </div>

              <div className="mt-8">
                 <Button variant="outline" onClick={handleReset}>
                    Try Another Outfit
                 </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800/60 mt-auto bg-slate-900">
        <p>Powered by Google Gemini 2.5 Flash Image Model</p>
      </footer>
    </div>
  );
}

export default App;
