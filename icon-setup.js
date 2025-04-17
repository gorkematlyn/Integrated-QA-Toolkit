/**
 * İkon Dosyaları Oluşturma Scripti
 * 
 * Bu script, uygulamanın ihtiyaç duyduğu ikon dosyalarını oluşturur.
 * Dosyalar yer tutucu (placeholder) olarak oluşturulur, gerçek ikonlarla değiştirilmelidir.
 */

const fs = require('fs');
const path = require('path');

console.log('Ikon dosyaları kontrol ediliyor...');

// Gerekli dizinleri oluştur
const dirs = [
  'build/icons',
  'build/icon'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Dizin oluşturuldu: ${dir}`);
  }
});

// Gerekli ikonlar ve yerleri
const iconFiles = [
  { path: 'build/icons/icon.ico', desc: 'Windows ana ikon (256x256)', required: true },
  { path: 'build/icons/icon.png', desc: 'Genel PNG ikon (512x512)', required: false },
  { path: 'build/icons/icon.icns', desc: 'macOS ikon', required: false },
  { path: 'build/icon.png', desc: 'Electron ana ikonu (512x512)', required: false }, 
  { path: 'build/favicon.ico', desc: 'Favicon (32x32)', required: false },
  { path: 'build/logo192.png', desc: 'Logo (192x192)', required: false },
  { path: 'build/logo512.png', desc: 'Logo (512x512)', required: false }
];

// Eksik olanları yer tutucu olarak oluştur
const iconContent = 'Bu dosya bir ikon yer tutucusudur. Gerçek ikon ile değiştirin.';

let hasWarnings = false;
iconFiles.forEach(file => {
  if (!fs.existsSync(file.path)) {
    fs.writeFileSync(file.path, iconContent);
    console.log(`İkon yer tutucusu oluşturuldu: ${file.path} - ${file.desc}`);
    
    if (file.required) {
      console.warn(`UYARI: ${file.path} gerçek bir ikon ile değiştirilmelidir!`);
      hasWarnings = true;
    }
  }
});

if (hasWarnings) {
  console.log('\n⚠️ Bazı gerekli ikon dosyaları yer tutucu olarak oluşturuldu!');
  console.log('  Bu ikon dosyalarını gerçek ikonlar ile değiştirin.');
} else {
  console.log('\n✅ Tüm ikon dosyaları mevcut!');
}

/**
 * İkon boyutları ve formatları:
 * 
 * Windows:
 * - icon.ico: İdeal olarak 256x256 px boyutunda, .ico formatında
 * 
 * macOS:
 * - icon.icns: .icns formatında, çeşitli boyutları içeren
 * 
 * Genel:
 * - icon.png: 512x512 px, PNG formatında
 * - logo192.png: 192x192 px, PNG formatında
 * - logo512.png: 512x512 px, PNG formatında
 * - favicon.ico: 32x32 px, .ico formatında
 */ 