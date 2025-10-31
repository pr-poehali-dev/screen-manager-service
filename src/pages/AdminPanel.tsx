import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Screen {
  id: string;
  pin: string;
  name: string;
  status: "online" | "offline";
  modules: any[];
}

const AdminPanel = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [moduleType, setModuleType] = useState("");
  const { toast } = useToast();

  const connectScreen = () => {
    if (pinInput.length !== 6) {
      toast({
        title: "Ошибка",
        description: "PIN-код должен состоять из 6 цифр",
        variant: "destructive",
      });
      return;
    }

    const newScreen: Screen = {
      id: Date.now().toString(),
      pin: pinInput,
      name: `Экран ${screens.length + 1}`,
      status: "online",
      modules: [],
    };

    setScreens([...screens, newScreen]);
    localStorage.setItem(`screen-${pinInput}`, JSON.stringify({ modules: [] }));
    
    toast({
      title: "Экран подключен",
      description: `PIN ${pinInput} успешно привязан`,
    });

    setPinInput("");
  };

  const addModule = () => {
    if (!selectedScreen || !moduleType) return;

    const screen = screens.find((s) => s.id === selectedScreen);
    if (!screen) return;

    const newModule: any = {
      id: Date.now().toString(),
      type: moduleType,
      data: {},
    };

    switch (moduleType) {
      case "text":
        newModule.data = { title: "Заголовок", content: "Текст сообщения" };
        break;
      case "weather":
        newModule.data = { location: "Москва" };
        break;
      case "time":
        newModule.data = {};
        break;
      case "schedule":
        newModule.data = {
          items: [
            { time: "09:00", subject: "Русский язык", room: "каб. 207" },
            { time: "10:00", subject: "Математика", room: "каб. 215" },
            { time: "11:00", subject: "История", room: "каб. 312" },
          ],
        };
        break;
      case "image":
        newModule.data = {
          url: "https://cdn.poehali.dev/files/9c83f3d9-b448-4541-a381-2fe8e05356b1.jpg",
          alt: "Изображение",
        };
        break;
    }

    const updatedModules = [...screen.modules, newModule];
    const updatedScreens = screens.map((s) =>
      s.id === selectedScreen ? { ...s, modules: updatedModules } : s
    );

    setScreens(updatedScreens);
    localStorage.setItem(`screen-${screen.pin}`, JSON.stringify({ modules: updatedModules }));

    toast({
      title: "Модуль добавлен",
      description: `${moduleType} добавлен на экран`,
    });

    setIsAddModuleOpen(false);
    setModuleType("");
  };

  const removeModule = (moduleId: string) => {
    if (!selectedScreen) return;

    const screen = screens.find((s) => s.id === selectedScreen);
    if (!screen) return;

    const updatedModules = screen.modules.filter((m) => m.id !== moduleId);
    const updatedScreens = screens.map((s) =>
      s.id === selectedScreen ? { ...s, modules: updatedModules } : s
    );

    setScreens(updatedScreens);
    localStorage.setItem(`screen-${screen.pin}`, JSON.stringify({ modules: updatedModules }));

    toast({
      title: "Модуль удален",
      description: "Модуль успешно удален с экрана",
    });
  };

  const getModuleIcon = (type: string) => {
    const icons: Record<string, string> = {
      text: "Type",
      image: "Image",
      weather: "CloudRain",
      time: "Clock",
      schedule: "Calendar",
    };
    return icons[type] || "Square";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Settings" size={28} className="text-primary" />
              <h1 className="text-2xl font-bold">Панель администратора</h1>
            </div>
            <Badge variant="outline" className="text-sm">
              {screens.length} {screens.length === 1 ? "экран" : "экранов"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="screens" className="space-y-6">
          <TabsList>
            <TabsTrigger value="screens">
              <Icon name="Monitor" size={18} className="mr-2" />
              Экраны
            </TabsTrigger>
            <TabsTrigger value="content">
              <Icon name="LayoutGrid" size={18} className="mr-2" />
              Контент
            </TabsTrigger>
          </TabsList>

          <TabsContent value="screens" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Подключить новый экран</h2>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="pin">PIN-код экрана</Label>
                  <Input
                    id="pin"
                    placeholder="Введите 6-значный PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    maxLength={6}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={connectScreen} size="lg">
                    <Icon name="Link" size={20} className="mr-2" />
                    Подключить
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screens.map((screen) => (
                <Card
                  key={screen.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedScreen === screen.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedScreen(screen.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Monitor" size={24} className="text-primary" />
                      <div>
                        <h3 className="font-semibold">{screen.name}</h3>
                        <p className="text-sm text-gray-500">PIN: {screen.pin}</p>
                      </div>
                    </div>
                    <Badge variant={screen.status === "online" ? "default" : "secondary"}>
                      {screen.status === "online" ? "Онлайн" : "Офлайн"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Модулей: {screen.modules.length}
                  </div>
                </Card>
              ))}
            </div>

            {screens.length === 0 && (
              <div className="text-center py-12">
                <Icon name="MonitorOff" size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Нет подключенных экранов</p>
                <p className="text-sm text-gray-400 mt-2">
                  Откройте страницу экрана и введите PIN-код выше
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {!selectedScreen ? (
              <div className="text-center py-12">
                <Icon name="Monitor" size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Выберите экран для управления контентом</p>
              </div>
            ) : (
              <>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      Модули экрана: {screens.find((s) => s.id === selectedScreen)?.name}
                    </h2>
                    <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Icon name="Plus" size={20} className="mr-2" />
                          Добавить модуль
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Добавить модуль</DialogTitle>
                          <DialogDescription>
                            Выберите тип модуля для добавления на экран
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label>Тип модуля</Label>
                            <Select value={moduleType} onValueChange={setModuleType}>
                              <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Выберите тип" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Type" size={16} />
                                    Текст
                                  </div>
                                </SelectItem>
                                <SelectItem value="image">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Image" size={16} />
                                    Изображение
                                  </div>
                                </SelectItem>
                                <SelectItem value="weather">
                                  <div className="flex items-center gap-2">
                                    <Icon name="CloudRain" size={16} />
                                    Погода
                                  </div>
                                </SelectItem>
                                <SelectItem value="time">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Clock" size={16} />
                                    Часы
                                  </div>
                                </SelectItem>
                                <SelectItem value="schedule">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Calendar" size={16} />
                                    Расписание
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={addModule} className="w-full">
                            Добавить
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {screens
                      .find((s) => s.id === selectedScreen)
                      ?.modules.map((module) => (
                        <Card key={module.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon name={getModuleIcon(module.type)} size={24} className="text-primary" />
                              <div>
                                <p className="font-medium capitalize">{module.type}</p>
                                <p className="text-sm text-gray-500">
                                  ID: {module.id}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeModule(module.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </Card>
                      ))}

                    {screens.find((s) => s.id === selectedScreen)?.modules.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Icon name="LayoutGrid" size={48} className="mx-auto mb-3 text-gray-400" />
                        <p>Нет модулей на этом экране</p>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
