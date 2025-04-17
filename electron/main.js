const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const url = require('url'); // url modülünü ekle
const isDev = require('electron-is-dev');
const fs = require('fs');
const os = require('os');

let mainWindow;

// Debug amaçlı dizin bilgilerini yazdır
function debugDirectories() {
  const dirs = {
    current: process.cwd(),
    appPath: app.getAppPath(),
    appData: app.getPath('appData'),
    userData: app.getPath('userData'),
    exe: app.getPath('exe'),
    module: app.getPath('module'),
    resourcesPath: process.resourcesPath,
    __dirname: __dirname
  };
  
  console.log('===== UYGULAMA DİZİNLERİ =====');
  Object.entries(dirs).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.log('==============================');
  
  return dirs;
}

function createWindow() {
  // Debug
  const dirs = debugDirectories();
  
  // Boş menü oluştur (menüleri kaldır)
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    backgroundColor: '#f5f5f5',
    icon: path.join(__dirname, '../build/icons/icon.png'),
    title: 'Integrated QA Toolkit',
    autoHideMenuBar: true, // Menü çubuğunu gizle
    frame: true // Pencere çerçevesini tutuyoruz
  });

  // Set window title explicitly
  mainWindow.setTitle('Integrated QA Toolkit');

  // React uygulamasını yükleme mantığını iyileştirme
  let startUrl;
  let indexHtmlFound = false;
  let errorPath = path.join(__dirname, 'error.html');
  
  // Debug için yolları terminal penceresinde göster
  console.log('===== OLASI HTML YOLLARI =====');
  
  // Olası index.html konumları
  const possiblePaths = [
    // Standart yollar
    path.join(__dirname, '../build/index.html'),
    path.join(app.getAppPath(), 'build/index.html'),
    path.join(process.resourcesPath, 'app/build/index.html'),
    // Alternatif yollar
    path.join(process.resourcesPath, 'build/index.html'),
    path.join(process.resourcesPath, 'app/build/index.html'),
    path.join(app.getPath('exe'), '../resources/app/build/index.html'),
    path.join(app.getPath('exe'), '../resources/build/index.html'),
    path.join(process.resourcesPath, 'temp_resources/app/build/index.html'),
    // Direkt dizinler
    path.join(dirs.current, 'build/index.html'),
    path.join(dirs.appPath, 'build/index.html'),
    path.join(dirs.resourcesPath, 'build/index.html')
  ];
  
  // Olası yolları listele
  possiblePaths.forEach((htmlPath, index) => {
    const exists = fs.existsSync(htmlPath);
    console.log(`${index + 1}. ${htmlPath} - ${exists ? 'MEVCUT ✅' : 'YOK ❌'}`);
  });
  
  console.log('=============================');
  
  // Kullanıcı ilk başta hata sayfasını görmek zorunda kalırsa, en azından dizin bilgisi olsun
  let debugInfo = '';
  Object.entries(dirs).forEach(([key, value]) => {
    debugInfo += `${key}: ${value}<br>`;
  });
  
  // Debug için hata mesajlarını global bir değişkende topla
  global.loadErrors = {
    dirs: dirs,
    possiblePaths: possiblePaths.map(p => ({ path: p, exists: fs.existsSync(p) })),
    errors: []
  };
  
  // Geliştirme modunda local sunucuyu kullan
  if (isDev) {
    startUrl = 'http://localhost:3000';
    console.log('Development modunda çalışıyor, yükleniyor:', startUrl);
  } else {
    // Paketlenmiş modda dosya sisteminden yükle
    console.log('Paketlenmiş modda çalışıyor, dosya aranıyor...');
    // __dirname kullanarak göreceli yol oluştur ve url.format ile URL'ye çevir
    const buildPath = path.join(__dirname, '..', 'build', 'index.html'); // electron klasöründen bir üste çıkıp build'e gir
    console.log('Beklenen build yolu (__dirname ile):', buildPath);

    if (fs.existsSync(buildPath)) {
       startUrl = url.format({
         pathname: buildPath,
         protocol: 'file:',
         slashes: true,
       });
      indexHtmlFound = true;
      console.log('React build dosyası bulundu ve URL oluşturuldu:', startUrl);
    } else {
       // Eğer __dirname ile de bulunamazsa, process.resourcesPath'i tekrar dene (yedek olarak)
       const fallbackBuildPath = path.join(process.resourcesPath, 'app', 'build', 'index.html');
       console.log('Yedek build yolu (resourcesPath ile):', fallbackBuildPath);
       if (fs.existsSync(fallbackBuildPath)) {
         startUrl = url.format({
           pathname: fallbackBuildPath,
           protocol: 'file:',
           slashes: true,
         });
         indexHtmlFound = true;
         console.log('React build dosyası yedek yolda bulundu ve URL oluşturuldu:', startUrl);
       } else {
          // Hiçbir yol çalışmazsa hata sayfasını göster
          startUrl = url.format({
            pathname: errorPath,
            protocol: 'file:',
            slashes: true,
          });
          console.error('Build dosyası bulunamadı! Hata sayfası gösteriliyor:', errorPath);
          // Hata durumunda debug bilgilerini ekle (önceki kodda olduğu gibi)
          try {
            if (fs.existsSync(errorPath)) {
              const errorHtml = fs.readFileSync(errorPath, 'utf8');
              const enhancedErrorHtml = errorHtml.replace('</div>', `<div class="debug-info"><h3>Debug Bilgisi:</h3><pre>${JSON.stringify(global.loadErrors, null, 2)}</pre></div></div>`);
              const customErrorPath = path.join(path.dirname(errorPath), 'custom-error.html');
              fs.writeFileSync(customErrorPath, enhancedErrorHtml);
              errorPath = customErrorPath; // Hata sayfasının yolunu güncelle
              startUrl = url.format({ // Güncellenmiş hata sayfasını yükle
                pathname: errorPath,
                protocol: 'file:',
                slashes: true,
              });
            }
          } catch (err) {
            console.error('Hata sayfası güncellenirken sorun oluştu:', err);
          }
       }
    }
  }

  // Pencereyi yükle
  console.log('Sayfa yükleniyor:', startUrl);

  mainWindow.loadURL(startUrl).catch(error => {
    console.error('URL yüklenirken hata oluştu:', error);
    global.loadErrors.errors.push({ loadError: error.toString() });
    
    try {
      // Yükleme hatasının detaylarını göster
      console.log('Hata sayfasına yönlendiriliyor...');
      dialog.showErrorBox('Yükleme Hatası', 
        `URL yüklenemedi: ${startUrl}\nHata: ${error}\n\nDebug bilgisi konsolu inceleyiniz.`);
      
      // Eğer asıl yükleme başarısız olursa, hata sayfasını göster
      if (fs.existsSync(errorPath)) {
        mainWindow.loadFile(errorPath).catch(err => {
          console.error('Hata sayfası yüklenirken sorun oluştu:', err);
          mainWindow.webContents.openDevTools();
        });
      } else {
        console.error('Hata sayfası da bulunamadı!');
        mainWindow.webContents.openDevTools();
      }
    } catch (dialogError) {
      console.error('Dialog gösterilirken hata oluştu:', dialogError);
    }
  });

  // Disable external browser window for dev tools
  if (isDev) {
    // Open dev tools in the main window, not in a separate browser window
    mainWindow.webContents.openDevTools({ mode: 'right' });
  } else {
    // Paketlenmiş sürümde de sorun varsa DevTools'u aç
    if (!indexHtmlFound) {
      mainWindow.webContents.openDevTools({ mode: 'bottom' });
    }
  }
  
  // Fix for white screen - make sure React is actually loaded
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Sayfa başarıyla yüklendi!');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Uygulamayı başlat
console.log(`\n===== Integrated QA Toolkit başlatılıyor =====`);
console.log(`Platform: ${os.platform()} ${os.release()}`);
console.log(`Node: ${process.version}`);
console.log(`Electron: ${process.versions.electron}`);
console.log(`Chromium: ${process.versions.chrome}`);
console.log(`isDev: ${isDev}`);
console.log(`===========================================\n`);

