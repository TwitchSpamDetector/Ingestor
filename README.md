# Ingestor

Microservicio del proyecto **TwitchSpamDetector**. Se conecta al chat en vivo
de Twitch (IRC, vía [tmi.js](https://github.com/tmijs/tmi.js)) y publica cada
mensaje en una cola de **RabbitMQ** para que el **Motor de Moderación** lo
consuma y analice en tiempo real.

La API HTTP (`/listeners`, `/health`) sigue el contrato en
[`openapi/ingestor-openapi.yaml`](./openapi/ingestor-openapi.yaml). El envío
de mensajes al Motor de Moderación ya no es ese `POST /analyze` que aparece
como referencia en el contrato original: se decidió pasar a un modelo
asíncrono por cola desde la v1, en vez de HTTP directo.

## Stack

- Node.js + TypeScript
- Express (API de `/listeners` y `/health`)
- tmi.js (cliente IRC de Twitch)
- amqplib (publica en RabbitMQ)
- Jest + Supertest (tests)

## Arquitectura del servicio

```
src/
├── index.ts                        # entrypoint
├── app.ts                          # configuración de Express
├── config/env.ts                   # variables de entorno
├── types/                          # interfaces (Listener, ChatMessage, ErrorResponse)
├── controllers/                    # handlers de Express
├── routes/                         # definición de rutas
├── services/
│   ├── listener.service.ts         # estado de los listeners + cliente tmi.js
│   ├── rabbitmq.service.ts         # conexión/canal de RabbitMQ
│   └── moderationClient.service.ts # publica el ChatMessage en la cola
├── middlewares/                    # errorHandler + notFoundHandler
└── utils/                          # AppError, logger
```

## Cómo correrlo

```bash
docker compose up -d   # levanta RabbitMQ local (panel en http://localhost:15672, guest/guest)
npm install
cp .env.example .env
npm run dev
```

El servicio queda escuchando en `http://localhost:3000/api/v1` (configurable
con `PORT`). Si RabbitMQ no está disponible al arrancar, el Ingestor igual
levanta el servidor HTTP y solo loguea una advertencia; reintenta la
conexión con el primer mensaje de chat que llegue.

Sin credenciales de Twitch, tmi.js se conecta en modo anónimo, suficiente
para **leer** el chat. Solo hacen falta `TWITCH_USERNAME` y
`TWITCH_OAUTH_TOKEN` si más adelante el Ingestor necesita escribir en el
chat (banear, timeouts, etc).

## Endpoints

| Método | Ruta                        | Descripción                                  |
|--------|-----------------------------|-----------------------------------------------|
| GET    | `/api/v1/listeners`         | Lista los canales actualmente escuchados      |
| POST   | `/api/v1/listeners`         | Empieza a escuchar un canal (`{ channelId }`) |
| DELETE | `/api/v1/listeners/{id}`    | Detiene la escucha de un canal                |
| GET    | `/api/v1/health`            | Estado del servicio                           |

Cada mensaje de chat capturado se publica como `ChatMessage` (JSON) en la
cola de RabbitMQ configurada en `MODERATION_QUEUE` (por defecto
`chat-messages`), lista para que el Motor de Moderación la consuma.

## Tests

```bash
npm test
```

## Docker

```bash
docker build -t twitchspamdetector/ingestor .
docker run -p 3000:3000 --env-file .env twitchspamdetector/ingestor
```

## Pendiente para fases posteriores

- Estado de listeners compartido (Redis) si el servicio llega a correr en
  más de una instancia — está en evaluación para meterse también desde la v1.
- Por ahora, si RabbitMQ rechaza un mensaje ya conectado (cola llena, etc.)
  el Ingestor solo lo loguea; no hay dead-letter queue todavía.
