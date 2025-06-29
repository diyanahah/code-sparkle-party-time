
import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, Printer, Palette, Clock, Sun, Moon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

interface QRData {
  text: string;
  url: string;
  email: string;
  phone: string;
  name: string;
  company: string;
}

const QRGenerator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [qrData, setQRData] = useState<QRData>({
    text: '',
    url: '',
    email: '',
    phone: '',
    name: '',
    company: ''
  });
  const [activeTab, setActiveTab] = useState('text');
  const [qrStyle, setQrStyle] = useState('business');
  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [generatedQR, setGeneratedQR] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dark mode toggle effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const generateConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = confetti.style.height = Math.random() * 10 + 5 + 'px';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  };

  const generateQRCode = async () => {
    let qrContent = '';
    
    switch (activeTab) {
      case 'text':
        qrContent = qrData.text;
        break;
      case 'url':
        qrContent = qrData.url.startsWith('http') ? qrData.url : `https://${qrData.url}`;
        break;
      case 'contact':
        qrContent = `BEGIN:VCARD
VERSION:3.0
FN:${qrData.name}
ORG:${qrData.company}
EMAIL:${qrData.email}
TEL:${qrData.phone}
END:VCARD`;
        break;
    }

    if (!qrContent.trim()) {
      toast({
        title: "Oops! 🤔",
        description: "Please enter some content to generate your QR code!",
        duration: 3000,
      });
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCodeLib.toCanvas(canvas, qrContent, {
        width: 300,
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor
        },
        errorCorrectionLevel: 'M'
      });

      setGeneratedQR(qrContent);
      generateConfetti();
      
      toast({
        title: "QR Code Generated! 🎉",
        description: "Your awesome QR code is ready to rock!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error! 😅",
        description: "Something went wrong generating your QR code. Please try again!",
        duration: 3000,
      });
    }
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Downloaded! 📥",
      description: "Your QR code has been saved to your device!",
      duration: 3000,
    });
  };

  const printQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>QR Code</title></head>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <img src="${canvas.toDataURL()}" style="max-width: 100%; max-height: 100%;" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Ready to Print! 🖨️",
      description: "Print dialog opened for your QR code!",
      duration: 3000,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100'
    }`} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header with Clock and Dark Mode Toggle */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h1 className="text-4xl lg:text-6xl font-black gradient-text animate-bounce-gentle">
              QR Magic ✨
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mt-2">
              Create stunning QR codes that pop! 🚀
            </p>
          </div>
          
          {/* Digital Clock */}
          <div className="flex flex-col items-center space-y-2">
            <div className={`px-6 py-3 rounded-2xl glass-effect ${
              isDarkMode ? 'text-cyan-300' : 'text-purple-600'
            } animate-neon-glow font-mono text-2xl font-bold`}>
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {formatDate(currentTime)}
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="data-[state=checked]:bg-purple-600"
              />
              <Moon className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="glass-effect border-2 border-transparent gradient-border animate-float">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <span>What's Your Content?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="text" className="font-bold">✏️ Text</TabsTrigger>
                    <TabsTrigger value="url" className="font-bold">🔗 URL</TabsTrigger>
                    <TabsTrigger value="contact" className="font-bold">👤 Contact</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      placeholder="Type your amazing message here! 💭"
                      value={qrData.text}
                      onChange={(e) => setQRData({ ...qrData, text: e.target.value })}
                      className="min-h-[120px] text-lg border-2 focus:border-purple-400 transition-all duration-300 rounded-xl"
                    />
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    <Input
                      placeholder="https://your-awesome-website.com 🌐"
                      value={qrData.url}
                      onChange={(e) => setQRData({ ...qrData, url: e.target.value })}
                      className="text-lg border-2 focus:border-blue-400 transition-all duration-300 rounded-xl"
                    />
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Full Name 👋"
                        value={qrData.name}
                        onChange={(e) => setQRData({ ...qrData, name: e.target.value })}
                        className="border-2 focus:border-green-400 transition-all duration-300 rounded-xl"
                      />
                      <Input
                        placeholder="Company 🏢"
                        value={qrData.company}
                        onChange={(e) => setQRData({ ...qrData, company: e.target.value })}
                        className="border-2 focus:border-green-400 transition-all duration-300 rounded-xl"
                      />
                      <Input
                        placeholder="email@awesome.com 📧"
                        value={qrData.email}
                        onChange={(e) => setQRData({ ...qrData, email: e.target.value })}
                        className="border-2 focus:border-green-400 transition-all duration-300 rounded-xl"
                      />
                      <Input
                        placeholder="Phone Number 📱"
                        value={qrData.phone}
                        onChange={(e) => setQRData({ ...qrData, phone: e.target.value })}
                        className="border-2 focus:border-green-400 transition-all duration-300 rounded-xl"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Style Customization */}
            <Card className="glass-effect border-2 border-transparent gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Palette className="w-5 h-5 text-pink-500" />
                  <span>Style Your QR</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">QR Style Theme</label>
                  <Select value={qrStyle} onValueChange={setQrStyle}>
                    <SelectTrigger className="rounded-xl border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-2 z-50">
                      <SelectItem value="business">🏢 Business Pro</SelectItem>
                      <SelectItem value="party">🎉 Party Vibes</SelectItem>
                      <SelectItem value="tech">💻 Tech Style</SelectItem>
                      <SelectItem value="artistic">🎨 Artistic</SelectItem>
                      <SelectItem value="minimal">✨ Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">QR Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-12 h-12 rounded-xl border-2 cursor-pointer"
                      />
                      <span className="text-sm font-mono">{qrColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Background</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-12 rounded-xl border-2 cursor-pointer"
                      />
                      <span className="text-sm font-mono">{bgColor}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Display Section */}
          <div className="space-y-6">
            <Card className="glass-effect border-2 border-transparent gradient-border animate-float" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-2xl">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-6 h-6 text-blue-500" />
                    <span>Your QR Code</span>
                  </div>
                  <Badge variant="secondary" className="animate-bounce-gentle">
                    {qrStyle.charAt(0).toUpperCase() + qrStyle.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <div className="relative p-8 bg-white rounded-3xl shadow-2xl border-4 border-gradient-to-r from-purple-400 to-pink-400">
                  <canvas
                    ref={canvasRef}
                    className="rounded-2xl max-w-full h-auto"
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                  {!generatedQR && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-3xl">
                      <div className="text-center text-gray-400">
                        <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Your QR code will appear here! ✨</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    onClick={generateQRCode}
                    className="flex-1 bg-gradient-rainbow text-white font-bold py-4 px-8 rounded-2xl text-lg hover:scale-105 transition-all duration-300 animate-pulse-color"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Magic! ✨
                  </Button>
                </div>

                <div className="flex gap-3 w-full">
                  <Button
                    onClick={downloadQR}
                    variant="outline"
                    className="flex-1 border-2 border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl py-3 transition-all duration-300 hover:scale-105"
                    disabled={!generatedQR}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={printQR}
                    variant="outline"
                    className="flex-1 border-2 border-purple-400 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl py-3 transition-all duration-300 hover:scale-105"
                    disabled={!generatedQR}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="glass-effect border-2 border-transparent gradient-border">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  💡 Pro Tips
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Keep URLs short for cleaner QR codes</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span>🎨</span>
                    <span>High contrast colors work best</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span>📱</span>
                    <span>Test your QR codes before sharing</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
