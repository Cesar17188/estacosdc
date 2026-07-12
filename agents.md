# Instrucciones para Agentes de IA (agents.md)

Este documento describe la arquitectura, stack tecnológico y convenciones de código para el proyecto **EstancosDC**. Los agentes de IA o asistentes de código deben adherirse a estas pautas al generar, refactorizar o analizar el código.

## 🛠️ Stack Tecnológico

- **Framework Frontend:** Angular 21 (Standalone Components).
- **Backend / BaaS:** Supabase (`@supabase/supabase-js`).
- **Server-Side Rendering (SSR):** Angular SSR con Express.
- **PWA:** Service Workers de Angular (`@angular/service-worker`).
- **Node.js & TypeScript:** TypeScript ~5.9.2.
- **Testing:** Vitest.

## 📝 Convenciones de Desarrollo

### 1. Angular Standalone Components
- Utilizar siempre componentes Standalone. No utilizar `NgModules`.
- Importar las directivas, pipes y otros componentes estrictamente en la propiedad `imports` del decorador `@Component`.

### 2. Integración con Supabase
- Toda la comunicación con Supabase (Autenticación y Base de Datos) debe encapsularse en servicios (ej. dentro de `core/services/`).
- Evitar llamar a Supabase directamente desde los componentes visuales.
- Manejar adecuadamente las consultas asíncronas utilizando promesas o convirtiéndolas a observables con RxJS o Signals según convenga.

### 3. Server-Side Rendering (SSR)
- Dado que el proyecto tiene SSR habilitado, no se debe acceder globalmente a objetos del navegador como `window`, `document` o `localStorage` directamente en constructores o inicializadores de las clases.
- Siempre validar la ejecución con `isPlatformBrowser()` cuando se necesiten APIs exclusivas del DOM.
- Mantener las peticiones a la API compatibles con la ejecución en el servidor (Node/Express).

### 4. Reactividad y Estado
- Promover el uso de **Signals** de Angular (`signal`, `computed`, `effect`) para estados locales sincrónicos, en lugar del enfoque tradicional con properties mutables o Subjects.
- Mantener **RxJS** para flujos asíncronos y eventos complejos, como WebSockets o encadenamiento de peticiones HTTP.

### 5. Arquitectura Orientada a Características (Feature-driven)
- Organizar el código por dominios o "features" (ej. en `src/app/features/`).
- Separar lógica central (guards, interceptores, servicios singleton) en un directorio `core/`.

## 🚀 Comandos Principales

- **Desarrollo:** `npm start` (ejecuta `ng serve`)
- **Construcción:** `npm run build`
- **Testing:** `npm test` (ejecuta Vitest)
- **SSR Local:** `npm run serve:ssr:estacosdc` (inicia el servidor Express)
