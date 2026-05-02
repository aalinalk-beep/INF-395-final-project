#!/usr/bin/env python3
"""
Автоматическая установка проекта Discover Kazakhstan
Работает на Windows, Linux и Mac
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

# Цвета для терминала
class Colors:
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    NC = '\033[0m'  # No Color
    
    @staticmethod
    def disable_on_windows():
        """Отключить цвета на Windows (если не поддерживается)"""
        if platform.system() == 'Windows':
            Colors.BLUE = Colors.GREEN = Colors.RED = Colors.YELLOW = Colors.NC = ''

Colors.disable_on_windows()

def print_step(message):
    """Печать шага установки"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.NC}")
    print(f"{Colors.BLUE}{message}{Colors.NC}")
    print(f"{Colors.BLUE}{'='*60}{Colors.NC}\n")

def print_success(message):
    """Печать успешного сообщения"""
    print(f"{Colors.GREEN} {message}{Colors.NC}")

def print_error(message):
    """Печать ошибки"""
    print(f"{Colors.RED}{message}{Colors.NC}")

def print_info(message):
    """Печать информации"""
    print(f"{Colors.YELLOW}ℹ {message}{Colors.NC}")

def run_command(command, cwd=None, shell=False):
    """Выполнить команду в терминале"""
    try:
        # На Windows используем shell=True ТОЛЬКО для npm команд
        if platform.system() == 'Windows' and isinstance(command, list):
            if command[0] == 'npm':
                shell = True
                command = ' '.join(command)
        
        if isinstance(command, str) and not shell:
            command = command.split()
        
        result = subprocess.run(
            command,
            cwd=cwd,
            shell=shell,
            check=True,
            capture_output=True,
            text=True
        )
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr
    except Exception as e:
        return False, str(e)




def check_requirements():
    """Проверка установленных требований"""
    print_step(" Checking requirements...")
    
    # Проверка Python
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print_error(f"Python 3.8+ required. Current: {python_version.major}.{python_version.minor}")
        return False
    print_success(f"Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Проверка pip
    success, output = run_command([sys.executable, "-m", "pip", "--version"])
    if not success:
        print_error("pip not found")
        return False
    print_success("pip installed")
    
    # Проверка Node.js
    success, output = run_command(["node", "--version"])
    if not success:
        print_error("Node.js not found. Please install Node.js 16+")
        return False
    node_version = output.strip()
    print_success(f"Node.js {node_version}")
    
    # Проверка npm
    success, output = run_command(["npm", "--version"])
    if not success:
        print_error("npm not found")
        return False
    npm_version = output.strip()
    print_success(f"npm {npm_version}")
    
    return True


def setup_backend():
    """Установка backend"""
    print_step(" Setting up Backend...")
    
    backend_dir = Path("discover-kaz-backend")
    if not backend_dir.exists():
        print_error("Backend directory not found!")
        return False
    
    venv_path = backend_dir / ".venv"
    
    # Создание виртуального окружения
    if not venv_path.exists():
        print_info("Creating virtual environment...")
        success, output = run_command([sys.executable, "-m", "venv", ".venv"], cwd=backend_dir)
        if not success:
            print_error(f"Failed to create virtual environment: {output}")
            return False
        print_success("Virtual environment created")
    else:
        print_info("Virtual environment already exists")
    
    # Определение пути к Python в виртуальном окружении
    if platform.system() == "Windows":
        python_path = venv_path / "Scripts" / "python.exe"
    else:
        python_path = venv_path / "bin" / "python"
    
    # Установка зависимостей (используем python -m pip вместо прямого вызова pip)
    print_info("Installing Python dependencies...")
    success, output = run_command([str(python_path), "-m", "pip", "install", "-r", "requirements.txt", "-q"], cwd=backend_dir)
    if not success:
        print_error(f"Failed to install dependencies: {output}")
        return False
    print_success("Python dependencies installed")
    
    # Миграции
    print_info("Running database migrations...")
    success, output = run_command([str(python_path), "manage.py", "migrate"], cwd=backend_dir)
    if not success:
        print_error(f"Failed to run migrations: {output}")
        return False
    print_success("Migrations completed")
    
    # Загрузка тестовых данных
    print_info("Loading sample data...")
    success, output = run_command([str(python_path), "manage.py", "seed_data"], cwd=backend_dir)
    if not success:
        print_error(f"Failed to load sample data: {output}")
        return False
    print_success("Sample data loaded (5 destinations + 6 hotels + 3 events)")
    
    # Создание суперпользователя
    print("\n" + "="*60)
    print_info("Now you need to create a superuser for the admin panel")
    print("="*60 + "\n")
    
    subprocess.run([str(python_path), "manage.py", "createsuperuser"], cwd=backend_dir)
    
    print_success("Backend setup complete!")
    return True


def setup_frontend():
    """Установка frontend"""
    print_step(" Setting up Frontend...")
    
    frontend_dir = Path("discover-kaz-frontend")
    if not frontend_dir.exists():
        print_error("Frontend directory not found!")
        return False
    
    # Создание .env файла
    env_file = frontend_dir / ".env"
    if not env_file.exists():
        print_info("Creating .env file...")
        env_content = """VITE_API_URL=http://localhost:8000/api
VITE_MEDIA_URL=http://localhost:8000/media
"""
        env_file.write_text(env_content)
        print_success(".env file created")
    else:
        print_info(".env file already exists")
    
    # Установка зависимостей
    print_info("Installing Node.js dependencies (this may take a while)...")
    success, output = run_command(["npm", "install"], cwd=frontend_dir)
    if not success:
        print_error(f"Failed to install dependencies: {output}")
        return False
    print_success("Node.js dependencies installed")
    
    print_success("Frontend setup complete!")
    return True


def print_final_instructions():
    """Печать финальных инструкций"""
    print("\n" + "="*60)
    print(f"{Colors.GREEN} Setup completed successfully!{Colors.NC}")
    print("="*60 + "\n")
    
    print(f"{Colors.BLUE}To start the application:{Colors.NC}\n")
    
    print("1  Backend (Terminal 1):")
    print("   cd discover-kaz-backend")
    
    if platform.system() == "Windows":
        print("   .venv\\Scripts\\activate")
    else:
        print("   source .venv/bin/activate")
    
    print("   python manage.py runserver\n")
    
    print("2 Frontend (Terminal 2):")
    print("   cd discover-kaz-frontend")
    print("   npm run dev\n")
    
    print(f"{Colors.BLUE} URLs:{Colors.NC}")
    print("   Frontend:    http://localhost:5173")
    print("   Backend API: http://localhost:8000/api")
    print("   Admin Panel: http://localhost:8000/admin")
    print("\n" + "="*60 + "\n")

def main():
    """Главная функция"""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.NC}")
    print(f"{Colors.BLUE} Discover Kazakhstan - Automatic Setup{Colors.NC}")
    print(f"{Colors.BLUE}{'='*60}{Colors.NC}\n")
    
    # Проверка требований
    if not check_requirements():
        print_error("Requirements check failed. Please install missing dependencies.")
        sys.exit(1)
    
    # Установка backend
    if not setup_backend():
        print_error("Backend setup failed!")
        sys.exit(1)
    
    # Установка frontend
    if not setup_frontend():
        print_error("Frontend setup failed!")
        sys.exit(1)
    
    # Финальные инструкции
    print_final_instructions()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Setup cancelled by user{Colors.NC}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)
