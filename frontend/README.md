# 📚 Novelia — Sistema Experto de Recomendación de Libros

<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20Desarrollo-blue?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Materia-Sistemas%20Expertos-purple?style=for-the-badge" alt="Materia">
  <img src="https://img.shields.io/badge/Carrera-Ingenier%C3%ADa%20Mecatr%C3%B3nica-orange?style=for-the-badge" alt="Carrera">
</p>

> **Novelia** es una aplicación diseñada por y para lectores, capaz de encontrar recomendaciones literarias personalizadas basadas en tu *vibe* o estado de ánimo del momento a través de inteligencia artificial y un motor de inferencia experto.

---

## 👤 Información del Desarrollador

* **Diseñado por:** Kenya Gabriela Frutos González  
* **Carrera:** Ingeniería Mecatrónica  
* **Registro:** 23110115

---

## 🧠 Arquitectura del Sistema

Novelia utiliza un enfoque de **multi-agentes inteligentes** (4 agentes en total) basados en IA para procesar los estímulos del usuario y asegurar la calidad de las recomendaciones:

| Agente | Función |
| :--- | :--- |
| 🎭 **Vibe Agent** | Detecta el *mood* o estado de ánimo del usuario desde texto, imágenes, canciones o videos. |
| 📖 **Recommender Agent** | Aplica las reglas de inferencia del sistema experto y recomienda libros modernos idóneos. |
| 📚 **Librarian Agent** | Gestiona la biblioteca personal, el progreso de lectura y las reseñas del usuario. |
| 🔍 **Supervisor Agent** | Evalúa el proceso y explica el razonamiento lógico detrás de cada recomendación dada. |

---

## 🔗 Reglas de Inferencia

El motor de inferencia evalúa el estado emocional (*vibe*) y el comportamiento del usuario bajo las siguientes reglas lógicas:

* `IF vibe == "melancolico" THEN géneros = ["drama", "literary fiction", "poetry"]`
* `IF vibe == "romantico" THEN géneros = ["romance", "contemporary romance"]`
* `IF vibe == "misterioso" THEN géneros = ["thriller", "mystery", "suspense"]`
* `IF vibe == "cozy" THEN géneros = ["contemporary fiction", "cozy mystery"]`
* `IF vibe == "aventurero" THEN géneros = ["fantasy", "adventure", "sci-fi"]`
* `IF vibe == "oscuro" THEN géneros = ["dark romance", "horror", "psychological thriller"]`
* `IF vibe == "esperanzador" THEN géneros = ["coming of age", "inspirational"]`
* `IF libros_leidos > 20 THEN perfil = "lector experto" → priorizar libros menos conocidos`
* `IF rating_promedio >= 4.5 THEN priorizar libros mejor valorados globalmente`
* `IF progreso == 100% THEN marcar libro como leído automáticamente`
* `IF estado == "leido" THEN solicitar reseña al usuario`
* `IF libro IN biblioteca THEN excluir de las recomendaciones actuales`

---

## 🛠️ Stack Tecnológico

<table align="center">
  <tr>
    <th>Capa</th>
    <th>Tecnologías Utilizadas</th>
  </tr>
  <tr>
    <td><b>Frontend</b></td>
    <td>React, React Router, React Icons, CSS3 (Variables globales)</td>
  </tr>
  <tr>
    <td><b>Backend</b></td>
    <td>FastAPI (Python), Uvicorn</td>
  </tr>
  <tr>
    <td><b>IA & Agentes</b></td>
    <td>Google Gemini API (Generative AI)</td>
  </tr>
  <tr>
    <td><b>Base de Datos</b></td>
    <td>SQLite, SQLAlchemy (ORM)</td>
  </tr>
  <tr>
    <td><b>APIs Externas</b></td>
    <td>Open Library API (Catálogo de libros)</td>
  </tr>
  <tr>
    <td><b>Seguridad</b></td>
    <td>JWT Tokens, Bcrypt (Hasheo de contraseñas)</td>
  </tr>
</table>

---

## 📁 Estructura del Proyecto

```text
novelia/
├── backend/
│   ├── main.py                    # Aplicación FastAPI + definición de rutas
│   ├── models.py                  # Modelos de datos e interfaces con SQLAlchemy
│   ├── .env                       # Variables de entorno (Claves privadas)
│   └── agents/
│       ├── vibe_agent.py          # Agente 1: Procesamiento y detección multimedia
│       ├── recommender_agent.py   # Agente 2: Motor de inferencia y sugerencias
│       ├── librarian_agent.py     # Agente 3: Gestión de estados de lectura
│       └── supervisor_agent.py    # Agente 4: Módulo de explicabilidad de la IA
└── frontend/
    └── src/
        ├── config.js              # Configuración de URLs del Backend
        ├── App.js                 # Manejo y declaración de rutas principales
        ├── index.css              # Estilos globales y paleta de colores
        ├── components/
        │   └── Navbar.jsx         # Barra de navegación inferior persistente
        └── pages/
            ├── Home.jsx           # Captura de vibe y despliegue de recomendaciones
            ├── Library.jsx        # Dashboard de biblioteca personal y reseñas
            ├── Search.jsx         # Motor de búsqueda por filtros o estado de ánimo
            ├── Profile.jsx        # Estadísticas del perfil y diagnóstico de IA
            ├── Login.jsx          # Autenticación y acceso
            └── Register.jsx       # Formulario de registro de nuevos usuarios
```            

