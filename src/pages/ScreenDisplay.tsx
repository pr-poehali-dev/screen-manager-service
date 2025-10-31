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
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-2">{module.data.title}</h3>
            <p className="text-gray-600">{module.data.content}</p>
          </div>
        );

      case "image":
        return (
          <div className="rounded-lg overflow-hidden shadow-sm">
            <img src={module.data.url} alt={module.data.alt} className="w-full h-auto" />
          </div>
        );

      case "weather":
        return (
          <Card className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Небольшой дождь</p>
                <p className="text-5xl font-bold">+6°</p>
                <p className="text-sm opacity-90 mt-2">Влажность: 79% • Ветер: 4.68 м/с</p>
              </div>
              <Icon name="CloudRain" size={64} />
            </div>
          </Card>
        );

      case "time":
        return (
          <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <p className="text-6xl font-bold">
              {currentTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-lg mt-2 opacity-90">
              {currentTime.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </Card>
        );

      case "schedule":
        return (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Расписание</h3>
            <div className="space-y-3">
              {module.data.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.time}</p>
                    <p className="text-sm text-gray-600">{item.subject}</p>
                  </div>
                  <Badge variant="outline">{item.room}</Badge>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
        <Card className="p-12 text-center max-w-2xl">
          <Icon name="Monitor" size={80} className="mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Подключите экран</h1>
          <p className="text-gray-600 mb-8">
            Введите этот PIN-код в панели администратора
          </p>
          <div className="bg-primary/10 rounded-lg p-8 mb-6">
            <p className="text-7xl font-bold text-primary tracking-wider">{pinCode}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Ожидание подключения...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Badge variant="outline" className="bg-white">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Подключено
        </Badge>
        <Badge variant="outline" className="bg-white font-mono">
          PIN: {pinCode}
        </Badge>
      </div>

      {modules.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Icon name="LayoutGrid" size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-500">Добавьте модули в панели администратора</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {modules.map((module) => (
            <div key={module.id} className="animate-fade-in">
              {renderModule(module)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScreenDisplay;
