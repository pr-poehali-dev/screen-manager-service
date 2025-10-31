import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Yjg3ZjUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMS4xMDUtLjg5NS0yLTItMnMtMiAuODk1LTIgMiAuODk1IDIgMiAyIDItLjg5NSAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16 sm:mb-24 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center animate-float shadow-2xl shadow-primary/20">
              <Icon name="MonitorPlay" size={48} className="text-white sm:w-16 sm:h-16" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold text-gray-900 mb-6 tracking-tight">
            Информатор
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto font-light">
            Управляйте цифровыми экранами через браузер
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div 
            onClick={() => navigate('/admin')}
            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-gray-200/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 animate-scale-in"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <Icon name="Settings" size={32} className="text-primary" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-4">
                Админ панель
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Подключайте экраны, управляйте контентом и модулями
              </p>
              
              <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                Открыть
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/screen')}
            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-gray-200/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 animate-scale-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <Icon name="Monitor" size={32} className="text-blue-600" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-4">
                Режим экрана
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Отобразите контент на любом устройстве
              </p>
              
              <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                Подключить
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex items-center gap-8 bg-white/60 backdrop-blur-sm px-8 py-4 rounded-full border border-gray-200/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Real-time sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-primary" />
              <span className="text-sm text-gray-600 font-medium">Мгновенное обновление</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Smartphone" size={16} className="text-primary" />
              <span className="text-sm text-gray-600 font-medium">Любые устройства</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
