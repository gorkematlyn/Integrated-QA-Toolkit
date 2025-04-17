/**
 * Windows Portable Uygulama Oluşturma Scripti
 * 
 * Bu script electron-packager kullanarak Windows için taşınabilir uygulama oluşturur.
 * Kullanım: npm run build-win
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('⏳ React build hazırlığı yapılıyor...');

// React build dizinindeki index.html dosyasının varlığını kontrol et
if (!fs.existsSync(path.join(__dirname, 'build', 'index.html'))) {
  console.error('❌ Error: build/index.html dosyası bulunamadı!');
  console.error('   Lütfen önce React uygulamasını build edin: npm run build');
  process.exit(1);
}

// Build klasörünün içeriğini listele
console.log('📂 Build klasörü içeriği:');
try {
  const buildFiles = fs.readdirSync(path.join(__dirname, 'build'));
  buildFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
} catch (err) {
  console.error('   Build klasörü listelenemedi:', err);
}

console.log('\n⏳ Electron portable uygulama hazırlanıyor...');

// İmzalama işlemi ve ikon kullanımını devre dışı bırak
process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
process.env.USE_HARD_LINKS = 'false';

// Electron paketlemeden önce build klasörünü temizle (varsa eski paketleme)
try {
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('🗑️ Eski dist klasörü temizleniyor...');
    fs.rmSync(distPath, { recursive: true, force: true });
  }
} catch (err) {
  console.error('   Dist klasörü temizlenemedi:', err);
}

// Packager çalıştırmadan önce build dizinini resources klasörüne doğrudan kopyala
try {
  console.log('⏳ Build klasörünü resources/app/build dizinine kopyalama hazırlığı...');
  
  // Önce resources/app dizini oluştur
  const tempResourcesDir = path.join(__dirname, 'temp_resources');
  const tempAppDir = path.join(tempResourcesDir, 'app');
  const tempBuildDir = path.join(tempAppDir, 'build');
  
  // Varsa eski temp dizinini temizle
  if (fs.existsSync(tempResourcesDir)) {
    fs.rmSync(tempResourcesDir, { recursive: true, force: true });
  }
  
  // Temp dizinleri oluştur
  fs.mkdirSync(tempAppDir, { recursive: true });
  
  // Build dizinini kopyala
  console.log('📋 Build klasörünü temp_resources/app/build dizinine kopyalıyorum...');
  fs.cpSync(path.join(__dirname, 'build'), tempBuildDir, { recursive: true });
  
  console.log('✅ Build klasörü başarıyla kopyalandı.');
} catch (err) {
  console.error('❌ Build klasörü kopyalanırken hata oluştu:', err);
  process.exit(1);
}

// Electron-packager ile portable uygulama oluştur
try {
  console.log('\n🚀 Paketleme başlıyor...');
  const cmd = `npx electron-packager . "Integrated QA Toolkit" --platform=win32 --arch=x64 --out=dist --overwrite --icon=build/icons/icon.ico --extra-resource=temp_resources`;
  console.log(`   Çalıştırılıyor: ${cmd}`);
  
  execSync(cmd, { stdio: 'inherit' });
  
  console.log('\n✨ Paket tamamlandı, son düzenlemeler yapılıyor...');
  
  // Paketleme sonrası temp dizinini temizle
  fs.rmSync(path.join(__dirname, 'temp_resources'), { recursive: true, force: true });
  
  // Build dizinini doğrudan uygulama klasörüne kopyalayarak garanti altına al
  const electronAppDir = path.join(__dirname, 'dist', 'Integrated QA Toolkit-win32-x64', 'resources', 'app');
  const appBuildDir = path.join(electronAppDir, 'build');
  
  if (!fs.existsSync(appBuildDir)) {
    console.log('📋 Build klasörünü doğrudan uygulama dizinine kopyalıyorum...');
    fs.cpSync(path.join(__dirname, 'build'), appBuildDir, { recursive: true });
  }
  
  // Hata sayfası electron dizininin de kopyalandığından emin ol
  const electronDir = path.join(electronAppDir, 'electron');
  if (!fs.existsSync(electronDir)) {
    console.log('📋 Electron dizinini kopyalıyorum...');
    fs.cpSync(path.join(__dirname, 'electron'), electronDir, { recursive: true });
  }
  
  console.log('\n🎉 Windows portable uygulaması başarıyla oluşturuldu!');
  console.log('📁 Uygulama konumu: dist/Integrated QA Toolkit-win32-x64');
  console.log('▶️ Çalıştırmak için: dist/Integrated QA Toolkit-win32-x64/Integrated QA Toolkit.exe');
} catch (error) {
  console.error('\n❌ Build sırasında hata oluştu:', error);
} 