import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📺 Информатор
          </h1>
          <p className="text-xl text-gray-600">
            Система управления цифровыми экранами
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group" onClick={() => navigate('/admin')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Settings" size={40} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Панель администратора
              </h2>
              <p className="text-gray-600">
                Управление экранами, контентом и настройками
              </p>
              <Button size="lg" className="mt-4 w-full">
                <Icon name="ArrowRight" size={20} className="ml-2" />
                Открыть панель
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer group" onClick={() => navigate('/screen')}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Monitor" size={40} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Режим отображения
              </h2>
              <p className="text-gray-600">
                Подключить экран и показывать контент
              </p>
              <Button size="lg" variant="outline" className="mt-4 w-full">
                <Icon name="ArrowRight" size={20} className="ml-2" />
                Открыть экран
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Подключайте любые экраны через браузер и управляйте контентом в реальном времени</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
