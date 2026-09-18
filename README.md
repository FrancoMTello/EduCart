# EduCart 📚🛒

Plataforma de e-commerce orientada al ámbito educativo para la comercialización de libros, herramientas tecnológicas, kits de robótica, papelería y cursos digitales. Desarrollada para la materia **Programación III**.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React, TypeScript, Tailwind CSS, React Router, TanStack Query, Lucide Icons.
* **Backend:** FastAPI, Python, SQLModel, SQLite, Pytest, Jose (JWT).
* **Despliegue e Infraestructura:** Docker, Docker Compose, Uvicorn.

---

## 🚀 Requisitos Previos

* **Node.js** (v18 o superior)
* **Python** (v3.12 o superior)
* **Docker Desktop** (opcional para ejecución en contenedor)

---

## 📦 Instalación y Ejecución Local

### 1. Backend (FastAPI)

```bash
# Navegar a la carpeta del backend
cd src/backend

# Crear y activar el entorno virtual
python -m venv .venv
# En Windows (PowerShell):
.\.venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload