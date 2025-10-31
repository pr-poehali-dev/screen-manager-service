import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface ContentModule {
  id: string;
  type: string;
  data: any;
}

const ScreenDisplay = () => {
  const [pinCode, setPinCode] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modules, setModules] = useState<ContentModule[]>([]);

  useEffect(() => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setPinCode(pin);

    const stored = localStorage.getItem(`screen-${pin}`);
    if (stored) {
      const data = JSON.parse(stored);
      setModules(data.modules || []);
      setIsConnected(true);
    }

    const interval = setInterval(() => {
      const stored = localStorage.getItem(`screen-${pin}`);
      if (stored) {
        const data = JSON.parse(stored);
        setModules(data.modules || []);
        if (!isConnected) setIsConnected(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderModule = (module: ContentModule) => {
    switch (module.type) {
      case "text":
        return (
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50">
            <h3 className="text-3xl font-display font-bold mb-3 text-gray-900">{module.data.title}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">{module.data.content}</p>
          </Card>
        );

      case "image":
        return (
          <Card className="overflow-hidden p-0 border-0">
            <img src={module.data.url} alt={module.data.alt} className="w-full h-full object-cover rounded-2xl" />
          </Card>
        );

      case "weather":
        return (
          <Card className="p-8 bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-2">{module.data.condition}</p>
                <p className="text-6xl font-bold mb-3">{module.data.temp}</p>
                <p className="text-sm opacity-90">{module.data.location}</p>
              </div>
              <Icon name="CloudRain" size={80} className="opacity-90" />
            </div>
          </Card>
        );

      case "time":
        return (
          <Card className="p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 text-white border-0">
            <p className="text-7xl font-bold mb-3 font-mono">
              {currentTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-xl opacity-90 capitalize">
              {currentTime.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </Card>
        );

      case "schedule":
        return (
          <Card className="p-8">
            <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Icon name="Calendar" size={28} className="text-primary" />
              Расписание
            </h3>
            <div className="space-y-4">
              {module.data.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                      <p className="font-mono font-bold text-primary">{item.time}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{item.subject}</p>
                      <p className="text-sm text-gray-500">{item.room}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzAtMS4xMDUtLjg5NS0yLTItMnMtMiAuODk1LTIgMiAuODk1IDIgMiAyIDItLjg5NSAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <Card className="p-16 text-center max-w-2xl relative z-10 animate-scale-in bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float shadow-xl">
            <Icon name="Monitor" size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Подключите экран
          </h1>
          <p className="text-gray-600 mb-10 text-lg">
            Введите этот PIN-код в админ панели
          </p>
          <div className="bg-gradient-to-br from-primary/10 to-purple-100 rounded-3xl p-12 mb-8">
            <p className="text-8xl font-bold text-primary tracking-wider font-mono">
              {pinCode}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <p className="font-medium">Ожидание подключения...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-8 relative">
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-sm px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Подключено
        </Badge>
        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-sm font-mono px-4 py-2">
          PIN: {pinCode}
        </Badge>
      </div>

      {modules.length === 0 ? (
        <div className="h-[90vh] flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Icon name="LayoutGrid" size={40} className="text-gray-400" />
            </div>
            <p className="text-2xl text-gray-400 font-display">Добавьте модули в админ панели</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {modules.map((module, idx) => (
            <div 
              key={module.id} 
              className="animate-scale-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {renderModule(module)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScreenDisplay;
