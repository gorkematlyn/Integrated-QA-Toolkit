const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Mac ve Windows'ta farklı komutları çalıştırmak için
const isWin = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';

console.log('Python bağımlılıklarını yükleme...');

// Python'un kurulu olup olmadığını kontrol et
function checkPythonInstalled(callback) {
  const pythonCommand = isWin ? 'python --version' : 'python3 --version';
  
  exec(pythonCommand, (error) => {
    if (error) {
      console.log('Python bulunamadı. Python kurulu değil veya PATH\'de değil.');
      console.log('Python bağımlılıklarını daha sonra manuel olarak yükleyebilirsiniz:');
      console.log('  - Windows: python install_python_deps.py');
      console.log('  - macOS: ./install_python_deps.sh');
      callback(false);
    } else {
      callback(true);
    }
  });
}

function installPythonDeps() {
  checkPythonInstalled((pythonInstalled) => {
    if (!pythonInstalled) {
      console.log('Python yükleme işlemi atlanıyor...');
      return;
    }
    
    let installProcess;
    
    if (isWin) {
      // Windows kurulumu
      installProcess = spawn('python', [path.join(__dirname, 'install_python_deps.py')], {
        stdio: 'inherit',
        shell: true
      });
    } else if (isMac) {
      // Mac kurulumu
      // Önce dosyanın çalıştırılabilir olduğundan emin olalım
      try {
        fs.chmodSync(path.join(__dirname, 'install_python_deps.sh'), '755');
      } catch (err) {
        console.error('install_python_deps.sh dosyasına çalıştırma izni verilemedi:', err);
      }
      
      installProcess = spawn('bash', [path.join(__dirname, 'install_python_deps.sh')], {
        stdio: 'inherit',
        shell: true
      });
    } else {
      console.error('Desteklenmeyen işletim sistemi');
      return;
    }

    installProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python bağımlılıkları yüklenirken hata oluştu. Çıkış kodu: ${code}`);
        console.log('Python bağımlılıklarını daha sonra manuel olarak yükleyebilirsiniz.');
      } else {
        console.log('Python bağımlılıkları başarıyla yüklendi!');
      }
    });
  });
}

// Hataya rağmen npm kurulumunun devam etmesi için
try {
  installPythonDeps();
} catch (err) {
  console.error('Python bağımlılıkları yüklenirken hata oluştu:', err);
  console.log('Python bağımlılıklarını daha sonra manuel olarak yükleyebilirsiniz.');
} 