// Set app name
app.name = 'Integrated QA Toolkit';

// Uygulama hazır olduğunda pencereyi oluştur
app.whenReady().then(() => {
  createWindow();
  
  // macOS için: Uygulama dock/tray'de aktif olduğunda ve hiçbir pencere açık
  // olmadığında yeni bir pencere aç
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Tüm pencereler kapandığında uygulamayı kapat (macOS hariç)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle IPC Messages
// Accessibility Checker
ipcMain.handle('accessibility-scan', async (event, url) => {
  // In a real app, this would call a Python backend
  console.log('Scanning URL:', url);
  return { success: true };
});

// Test Scenario Generator
ipcMain.handle('generate-test-scenarios', async (event, csvData, options) => {
  console.log('Generating test scenarios');
  return { success: true };
});

// Visual Regression
ipcMain.handle('compare-images', async (event, baselineImage, testImage) => {
  console.log('Comparing images');
  return { success: true };
});

// Network Traffic
ipcMain.handle('start-network-capture', async () => {
  console.log('Starting network capture');
  return { success: true };
});

ipcMain.handle('stop-network-capture', async () => {
  console.log('Stopping network capture');
  return { success: true };
});

// App Settings
ipcMain.handle('get-app-settings', async () => {
  // In a real app, this would read from a settings file
  return { darkMode: false };
});

ipcMain.handle('save-app-settings', async (event, settings) => {
  console.log('Saving settings:', settings);
  return { success: true };
});
