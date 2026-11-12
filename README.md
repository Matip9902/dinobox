# Dinobox

Actividad formativa DSY1104: gestión de encomiendas con React y Spring Boot.

## Funciones

Registrar envíos con código de seguimiento, consultar, actualizar estado y ubicación, editar datos y eliminar encomiendas.

## Requisitos

- JDK 21 o compatible (probado por el estudiante con JDK 25).
- Node.js 24 y npm.

## Backend

Desde Git Bash:

```bash
cd backend
./mvnw spring-boot:run
```

API: http://localhost:8080/api/v1/encomienda

Swagger: http://localhost:8080/swagger-ui/index.html

H2: http://localhost:8080/h2-console

Conexión H2: `jdbc:h2:file:./data/dinobox`, usuario `sa`, contraseña vacía.
Los datos se crean localmente en `backend/data` al ejecutar desde backend. No se incluyen registros de prueba.

Pruebas y empaquetado:

```bash
./mvnw clean package
```

Las pruebas usan H2 en memoria, independiente de la base local.

## Frontend

En otra terminal:

```bash
cd dinobox-frontend
npm ci
npm run dev -- --port 5173 --strictPort
```

Abrir http://localhost:5173. Mantener ambas terminales abiertas.

Compilar:

```bash
npm run build
```

## Endpoints

| Método | Ruta | Función |
|---|---|---|
| POST | /api/v1/encomienda | Registrar |
| GET | /api/v1/encomienda | Listar |
| GET | /api/v1/encomienda/{codigo} | Consultar |
| PUT | /api/v1/encomienda/{codigo} | Actualizar estado y ubicación |
| PUT | /api/v1/encomienda/{codigo}/datos | Editar datos |
| DELETE | /api/v1/encomienda/{codigo} | Eliminar |

Estados: EN_RECEPCION, EN_DESPACHO, EN_TRANSITO, ENTREGADO.

## Alcance

La versión actual utiliza H2. El enunciado solicita MySQL: su configuración queda pendiente salvo aceptación de H2 por el docente. La aplicación es una demostración local sin autenticación; la edición y eliminación están disponibles en la interfaz.

No se incluyen dependencias instaladas ni archivos generados. Publicar el código en GitHub no despliega la aplicación.