## 🗄️ Diseño de la Base de Datos

El sistema implementa una base de datos relacional local optimizada mediante SQLite:

| Tabla | Campos Clave / Descripción |
| :--- | :--- |
| `usuarios` | Cuentas registradas, credenciales con hash de seguridad. |
| `libros` | Catálogo e historial de libros interactuados dentro de la app. |
| `biblioteca` | Tabla relacional (usuario-libro), progreso (0-100%) y estado de lectura. |
| `reseñas` | Calificaciones numéricas, comentarios escritos y análisis de impacto emocional. |
| `sesiones_vibe` | Historial cronológico de estados de ánimo detectados por usuario. |

---

## 📱 Funcionalidades Clave

* 🔐 **Seguridad Avanzada:** Registro y login de usuarios cifrados mediante tokens JWT.
* 🎭 **Análisis Multimodal:** Detección precisa de *vibes* procesando texto, imágenes, canciones y URLs de video.
* 🤖 **Sugerencias Inteligentes:** Recomendaciones en tiempo real basadas en la combinación de la API de Gemini y Open Library.
* 📈 **Control de Lectura:** Clasificación de libros (*Leyendo*, *Quiero leer*, *Leído*) y actualización interactiva de barra de progreso.
* 💬 **Feedback Emocional:** El agente responde de manera empática y personalizada a las reseñas que escribes.
* 📊 **Perfil Analítico:** Gráficas o diagnósticos automatizados sobre tus hábitos y tipo de perfil lector.
* 🔍 **Transparencia (Explicabilidad):** El sistema detalla explícitamente *por qué* te está recomendando cada obra.

---

## 🚀 Instalación y Configuración

### Requisitos Previos
* Python 3.12+
* Node.js 18+
* Una clave API de Google AI Studio (Gratuita).

### 1. Clonar el repositorio
git clone https://github.com/Gabbisita/VibeandBloom_KenyaGabrielaFrutosGonzalez
cd VibeandBloom_KenyaGabrielaFrutosGonzalez

### 2. Configurar el Entorno del Backend
Navega a la carpeta del backend e instala las dependencias necesarias:
```
cd backend
pip install fastapi uvicorn sqlalchemy python-jose passlib bcrypt python-multipart google-genai requests python-dotenv
```

Crea un archivo llamado `.env` dentro del directorio `backend/` con la siguiente estructura:
```
GEMINI_API_KEY=tu_api_key_aqui
SECRET_KEY=novelia_secret_key_2026
DATABASE_URL=sqlite:///./novelia.db
```

### 3. Ejecutar el Servidor Backend
Inicia el servicio local con Uvicorn:
uvicorn main:app --reload --port 8000

> El backend se desplegará en: http://localhost:8000

### 4. Configurar el Entorno del Frontend
Abre una nueva terminal, dirígete a la carpeta del frontend e instala los módulos de Node:
```
cd frontend
npm install
```

Asegúrate de que el archivo `frontend/src/config.js` apunte correctamente a la dirección de tu API:
```
const API = 'http://localhost:8000';
export default API;
```

### 5. Iniciar la Aplicación Frontend
Corre el servidor de desarrollo de React:
npm start

> La interfaz web se abrirá automáticamente en: http://localhost:3000

---

## 🔌 Endpoints Principales de la API

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/registro` | Registra una cuenta de usuario nueva en el sistema. |
| **POST** | `/login` | Valida credenciales y retorna el token de acceso JWT. |
| **POST** | `/vibe/texto` | Procesa texto libre para inferir el mood del lector. |
| **POST** | `/vibe/imagen` | Analiza el entorno visual de una imagen cargada. |
| **POST** | `/vibe/cancion` | Mapea la vibra emocional asociada a una pista musical. |
| **POST** | `/vibe/video` | Extrae el contexto o vibe proveniente de un enlace de video. |
| **GET** | `/biblioteca` | Solicita la colección guardada del usuario autenticado. |
| **POST** | `/biblioteca/agregar` | Añade un nuevo tomo al listado de lecturas. |
| **POST** | `/biblioteca/progreso` | Actualiza el porcentaje completado y gatilla eventos de estado. |
| **POST** | `/resenas` | Publica la valoración y activa la respuesta del Librarian Agent. |
| **GET** | `/perfil/resumen` | Consolida métricas de lectura e histórico de estados del sistema. |

---

## 🎬 Video Demostrativo

> 🔗 [Enlace al video próximamente]

---
<p align="center">
  <i>Proyecto académico desarrollado para la materia de Sistemas Expertos — Ingeniería Mecatrónica.</i>
</p>