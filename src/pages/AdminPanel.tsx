import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Screen {
  id: string;
  pin: string;
  name: string;
  status: "online" | "offline";
  modules: ContentModule[];
}

interface ContentModule {
  id: string;
  type: string;
  data: any;
}

interface ScheduleItem {
  time: string;
  subject: string;
  room: string;
}

const moduleTemplates = [
  { 
    type: "text", 
    icon: "Type", 
    label: "Текст", 
    color: "bg-blue-500",
    preview: { title: "Заголовок", content: "Текст сообщения" }
  },
  { 
    type: "image", 
    icon: "Image", 
    label: "Изображение", 
    color: "bg-purple-500",
    preview: { url: "https://cdn.poehali.dev/files/9c83f3d9-b448-4541-a381-2fe8e05356b1.jpg", alt: "Фото" }
  },
  { 
    type: "weather", 
    icon: "CloudRain", 
    label: "Погода", 
    color: "bg-cyan-500",
    preview: { location: "Москва", temp: "+6°", condition: "Небольшой дождь" }
  },
  { 
    type: "time", 
    icon: "Clock", 
    label: "Часы", 
    color: "bg-indigo-500",
    preview: {}
  },
  { 
    type: "schedule", 
    icon: "Calendar", 
    label: "Расписание", 
    color: "bg-emerald-500",
    preview: { items: [
      { time: "09:00", subject: "Русский язык", room: "каб. 207" },
      { time: "10:00", subject: "Математика", room: "каб. 215" }
    ]}
  },
];

