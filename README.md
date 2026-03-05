[readme (1).md](https://github.com/user-attachments/files/23286368/readme.1.md)
# 🌍 Proyecto: Places & Posts API

Aplicación ****backend**** desarrollada con ****Node.js****, ****Express**** y ****MongoDB Atlas****, que permite gestionar ****lugares (Places)**** y ****publicaciones (Posts)****.

Incluye subida de archivos a ****Cloudinary****, relación entre colecciones, un CRUD completo para ambas entidades y autenticación de usuario con JWT.

---
## 🚀 Tecnologías utilizadas

- 🟢 ****Node.js****

- ⚡ ****Express.js****

- 🍃 ****MongoDB Atlas****

- 🔗 ****Mongoose****

- ☁️ ****Cloudinary****

- 🖼 ****Multer / Multer-Storage-Cloudinary****

- 🔒 ****Dotenv****

- 🔐 ****JWT (jsonwebtoken)****

- 🔑 ****bcrypt****

---
## 📁 Estructura del proyecto


```

📦 Proyecto

├── api
│ ├── controllers
│ ├── models
│ └── routes

├── middlewares
| ├── auth.js
│ └── multer.js

├── utils
| ├── cloudinary.js
│ └── seed.js

├── config
	├── jwt.js
│ └── db.js

├── index.js

└── .env

```


---
  

## 🧠 Descripción general

El proyecto consiste en ***tres colecciones principales**:

- **Places** → Lugares que pueden tener una imagen subida a Cloudinary.

- **Posts** → Publicaciones que hacen referencia a un lugar (`place`) y pueden incluir también una imagen.
-**Users** → Usuarios con roles (`admin` o `user`) y favoritos.

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
| POST | `/api/v1/posts` | Crea un post | `title`, `content`, `place`, `image` (archivo obligatorio) | Post creado |
| PUT | `/api/v1/posts/:id` | Actualiza un post | Campos a actualizar y `image` (archivo opcional) | Post actualizado |
| DELETE | `/api/v1/posts/:id` | Borra un post | `id` en params | Post eliminado + elimina imagen en Cloudinary |

---

### 🔐 **Users y autenticación**

| Método | Ruta | Descripción | Body / Params | Respuesta |
|--------|------|-------------|---------------|-----------|
| POST | `/api/v1/users/register` | Registro de usuario | `userName`, `password` | Usuario creado |
| POST | `/api/v1/users/login` | Login y obtención de JWT | `userName`, `password` | Token + info usuario |
| GET | `/api/v1/users` | Obtiene todos los usuarios (solo admin) | — | Array de usuarios |
| GET | `/api/v1/users/:userName` | Obtiene un usuario por nombre | `userName` | Usuario (si es admin o propio usuario) |
| PUT | `/api/v1/users/:userName` | Actualiza rol, userName o password | Campos a actualizar | Usuario actualizado |
| DELETE | `/api/v1/users/:userName` | Elimina usuario | `userName` | Usuario eliminado |

**Middleware:** `isAuth` y `isAdmin` protegen rutas según permisos.
  
---

## 🔐 Autenticación

Las rutas protegidas requieren un token JWT enviado en la cabecera:

Authorization: Bearer TOKEN

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

## 🌱 Semilla (Seed Data)

El archivo `seedData.js` inserta datos iniciales de **Places** y **Posts**.

- Conecta a la base de datos
- Inserta lugares y posts con `image: { url, public_id }`
- Cierra la conexión automáticamente

```bash
node seeds/seedData.js
```

---
  
## ☁️ Subida y eliminación de archivos (Cloudinary)

- Subida automática usando Multer + CloudinaryStorage
- Carpetas: `/Places` y `/Posts`
- Al eliminar un Place o Post, si existe `image.public_id`, se elimina de Cloudinary automáticamente
- Storage reutilizable cambiando solo la carpeta

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

## ⚠️ Manejo de errores

  | Código | Tipo de error | Cuándo ocurre | Ejemplo de respuesta |
|--------|----------------|----------------|------------------------|
| 400 | **Bad Request** | Faltan campos obligatorios o datos inválidos | `{ "error": "Faltan campos obligatorios" }` |
| 403 | Forbidden | Usuario no tiene permisos | `{ "error": "No tienes permisos" }` 
| 404 | **Not Found** | El recurso solicitado no existe en la base de datos | `{ "error": "No se encontró el lugar solicitado" }` |
| 500 | **Internal Server Error** | Error inesperado del servidor (por ejemplo, fallo de conexión o bug interno) | `{ "error": "Error interno del servidor"}` |



Todos los controladores devuelven errores estandarizados  para evitar exponer información sensible.

---

## 🔧 Configuración y ejecución

1. Instala las dependencias:
```bash
npm install
```
2. Crea un archivo `.env` en la raíz con tus variables:
```
PORT=3000
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

✅ Tres modelos: `Place` , `Post` y `User`

✅ Relación entre colecciones

✅ CRUD completo para ambas

✅ Subida y eliminación de archivos en Cloudinary

✅ Semilla de datos

✅ README documentado y formateado

---

## ✨ Autoría

Proyecto desarrollado por ****Marta Ramírez Linares****

💻 GitHub: [https://github.com/Martaarl](https://github.com/Martaarl)
