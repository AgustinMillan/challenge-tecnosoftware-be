# 🚀 Challenge Senior Fullstack - Ecommerce Event-Driven

Este proyecto es la evolución de un sistema monolítico hacia un modelo **Event-Driven**, resolviendo problemas estructurales de acoplamiento y asincronía, con una interfaz reactiva que maneja la **consistencia eventual**.

## 📑 Diagnóstico y Decisiones de Arquitectura

Al analizar el repositorio original, se identificaron y corrigieron los siguientes "pain points":

- **Acoplamiento Estructural:** El catálogo y el inventario estaban fuertemente vinculados. [cite_start]Se desacoplaron mediante el uso de `EventEmitter2` para permitir que el dominio de Inventario reaccione a cambios en Catálogo sin interferir en la transacción principal[cite: 24].
- **Ausencia de Validación de Negocio:** Se implementaron DTOs robustos con `class-validator` para asegurar que la integridad de los datos se mantenga desde el punto de entrada.
- **Manejo de Estados Asíncronos:** Se identificó que operaciones críticas (como la creación de inventario) no debían bloquear la experiencia del usuario, optando por una arquitectura reactiva.

---

## 🏗️ Flujos Orientados a Eventos Implementados

Se diseñaron e implementaron **2 eventos de dominio** clave para validar la comunicación desacoplada[cite: 23]:

### 1. `product.variation.created`

- **Origen:** Catálogo de productos.
- **Efecto:** Al crear una nueva variación, el sistema de inventario escucha el evento e inicializa el registro de stock en `0` para los países correspondientes de forma asíncrona.
- **Justificación:** Evita latencia en la creación de productos y permite que el inventario se gestione en un proceso independiente.

### 2. `product.activated` (Lógica Reactiva)

- **Origen:** Cambio de estado del producto a "Activo".
- **Efecto:** Un suscriptor valida si el producto tiene stock real. Si el stock es `0`, el sistema **revierte** la activación automáticamente y notifica al usuario en tiempo real.
- **Justificación:** Demuestra el uso de eventos para aplicar reglas de negocio complejas que dependen de múltiples módulos sin acoplarlos sincrónicamente.

---

## 💻 Tecnologías y Decisiones Técnicas Relevantes

- **Backend:** NestJS con `EventEmitter2` para el bus de eventos interno y `Socket.io` para notificaciones en tiempo real (v9 compatible).
- **Frontend:** React con **Polling Inteligente** y **Custom Events** para manejar la consistencia eventual de la UI sin recargas forzadas de página.
- **Real-time:** Integración de WebSockets para alertar fallos asíncronos (ej: fallos de activación por falta de stock).
- **Seguridad:** Interceptores de Axios para manejo proactivo de expiración de sesiones (Token Expired).
- **Testing:** Por razones de tiempo limitado y prioridad en el flujo de eventos y despliegue, se omitieron las pruebas unitarias en esta entrega.

---

## 🌐 URLs de Acceso

- **Frontend (Vercel):** [https://challenge-tecnosoftware-one.vercel.app/](https://challenge-tecnosoftware-one.vercel.app/)
- **Backend (VPS Propia):** Alojado en infraestructura privada para garantizar control total sobre el entorno y la base de datos[cite: 37].

---

## 🛠️ Cómo levantar el proyecto localmente

### Backend (NestJS)

1. `cd ./nestjs-ecommerce`
2. Levantar la base de datos: `docker-compose up -d`
3. Instalar dependencias: `npm install`
4. Ejecutar Seeders: `npm run seed:run`
5. Iniciar app: `npm run start:dev`

### Frontend (React)

1. Instalar dependencias: `npm i`
2. Configurar `.env` con la URL de la API. (no necesrio en desarrollo ya que coloque por defecto el puerto 3000)
3. Iniciar desarrollo: `npm run dev`

---

> **Nota:** Se optó por un despliegue híbrido (Vercel + VPS) para aprovechar la rapidez de entrega de un CDN en el front y la robustez de un entorno controlado por Docker para el back y la base de datos[cite: 32, 37].

---
