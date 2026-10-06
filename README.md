# 🛒 SuperListaApp

Aplicación móvil para gestionar una lista de compras, desarrollada con **React Native**, **Expo** y **TypeScript**. Permite registrarse, iniciar sesión, agregar y marcar productos como comprados, ver status de la lista y programar recordatorios con notificaciones locales. Todos los datos se guardan en el dispositivo.

> **Video demo:** _Enlace de YouTube_

---

## Funcionalidades

- **Registro e inicio de sesión** con usuario y contraseña guardados localmente.
- **Lista de compras** con alta, baja y marcado de productos como comprados.
- **Limpieza rápida** de todos los productos comprados con un solo botón.
- **Status bar** con el total, los pendientes y los comprados.
- **Recordatorios** con notificaciones locales programadas por tiempo en segundos.
- **Persistencia de datos:** la información sigue disponible al cerrar y volver a abrir la app.
- **Manejo de permisos** de notificaciones, con acceso directo a los ajustes del dispositivo.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| [React Native] + [Expo] | Base de la aplicación móvil |
| [TypeScript] | Tipado estático |
| [React Navigation] | Navegación entre pantallas |
| [React Native Paper] | Componentes de interfaz |
| [AsyncStorage] | Almacenamiento local persistente |
| [expo-notifications] | Notificaciones locales y permisos |
| [expo-device] | Detección de dispositivo físico o emulador |

---

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

### Flujo de navegación

```
Login ⇄ Registry
  │
  └──(reset)──► Home ──► CreateItem
                 │          │
                 └──(goBack + recarga con useFocusEffect)
```

Al iniciar sesión se usa `navigation.reset` para que el botón "atrás" no regrese al login. Al volver desde `CreateItem`, `HomeScreen` recarga la lista mediante `useFocusEffect`.

---

## Instalación y ejecución

### Requisitos

- [Node.js](https://nodejs.org/) (versión LTS)
- npm o yarn
- La app **Expo Go** en tu celular, o un emulador de Android / iOS

### Pasos

```bash
# 1. Clonar el repositorio
git clone <URL-del-repositorio>
cd <nombre-de-la-carpeta>

# 2. Instalar las dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

Luego escaneá el código QR con Expo Go (Android) o con la cámara (iOS), o presioná `a` para abrir el emulador de Android.

---

## Uso

1. **Registrate** con un usuario y una contraseña.
2. **Iniciá sesión** con esas credenciales.
3. En la pantalla principal, tocá **"+"** para agregar un producto.
4. Tocá el **checkbox** para marcar un producto como comprado y el **ícono de papelera** para eliminarlo.
5. Usá **"Limpiar productos comprados"** para vaciar los ya marcados.
6. Tocá la **campana** del encabezado para programar un recordatorio: ingresá un título, una descripción y los segundos hasta que suene.

---

## Limitaciones conocidas

- **Contraseñas en texto plano:** el usuario y la contraseña se guardan en AsyncStorage sin cifrar. Es válido para un proyecto académico con un solo usuario local, pero una app real debería usar `expo-secure-store` y autenticación con un servidor.
- **Notificaciones en Expo Go:** el soporte de notificaciones es limitado en Expo Go y en algunos emuladores. Para un comportamiento completo conviene usar un *development build* en un dispositivo físico.
- **Estado no compartido entre pantallas:** cada pantalla crea su propia instancia de `useGroceryList`; por eso se recarga la lista al recuperar el foco.
- **Un solo usuario:** el registro sobrescribe las credenciales guardadas anteriormente.

---
