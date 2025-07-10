import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface PremiumLoginAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function PremiumLoginAnimation({ isVisible, onComplete }: PremiumLoginAnimationProps) {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer1 = setTimeout(() => setAnimationStage(1), 200);
      const timer2 = setTimeout(() => setAnimationStage(2), 1000);
      const timer3 = setTimeout(() => setAnimationStage(3), 1800);
      const timer4 = setTimeout(() => {
        onComplete();
        setAnimationStage(0);
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center">
        {/* Ana göz ikonu */}
        <div className={`transition-all duration-1000 ${
          animationStage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}>
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-8 shadow-2xl">
              <Eye className={`w-16 h-16 text-blue-600 transition-transform duration-1000 ${
                animationStage >= 2 ? 'animate-pulse' : ''
              }`} />
            </div>
          </div>
        </div>

        {/* Başlık */}
        <div className={`mt-8 text-center transition-all duration-1000 delay-500 ${
          animationStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-3xl font-bold text-white font-mono mb-2">Visionary Optics</h2>
          <p className="text-white/80 text-lg">Premium sisteme hoş geldiniz</p>
        </div>

        {/* Yükleme çubuğu */}
        <div className={`mt-8 w-64 h-1 bg-white/20 rounded-full overflow-hidden transition-all duration-500 delay-1000 ${
          animationStage >= 3 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        </div>

        {/* Onay mesajı */}
        <div className={`mt-6 text-center transition-all duration-500 delay-1500 ${
          animationStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-white/90 text-sm">Sisteme giriş yapılıyor...</p>
        </div>
      </div>

      {/* Arka plan particle efekti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
