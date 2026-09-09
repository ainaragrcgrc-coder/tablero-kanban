# Tablero Kanban

Aplicación web de gestión de tareas basada en un tablero Kanban, desarrollada con HTML5, CSS3, JavaScript Vanilla, SortableJS y json-server.

## Funcionalidades

* Visualización de tareas organizadas en columnas:

  * Por Hacer
  * En Proceso
  * Revisión
  * Finalizado
* Creación de nuevas tareas.
* Edición de título y descripción.
* Eliminación de tareas.
* Drag & Drop para cambiar las tareas de columna.
* Persistencia de los cambios mediante json-server.
* Estadísticas de tareas por estado.
* Vista de detalle de cada tarea.
* Sistema de comentarios asociado a cada tarea.
* Búsqueda de tareas por título en tiempo real.
* Diseño responsive.
* Menú hamburguesa para dispositivos móviles.

## Extras realizados

### 👤 Gestión de usuarios y asignación

* Gestión de usuarios mediante el endpoint `/users`.
* Asignación de un responsable a cada tarea.
* Visualización del nombre del responsable en las tarjetas.
* Visualización del avatar o iniciales del responsable.

### 🏷️ Etiquetas y filtros avanzados

* Añadidas etiquetas a las tareas:

  * 🎨 Diseño
  * 💻 Desarrollo
  * 📄 Documentación
  * 🔥 Urgente
* Filtros por prioridad.
* Filtros por etiqueta.
* Filtros por responsable.
* Búsqueda de tareas por título.

### 📋 Columnas dinámicas

* Creación de nuevas columnas desde la aplicación.
* Posibilidad de mover tareas mediante Drag & Drop entre las columnas.
* Las columnas creadas se guardan en `localStorage`.
* Las columnas permanecen después de actualizar la página.

## Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript Vanilla
* SortableJS
* json-server
* Git
* GitHub

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar en la carpeta del proyecto:

```bash
cd tablero-kanban
```

Instalar las dependencias:

```bash
npm install
```

## Ejecutar json-server

Para iniciar el servidor:

```bash
npx.cmd json-server db.json
```

La API estará disponible en:

```text
http://localhost:3000
```

Endpoints utilizados:

```text
http://localhost:3000/tasks
http://localhost:3000/users
http://localhost:3000/comments
```

## Ejecutar la aplicación

Abrir el archivo `index.html` utilizando **Live Server** desde Visual Studio Code.

Es necesario mantener `json-server` ejecutándose en la terminal mientras se utiliza la aplicación.

## Estructura del proyecto

```text
tablero-kanban/
│
├── .gitignore
├── db.json
├── index.html
├── package.json
├── package-lock.json
├── script.js
├── style.css
└── README.md
```

## Funcionamiento

Las tareas se obtienen mediante una petición `GET` a json-server y se muestran automáticamente en la columna correspondiente según su estado.

Las nuevas tareas se crean mediante una petición `POST`.

Los cambios de estado realizados mediante Drag & Drop se guardan mediante una petición `PATCH`.

La edición de tareas utiliza una petición `PATCH`.

Los comentarios se obtienen mediante `GET` y los nuevos comentarios se guardan mediante `POST`.

Las tareas pueden eliminarse mediante una petición `DELETE`.

Los usuarios se obtienen mediante `GET` desde el endpoint `/users`.

Las etiquetas y responsables se guardan junto con cada tarea.

Las columnas dinámicas creadas por el usuario se almacenan en `localStorage`.