const AdminPanel = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ContentModule | null>(null);
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screen | null>(null);
  const [isEditScreenOpen, setIsEditScreenOpen] = useState(false);
  const [deleteScreenId, setDeleteScreenId] = useState<string | null>(null);
  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedScreens = localStorage.getItem('all-screens');
    if (savedScreens) {
      setScreens(JSON.parse(savedScreens));
    }
  }, []);

  const saveScreensToStorage = (updatedScreens: Screen[]) => {
    setScreens(updatedScreens);
    localStorage.setItem('all-screens', JSON.stringify(updatedScreens));
    
    updatedScreens.forEach(screen => {
      localStorage.setItem(`screen-${screen.pin}`, JSON.stringify({ modules: screen.modules }));
    });
  };

  const connectScreen = () => {
    if (pinInput.length !== 6) {
      toast({
        title: "Ошибка",
        description: "PIN-код должен состоять из 6 цифр",
        variant: "destructive",
      });
      return;
    }

    const exists = screens.find(s => s.pin === pinInput);
    if (exists) {
      toast({
        title: "Ошибка",
        description: "Экран с таким PIN уже подключен",
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

    const updatedScreens = [...screens, newScreen];
    saveScreensToStorage(updatedScreens);
    
    toast({
      title: "✓ Экран подключен",
      description: `PIN ${pinInput} успешно привязан`,
    });

    setPinInput("");
    setSelectedScreen(newScreen.id);
  };

  const updateScreenName = () => {
    if (!editingScreen) return;
    
    const updatedScreens = screens.map(s => 
      s.id === editingScreen.id ? { ...s, name: editingScreen.name } : s
    );
    saveScreensToStorage(updatedScreens);
    
    toast({
      title: "✓ Экран переименован",
      description: `Название изменено на "${editingScreen.name}"`,
    });
    
    setIsEditScreenOpen(false);
    setEditingScreen(null);
  };

  const deleteScreen = () => {
    if (!deleteScreenId) return;
    
    const screen = screens.find(s => s.id === deleteScreenId);
    if (screen) {
      localStorage.removeItem(`screen-${screen.pin}`);
    }
    
    const updatedScreens = screens.filter(s => s.id !== deleteScreenId);
    saveScreensToStorage(updatedScreens);
    
    if (selectedScreen === deleteScreenId) {
      setSelectedScreen(null);
    }
    
    toast({
      title: "✓ Экран удален",
      description: "Экран успешно отключен",
    });
    
    setDeleteScreenId(null);
  };

  const addModule = (template: typeof moduleTemplates[0]) => {
    if (!selectedScreen) return;

    const screen = screens.find((s) => s.id === selectedScreen);
    if (!screen) return;

    const newModule: ContentModule = {
      id: Date.now().toString(),
      type: template.type,
      data: JSON.parse(JSON.stringify(template.preview)),
    };

    const updatedModules = [...screen.modules, newModule];
    const updatedScreens = screens.map((s) =>
      s.id === selectedScreen ? { ...s, modules: updatedModules } : s
    );

    saveScreensToStorage(updatedScreens);

    toast({
      title: "✓ Модуль добавлен",
      description: `${template.label} добавлен на экран`,
    });

    setIsAddModuleOpen(false);
  };

  const updateModule = () => {
    if (!editingModule || !selectedScreen) return;

    const screen = screens.find((s) => s.id === selectedScreen);
    if (!screen) return;

    const updatedModules = screen.modules.map(m => 
      m.id === editingModule.id ? editingModule : m
    );
    
    const updatedScreens = screens.map((s) =>
      s.id === selectedScreen ? { ...s, modules: updatedModules } : s
    );

    saveScreensToStorage(updatedScreens);

    toast({
      title: "✓ Модуль обновлен",
      description: "Изменения сохранены",
    });

    setIsEditModuleOpen(false);
    setEditingModule(null);
  };

  const removeModule = (moduleId: string) => {
    if (!selectedScreen) return;

    const screen = screens.find((s) => s.id === selectedScreen);
    if (!screen) return;

    const updatedModules = screen.modules.filter((m) => m.id !== moduleId);
    const updatedScreens = screens.map((s) =>
      s.id === selectedScreen ? { ...s, modules: updatedModules } : s
    );

    saveScreensToStorage(updatedScreens);

    toast({
      title: "✓ Модуль удален",
      description: "Модуль успешно удален с экрана",
    });
  };

  const handleDragStart = (moduleId: string) => {
    setDraggedModuleId(moduleId);
  };

  const handleDragOver = (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();
    if (!draggedModuleId || draggedModuleId === targetModuleId || !selectedScreen) return;

    const screen = screens.find((s) => s.id === selectedScreen);
    if (!screen) return;

    const draggedIndex = screen.modules.findIndex(m => m.id === draggedModuleId);
    const targetIndex = screen.modules.findIndex(m => m.id === targetModuleId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newModules = [...screen.modules];
    const [draggedModule] = newModules.splice(draggedIndex, 1);
    newModules.splice(targetIndex, 0, draggedModule);

    const updatedScreens = screens.map((s) =>
      s.id === selectedScreen ? { ...s, modules: newModules } : s
    );

    saveScreensToStorage(updatedScreens);
  };

  const handleDragEnd = () => {
    setDraggedModuleId(null);
  };

  const openEditModule = (module: ContentModule) => {
    setEditingModule(JSON.parse(JSON.stringify(module)));
    setIsEditModuleOpen(true);
  };

  const updateScheduleItem = (index: number, field: keyof ScheduleItem, value: string) => {
    if (!editingModule || editingModule.type !== 'schedule') return;
    
    const newItems = [...editingModule.data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingModule({ ...editingModule, data: { ...editingModule.data, items: newItems } });
  };

  const addScheduleItem = () => {
    if (!editingModule || editingModule.type !== 'schedule') return;
    
    const newItem = { time: "12:00", subject: "Новый предмет", room: "каб. 101" };
    setEditingModule({ 
      ...editingModule, 
      data: { ...editingModule.data, items: [...editingModule.data.items, newItem] } 
    });
  };

  const removeScheduleItem = (index: number) => {
    if (!editingModule || editingModule.type !== 'schedule') return;
    
    const newItems = editingModule.data.items.filter((_: any, i: number) => i !== index);
    setEditingModule({ ...editingModule, data: { ...editingModule.data, items: newItems } });
  };

  const selectedScreenData = screens.find((s) => s.id === selectedScreen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Icon name="Settings" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">Админ панель</h1>
                <p className="text-sm text-gray-500">Управление экранами</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm font-medium px-4 py-2">
              {screens.length} {screens.length === 1 ? "экран" : "экранов"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {screens.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="p-12 max-w-md w-full text-center animate-scale-in">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="MonitorPlay" size={40} className="text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-3">Подключите экран</h2>
              <p className="text-gray-600 mb-8">
                Откройте режим экрана на устройстве и введите PIN-код
              </p>
              <div>
                <Label htmlFor="pin" className="text-left block mb-2 font-medium">PIN-код</Label>
                <Input
                  id="pin"
                  placeholder="000000"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-wider h-14 mb-4"
                />
                <Button onClick={connectScreen} size="lg" className="w-full">
                  <Icon name="Link" size={20} className="mr-2" />
                  Подключить экран
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-lg">Экраны</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Icon name="Plus" size={16} className="mr-1" />
                      Новый
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Подключить новый экран</DialogTitle>
                      <DialogDescription>
                        Введите PIN-код с экрана
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="new-pin">PIN-код</Label>
                        <Input
                          id="new-pin"
                          placeholder="000000"
                          value={pinInput}
                          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                          maxLength={6}
                          className="text-center text-xl font-mono mt-2"
                        />
                      </div>
                      <Button onClick={connectScreen} className="w-full">
                        Подключить
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {screens.map((screen, idx) => (
                <Card
                  key={screen.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md animate-fade-in group ${
                    selectedScreen === screen.id
                      ? "ring-2 ring-primary shadow-lg bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  onClick={() => setSelectedScreen(screen.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedScreen === screen.id ? 'bg-primary text-white' : 'bg-gray-100'
                      }`}>
                        <Icon name="Monitor" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{screen.name}</h4>
                        <p className="text-xs text-gray-500 font-mono">PIN: {screen.pin}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingScreen(screen);
                          setIsEditScreenOpen(true);
                        }}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <Icon name="Pencil" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteScreenId(screen.id);
                        }}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <Icon name="Trash2" size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <Badge variant={screen.status === "online" ? "default" : "secondary"} className="text-xs mr-2">
                    {screen.status === "online" ? "Онлайн" : "Офлайн"}
                  </Badge>
                  <span className="text-xs text-gray-600">
                    <Icon name="LayoutGrid" size={12} className="inline mr-1" />
                    {screen.modules.length} модулей
                  </span>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-8">
              {!selectedScreen ? (
                <Card className="p-12 text-center">
                  <Icon name="MonitorOff" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Выберите экран</p>
                </Card>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-bold">
                        {selectedScreenData?.name}
                      </h2>
                      <p className="text-sm text-gray-500">Управление модулями</p>
                    </div>
                    <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Icon name="Plus" size={20} className="mr-2" />
                          Добавить модуль
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Выберите тип модуля</DialogTitle>
                          <DialogDescription>
                            Добавьте новый блок контента на экран
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          {moduleTemplates.map((template) => (
                            <button
                              key={template.type}
                              onClick={() => addModule(template)}
                              className="p-6 border-2 rounded-2xl hover:border-primary hover:shadow-lg transition-all text-left group"
                            >
                              <div className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon name={template.icon as any} size={24} className="text-white" />
                              </div>
                              <h3 className="font-semibold mb-1">{template.label}</h3>
                              <p className="text-xs text-gray-500">Нажмите для добавления</p>
                            </button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {selectedScreenData && selectedScreenData.modules.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Icon name="LayoutGrid" size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 mb-4">Нет модулей на экране</p>
                      <Button onClick={() => setIsAddModuleOpen(true)} variant="outline">
                        Добавить первый модуль
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {selectedScreenData?.modules.map((module, idx) => {
                        const template = moduleTemplates.find((t) => t.type === module.type);
                        return (
                          <Card 
                            key={module.id}
                            draggable
                            onDragStart={() => handleDragStart(module.id)}
                            onDragOver={(e) => handleDragOver(e, module.id)}
                            onDragEnd={handleDragEnd}
                            className={`p-6 hover:shadow-lg transition-all group animate-scale-in cursor-move ${
                              draggedModuleId === module.id ? 'opacity-50' : ''
                            }`}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${template?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center`}>
                                  <Icon name={template?.icon as any || "Square"} size={20} className="text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{template?.label}</h4>
                                  <p className="text-xs text-gray-500">ID: {module.id.slice(-6)}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModule(module)}
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                >
                                  <Icon name="Pencil" size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeModule(module.id)}
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                                >
                                  <Icon name="Trash2" size={14} className="text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                              <Icon name="GripVertical" size={14} className="inline mr-1 text-gray-400" />
                              <span className="text-gray-400">Перетащите для изменения порядка</span>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isEditScreenOpen} onOpenChange={setIsEditScreenOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать экран</DialogTitle>
            <DialogDescription>Измените название экрана</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="screen-name">Название</Label>
              <Input
                id="screen-name"
                value={editingScreen?.name || ''}
                onChange={(e) => setEditingScreen(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="mt-2"
              />
            </div>
            <Button onClick={updateScreenName} className="w-full">
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModuleOpen} onOpenChange={setIsEditModuleOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать модуль</DialogTitle>
            <DialogDescription>
              Измените содержимое модуля
            </DialogDescription>
          </DialogHeader>
          
          {editingModule && (
            <div className="space-y-4 pt-4">
              {editingModule.type === 'text' && (
                <>
                  <div>
                    <Label htmlFor="text-title">Заголовок</Label>
                    <Input
                      id="text-title"
                      value={editingModule.data.title}
                      onChange={(e) => setEditingModule({ ...editingModule, data: { ...editingModule.data, title: e.target.value } })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-content">Текст</Label>
                    <Textarea
                      id="text-content"
                      value={editingModule.data.content}
                      onChange={(e) => setEditingModule({ ...editingModule, data: { ...editingModule.data, content: e.target.value } })}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {editingModule.type === 'image' && (
                <>
                  <div>
                    <Label htmlFor="image-url">URL изображения</Label>
                    <Input
                      id="image-url"
                      value={editingModule.data.url}
                      onChange={(e) => setEditingModule({ ...editingModule, data: { ...editingModule.data, url: e.target.value } })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-alt">Описание</Label>
                    <Input
                      id="image-alt"
                      value={editingModule.data.alt}
                      onChange={(e) => setEditingModule({ ...editingModule, data: { ...editingModule.data, alt: e.target.value } })}
                      className="mt-2"
                    />
                  </div>
                  {editingModule.data.url && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Предпросмотр:</p>
                      <img src={editingModule.data.url} alt={editingModule.data.alt} className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </>
              )}

              {editingModule.type === 'weather' && (
                <>
                  <div>
                    <Label htmlFor="weather-location">Город</Label>
                    <Input
                      id="weather-location"
                      value={editingModule.data.location}
                      onChange={(e) => setEditingModule({ ...editingModule, data: { ...editingModule.data, location: e.target.value } })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weather-temp">Температура</Label>
                    <Input
                      id="weather-temp"
                      value={editingModule.data.temp}
                      onChange={(e) => setEditingModule({ ...editingModule, data: { ...editingModule.data, temp: e.target.value } })}
                      placeholder="+6°"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weather-condition">Условия</Label>
                    <Input
                      id="weather-condition"
                      value={editingModule.data.condition}
                      onChange={(e) => setEditingModule({ ...editingModule, data: { ...editingModule.data, condition: e.target.value } })}
                      placeholder="Небольшой дождь"
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {editingModule.type === 'schedule' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Расписание</Label>
                    <Button size="sm" onClick={addScheduleItem} variant="outline">
                      <Icon name="Plus" size={14} className="mr-1" />
                      Добавить
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {editingModule.data.items?.map((item: ScheduleItem, idx: number) => (
                      <Card key={idx} className="p-4">
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Label className="text-xs">Время</Label>
                              <Input
                                value={item.time}
                                onChange={(e) => updateScheduleItem(idx, 'time', e.target.value)}
                                placeholder="09:00"
                                className="mt-1"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeScheduleItem(idx)}
                              className="mt-5"
                            >
                              <Icon name="Trash2" size={14} className="text-red-500" />
                            </Button>
                          </div>
                          <div>
                            <Label className="text-xs">Предмет</Label>
                            <Input
                              value={item.subject}
                              onChange={(e) => updateScheduleItem(idx, 'subject', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Кабинет</Label>
                            <Input
                              value={item.room}
                              onChange={(e) => updateScheduleItem(idx, 'room', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {editingModule.type === 'time' && (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <Icon name="Clock" size={48} className="mx-auto mb-4 text-primary" />
                  <p className="text-gray-600">Модуль часов обновляется автоматически</p>
                </div>
              )}

              <Button onClick={updateModule} className="w-full">
                Сохранить изменения
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteScreenId} onOpenChange={() => setDeleteScreenId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить экран?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Экран будет отключен и все его модули будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={deleteScreen} className="bg-red-500 hover:bg-red-600">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPanel;
