<div align="center">

# 🏢 Taller API RESTFul
### Empresas & Empleados

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Seguridad-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-Docs-85EA2D?style=flat-square&logo=swagger&logoColor=black)
![Render](https://img.shields.io/badge/Render-Desplegado-46E3B7?style=flat-square&logo=render&logoColor=black)

**API RESTFul construida con Node.js · Express · MongoDB Atlas**  
Seguridad con JSON Web Tokens · Documentación con Swagger UI

[🚀 Ver API en vivo](https://taller-api-rest-mom1.onrender.com) · [📄 Documentación Swagger](https://taller-api-rest-mom1.onrender.com/api/docs)

</div>

---

##Descripción

API RESTFul para la gestión de **Empresas** y **Empleados**, para la asignatura Electiva II, haciendo uso de Swagger y JWT.

La relacion de los objetos seleccionados son de uno a muchos, ya que una empresa puede tener muchos empleados, pero un empleado solo puede pertenecer a una empresa.

---

## Características

- **CRUD completo** para Empresas y Empleados
- **Autenticación JWT** — tokens con expiración de 1 hora
- **Control de roles** — `admin` (lectura/escritura) · `user` (solo lectura)
- **Relación referencial** — Empleado vinculado a Empresa por ObjectId
- **Swagger UI** — documentación interactiva en `/api/docs`
- **MongoDB Atlas** — persistencia en la nube
- **Desplegado en Render** — disponible públicamente

---

## Arquitectura
```
Cliente (Postman / Swagger UI)
        │  HTTPS
        ▼
   index.js — Express App (Render)
        │
        ├── Middlewares: verifyToken · soloAdmin
        │
        ├── /api/auth      → routes-auth      → ctrl-auth      (login JWT)
        ├── /api/empresas  → routes-empresa   → ctrl-empresa   → Empresa (Mongoose)
        └── /api/empleados → routes-empleados → ctrl-empleados → Empleado (Mongoose)
                                                                       │
                                                               MongoDB Atlas
```

---

## 📁 Estructura del Proyecto
```
taller-api/
├── index.js                        # Punto de entrada
├── swagger.mjs                     # Configuración OpenAPI 3.0
├── .env                            # Variables de entorno (no incluido en repo)
├── drivers/
│   └── connect-db.mjs              # Conexión a MongoDB Atlas
├── models/
│   ├── empresa.mjs                 # Esquema Mongoose — Empresa
│   └── empleados.mjs               # Esquema Mongoose — Empleado
├── controllers/
│   ├── controll-auth.mjs           # Login y generación de JWT
│   ├── controll-empresa.mjs        # CRUD Empresa
│   └── controll-empleados.mjs      # CRUD Empleado
├── middlewares/
│   ├── auth.mjs                    # Middleware verifyToken
│   └── roles.mjs                   # Middleware soloAdmin
└── routes/
    ├── routes-auth.mjs             # POST /api/auth/login
    ├── routes-empresa.mjs          # CRUD /api/empresas
    └── routes-empleados.mjs        # CRUD /api/empleados
```

---

## Endpoints

### Autenticación (pública)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Obtener token JWT |
| `GET` | `/ping` | Health check |
| `GET` | `/api/docs` | Swagger UI |

### Empresas (requiere JWT)

| Método | Endpoint | Rol requerido | Descripción |
|--------|----------|---------------|-------------|
| `GET` | `/api/empresas` | user / admin | Listar todas |
| `GET` | `/api/empresas/:id` | user / admin | Obtener por ID |
| `POST` | `/api/empresas` | **admin** | Crear empresa |
| `PUT` | `/api/empresas/:id` | **admin** | Actualizar empresa |
| `DELETE` | `/api/empresas/:id` | **admin** | Eliminar empresa |

### Empleados (requiere JWT)

| Método | Endpoint | Rol requerido | Descripción |
|--------|----------|---------------|-------------|
| `GET` | `/api/empleados` | user / admin | Listar todos (con empresa) |
| `GET` | `/api/empleados/:id` | user / admin | Obtener por ID |
| `POST` | `/api/empleados` | **admin** | Crear empleado |
| `PUT` | `/api/empleados/:id` | **admin** | Actualizar empleado |
| `DELETE` | `/api/empleados/:id` | **admin** | Eliminar empleado |

---

## Seguridad JWT

El flujo de autenticación es el siguiente:
```
1. POST /api/auth/login  →  { username, password }
2. Servidor valida credenciales y responde con el token JWT
3. El cliente incluye el token en cada petición:
   Authorization: Bearer <token>
4. El middleware verifyToken valida el token
5. El middleware soloAdmin verifica el rol para operaciones de escritura
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/
MONGODB_DB=tallerapi
JWT_SECRET=tu_clave_secreta_aqui

# Credenciales de usuarios
ADMIN_USER=admin
ADMIN_PASS=tu_contraseña_admin
USER_USER=user
USER_PASS=tu_contraseña_user
```

---

##  Instalación y Ejecución Local

**Prerrequisitos:** Node.js >= 18 · Cuenta en MongoDB Atlas
```bash
# 1. Clonar el repositorio
git clone https://github.com/DumarMalpica/taller-api-rest.git
cd taller-api-rest

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# editar .env con tus valores

# 4. Ejecutar en desarrollo
npm run dev

# 5. Ejecutar en producción
npm start
```

Verifica que funciona:
```
GET http://localhost:3000/ping
→ { "state": true, "msg": "pong" }
```

---

## 🌐 Despliegue

La API está desplegada en **Render.com**:

| Recurso | URL |
|---------|-----|
| API Base | `https://taller-api-rest-mom1.onrender.com` |
| Health check | `https://taller-api-rest-mom1.onrender.com/ping` |
| Swagger UI | `https://taller-api-rest-mom1.onrender.com/api/docs` |


---

## Link de documentacion

| Recurso | URL |
|---------|-----|
| Diagramas | `https://drive.google.com/file/d/1B6zVzJ6U-WVpUedWXyqxNCydZLZql3Xe/view?usp=sharing` |

