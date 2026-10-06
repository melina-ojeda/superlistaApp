# 🛒 SuperListaApp

Aplicación móvil para gestionar una lista de compras, desarrollada con **React Native**, **Expo** y **TypeScript**. Permite registrarse, iniciar sesión, agregar y marcar productos como comprados, ver status de la lista y programar recordatorios con notificaciones locales. Todos los datos se guardan en el dispositivo.

> **Video demo:** https://youtu.be/vkXPhjsLLko

---

## Funcionalidades

- **Registro e inicio de sesión** con usuario y contraseña guardados localmente.
- **Lista de compras** con alta, baja y marcado de productos como comprados.
- **Limpieza rápida** de todos los productos comprados con un solo botón.
- **Status bar** con el total, los pendientes y los comprados.
- **Recordatorios** con notificaciones locales programadas por tiempo en segundos.
- **Persistencia de datos:** la información sigue disponible al cerrar y volver a abrir la app.
- **Manejo de permisos** de notificaciones, con acceso directo a los ajustes del dispositivo.


## Estructura del proyecto

```
.
├── App.tsx                      # Configuración de la navegación
├── types.ts                     # Tipos e interfaces 
└── src/
    ├── screens/
    │   ├── LoginScreen.tsx      # Inicio de sesión
    │   ├── RegistryScreen.tsx   # Registro de usuario
    │   ├── HomeScreen.tsx       # Lista de compras (pantalla principal)
    │   └── CreateItemScreen.tsx # Agregar un producto
    ├── components/
    │   ├── AddItemButton.tsx    # Botón flotante "+"
    │   ├── StatsBar.tsx         # Estadísticas de la lista
    │   └── ReminderModal.tsx    # Modal para programar recordatorios
    └── hooks/
        ├── useGroceryList.tsx   # Lógica de la lista (CRUD + persistencia)
        └── useNotifications.tsx # Permisos, programación y persistencia de recordatorios
```

---

## Arquitectura

El proyecto separa las responsabilidades en tres capas:

- **Pantallas (`screens`):** orquestan la experiencia del usuario y la navegación.
- **Componentes (`components`):** piezas de interfaz reutilizables que reciben datos y eventos por props.
- **Hooks personalizados (`hooks`):** concentran la lógica de datos y los efectos secundarios, de modo que la interfaz no necesita saber cómo se guarda la información.

### Hooks principales

**`useGroceryList`**
Gestiona la lista de productos. Expone `items`, `loading`, `error` y las funciones `loadItems`, `addItem`, `toggleItem`, `deleteItem` y `clearPurchased`. Cada operación calcula una nueva lista (sin mutar la anterior), actualiza el estado y la guarda en AsyncStorage con la clave `@grocery_list`.

**`useNotifications`**
Gestiona los recordatorios. Expone `permissionStatus`, `loading`, `requestPermission` y `addReminder`. Se encarga de crear el canal de Android, solicitar permisos, programar la notificación con un disparador por tiempo y guardar el recordatorio en AsyncStorage (`@shopping_reminder`).

## Instalación y ejecución

### Requisitos

- [Node.js](https://nodejs.org/) (versión LTS)
- npm o yarn
- La app **Expo Go** en tu celular, o un emulador de Android / iOS

### Pasos

```bash
# 1. Clonar el repositorio
git clone <https://github.com/melina-ojeda/superlistaApp.git>
cd <nombre-de-la-carpeta>

# 2. Instalar las dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

Luego escaneá el código QR con Expo Go (Android) o con la cámara (iOS), o presioná `a` para abrir el emulador de Android.

