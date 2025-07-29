
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Users, FileText, BarChart3, Shield, Clock, Monitor, Smartphone, Zap, Star, CheckCircle, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Eye className="w-8 h-8 text-[#2E2E2E]" />,
      title: "Reçete Yönetimi",
      description: "Müşterilerinizin gözlük reçetelerini detaylı bir şekilde kaydedin ve takip edin. Sağ ve sol göz değerlerini ayrı ayrı girebilir, cam tipi ve rengini belirleyebilirsiniz."
    },
    {
      icon: <Users className="w-8 h-8 text-[#2E2E2E]" />,
      title: "Müşteri Veritabanı",
      description: "Müşteri bilgilerini güvenli bir şekilde saklayın. TC kimlik numarası ile hızlı arama yapın ve geçmiş siparişlere kolayca ulaşın."
    },
    {
      icon: <FileText className="w-8 h-8 text-[#2E2E2E]" />,
      title: "Sipariş Takibi",
      description: "Siparişleri durumlarına göre sınıflandırın: Yeni, Teslim edildi, İade. Toplam ciroyu otomatik hesaplayın ve izleyin."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-[#2E2E2E]" />,
      title: "Analiz ve Raporlama",
      description: "İş performansınızı anlık olarak takip edin. Toplam sipariş sayısı, aktif müşteri sayısı ve yeni reçeteler gibi önemli metrikleri görün."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#2E2E2E]" />,
      title: "Güvenli Veri Saklama",
      description: "Tüm müşteri bilgileri ve reçeteler güvenli bulut teknolojisi ile korunur. Verileriniz sadece size ait ve tamamen gizlidir."
    },
    {
      icon: <Clock className="w-8 h-8 text-[#2E2E2E]" />,
      title: "Gerçek Zamanlı Güncelleme",
      description: "Sistem anlık olarak güncellenir. Yeni siparişler ve müşteri bilgileri hemen dashboard'da görünür."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-xl">
                <Eye className="w-16 h-16 text-blue-600 mx-auto" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Melis Optik
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Gözlükçü işletmeniz için özel olarak tasarlanmış profesyonel yönetim sistemi. 
            Reçetelerden siparişlere, müşteri takibinden analizlere kadar tüm ihtiyaçlarınızı karşılar.
          </p>
          
          {/* Demo Preview Section */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <Monitor className="w-8 h-8 text-[#2E2E2E] mb-3" />
                  <h3 className="font-semibold text-[#2E2E2E] dark:text-white mb-2">Dashboard</h3>
                  <p className="text-sm text-[#2E2E2E] dark:text-gray-300">Tüm verilerinizi tek bakışta görün</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <Users className="w-8 h-8 text-[#2E2E2E] mb-3" />
                  <h3 className="font-semibold text-[#2E2E2E] dark:text-white mb-2">Müşteri Yönetimi</h3>
                  <p className="text-sm text-[#2E2E2E] dark:text-gray-300">Hızlı ve güvenli müşteri takibi</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <FileText className="w-8 h-8 text-[#2E2E2E] mb-3" />
                  <h3 className="font-semibold text-[#2E2E2E] dark:text-white mb-2">Reçete Sistemi</h3>
                  <p className="text-sm text-[#2E2E2E] dark:text-gray-300">Dijital reçete yönetimi</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Hemen Başlayın
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Ücretsiz deneme</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-blue-500">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded-lg group-hover:bg-gray-100 dark:group-hover:bg-gray-900/30 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-[#2E2E2E] dark:text-gray-400 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Hemen kullanıma hazır
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white relative z-10">
            Neden Melis Optik?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-full">
                  <Zap className="w-6 h-6 text-[#2E2E2E]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Kolay Kullanım</h3>
                  <p className="text-[#2E2E2E] dark:text-gray-300">
                    Kullanıcı dostu arayüz sayesinde dakikalar içinde sistemi öğrenin. Teknik bilgi gerektirmez.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-full">
                  <BarChart3 className="w-6 h-6 text-[#2E2E2E]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Detaylı Takip</h3>
                  <p className="text-[#2E2E2E] dark:text-gray-300">
                    Her müşterinizin reçete geçmişini, sipariş durumunu ve ödeme bilgilerini tek yerden yönetin.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-full">
                  <Clock className="w-6 h-6 text-[#2E2E2E]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Hız ve Verimlilik</h3>
                  <p className="text-[#2E2E2E] dark:text-gray-300">
                    TC kimlik numarası ile anında müşteri bilgilerine ulaşın. Zaman kaybetmeyin.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-full">
                  <Shield className="w-6 h-6 text-[#2E2E2E]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">Güvenlik</h3>
                  <p className="text-[#2E2E2E] dark:text-gray-300">
                    Müşteri verileriniz en üst düzeyde güvenlik protokolleri ile korunur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-8 w-8 h-8 bg-white/10 rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              İşletmenizi Dijitalleştirin
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Bugün başlayın ve işletmenizi modern çağa taşıyın
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span>Anında kurulum</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span>7/24 destek</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span>Ücretsiz eğitim</span>
              </div>
            </div>
            
            <Button 
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg flex items-center gap-2 mx-auto"
            >
              <Star className="w-5 h-5" />
              Hemen Başla
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>© 2024 Melis Optik. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  );
}
