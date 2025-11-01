[readme (1).md](https://github.com/user-attachments/files/23286368/readme.1.md)
# 🌍 Proyecto: Places & Posts API

Aplicación ****backend**** desarrollada con ****Node.js****, ****Express**** y ****MongoDB Atlas****, que permite gestionar ****lugares (Places)**** y ****publicaciones (Posts)****.

Incluye subida de archivos a ****Cloudinary****, relación entre colecciones, y un CRUD completo para ambas entidades.

---
## 🚀 Tecnologías utilizadas

- 🟢 ****Node.js****

- ⚡ ****Express.js****

- 🍃 ****MongoDB Atlas****

- 🔗 ****Mongoose****

- ☁️ ****Cloudinary****

- 🖼 ****Multer / Multer-Storage-Cloudinary****

- 🔒 ****Dotenv****

---
## 📁 Estructura del proyecto

  

```

📦 Proyecto

├── api
│ ├── controllers
│ ├── models
│ └── routes

├── middleware
|	├── auth.js
│ └── multer.js

├── utils
| ├── deleteFile.js
│ └── seed.js

├── config
	├── jwt.js
│ └── db.js

├── index.js

└── .env

```

  

---

  

## 🧠 Descripción general

El proyecto consiste en dos colecciones principales:

- ****Places**** → Lugares que pueden tener una imagen subida a Cloudinary.

- ****Posts**** → Publicaciones que hacen referencia a un lugar (`place`) y pueden incluir también una imagen.

Cada colección tiene sus operaciones CRUD completas, validaciones y manejo de errores.

---

## 🔗 Endpoints disponibles 
### 🗺 ****Places****

| Método | Ruta | Descripción | Body / Params | Respuesta |
|--------|------|--------------|---------------|------------|
| GET | `/api/v1/places` | Obtiene todos los lugares | — | Array de lugares |
| GET | `/api/v1/places/:id` | Obtiene un lugar por ID | `id` en params | Lugar |
| POST | `/api/v1/places` | Crea un lugar | `name`, `date`, `img` (archivo) | Lugar creado |
| PUT | `/api/v1/places/:id` | Actualiza un lugar | `name`, `date`, `img` (opcional) | Lugar actualizado |
| DELETE | `/api/v1/places/:id` | Borra un lugar | `id` en params | Lugar eliminado + elimina imagen en Cloudinary |  

---

### 📝 ****Posts****

 | Método | Ruta | Descripción | Body / Params | Respuesta |
|--------|------|--------------|---------------|------------|
| GET | `/api/v1/posts` | Obtiene todos los posts | — | Array de posts |
| GET | `/api/v1/posts/:id` | Obtiene un post por ID | `id` en params | Post con `place` poblado |
| POST | `/api/v1/posts` | Crea un post | `title`, `content`, `place`, `image` (archivo) | Post creado |
| PUT | `/api/v1/posts/:id` | Actualiza un post | Campos a actualizar y `image` (opcional) | Post actualizado |
| DELETE | `/api/v1/posts/:id` | Borra un post | `id` en params | Post eliminado + elimina imagen en Cloudinary |

  
---


## ⚙️ Ejemplo de respuestas

  

### ✅ ****Respuesta exitosa****

```json
{
"message": "Lugar creado correctamente",
"data": {
	"_id": "671a32e4f2b3e21a5dcd1111",
	"name": "Asturias",
	"img": "https://res.cloudinary.com/...",
	"date": "2025-10-20T00:00:00.000Z"
}
}

```

### ❌ ****Respuesta de error****
```json
{
"error": "Error creando el post",
"details": "ValidationError: 'title' es obligatorio"
}
```
---

  
## ☁️ Subida y eliminación de archivos (Cloudinary)

📤 Las imágenes se suben automáticamente a ****Cloudinary**** usando ****Multer**** y ****CloudinaryStorage****.

📁 Estructura de carpetas en Cloudinary:

- `/Places` → para las imágenes de lugares

- `/Posts` → para las imágenes de publicaciones

🗑 Al eliminar un ****Place****, también se borra su imagen correspondiente de Cloudinary.

*_(En Posts es opcional, pero fácilmente ampliable con el mismo patrón.)_*

---

## 🧩 Relación entre colecciones

- Un ****Post**** está relacionado con un ****Place**** mediante su ****ObjectId****.

- Esto permite poblar la información del lugar dentro del post usando `.populate("place")`.

Ejemplo de respuesta de un post:

```json
{
"_id": "671a3355a9b1e9f0f23c9999",
"title": "Descubriendo Asturias",
"content": "Un post sobre la belleza de Asturias",
"place": {
	"_id": "671a32e4f2b3e21a5dcd1111",
	"name": "Asturias",
	"img": "https://res.cloudinary.com/..."
	}
}

```
---

## 🌱 Semilla (Seed Data)

El archivo `seedData.js` inserta datos iniciales de ****Places**** y ****Posts**** en la base de datos.

Ejecuta:

```bash

node seeds/seedData.js

```  

Esto:

- Conecta a tu base de datos Mongo Atlas

- Crea algunos lugares por defecto

- Inserta posts asociados a esos lugares

- Cierra la conexión automáticamente

---

## ⚠️ Manejo de errores

  | Código | Tipo de error | Cuándo ocurre | Ejemplo de respuesta |
|--------|----------------|----------------|------------------------|
| 400 | **Bad Request** | Faltan campos obligatorios o datos inválidos | `{ "error": "Faltan campos obligatorios" }` |
| 404 | **Not Found** | El recurso solicitado no existe en la base de datos | `{ "error": "No se encontró el lugar solicitado" }` |
| 500 | **Internal Server Error** | Error inesperado del servidor (por ejemplo, fallo de conexión o bug interno) | `{ "error": "Error interno del servidor", "details": "ValidationError: 'name' es obligatorio" }` |



Todos los controladores devuelven errores detallados con el campo `details` para facilitar el debugging.

---

## 🔧 Configuración y ejecución

1. Instala las dependencias:
```bash
npm install
```
2. Crea un archivo `.env` en la raíz con tus variables:
```
PORT=5000
DB_URL=tu_url_de_mongo_atlas
CLOUDINARY_CLOUD_NAME=tu_nombre
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

```
3. Inicia el servidor en modo desarrollo:
```bash
npm run dev
```
4. Prueba los endpoints en ****Insomnia**** o ****Postman**** 🎯
---

## 🧾 Estado del proyecto

✅ Servidor con Express

✅ Conexión a Mongo Atlas con Mongoose

✅ Dos modelos: `Place` y `Post`

✅ Relación entre colecciones

✅ CRUD completo para ambas

✅ Subida y eliminación de archivos en Cloudinary

✅ Semilla de datos

✅ README documentado y formateado

---

## ✨ Autoría

Proyecto desarrollado por ****Marta Ramírez Linares****

💻 GitHub: [https://github.com/Martaarl](https://github.com/tu-usuario)
