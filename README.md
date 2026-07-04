# Smart Fish — Enterprise IoT Fish Farm Monitoring Platform

Smart Fish is a full-stack IoT monitoring system for fish farms. An ESP32
publishes water-quality sensor readings over MQTT; a FastAPI backend
subscribes, stores measurements in MySQL, evaluates threshold-based alerts,
and broadcasts everything live over WebSocket to a React dashboard.

## Architecture
ESP32 (sensors)
│  MQTT publish
▼
Mosquitto Broker
│  MQTT subscribe
▼
FastAPI MQTT Client  ──►  MySQL (measurements, alerts)
│  WebSocket broadcast
▼
React Dashboard (live cards, charts, alert toasts)

REST API (CRUD on users, sensor types, sensors, measurements, alerts) and
the WebSocket real-time layer are both served by the same FastAPI app.

## Tech Stack

**Backend:** Python 3.13, FastAPI, SQLAlchemy 2.x, PyMySQL, Pydantic,
Uvicorn, Paho MQTT, Passlib (bcrypt)
**Frontend:** React 18 (Vite), Tailwind CSS, React Router, Axios,
Chart.js, Framer Motion, React Hot Toast
**Infrastructure:** MySQL 8, Mosquitto MQTT broker

## Prerequisites

- Python 3.13+
- Node.js 18+
- MySQL Server (running, with `smart_fish_db` created — see `back/schema.sql` if present, or the SQL block below)
- Mosquitto broker installed and running on `localhost:1883`

## 1. Database Setup

Run the schema against your MySQL instance (creates `smart_fish_db`,
tables, and seeds the 5 sensor types + 5 sensors):

```bash
mysql -u root -p < schema.sql
```

*(if `schema.sql` isn't in the repo yet, use the SQL script from the project's original setup)*

## 2. Backend Setup

```bash
cd back
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Copy the example environment file and fill in your real values:
```bash
copy .env.example .env         # Windows
# cp .env.example .env         # macOS/Linux
```

Edit `.env` — at minimum set `DB_PASSWORD` to your MySQL password.

Run the API:
```bash
uvicorn app.main:app --reload
```

- Swagger docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health
- WebSocket endpoint: `ws://127.0.0.1:8000/api/v1/ws/live`

The MQTT client starts automatically with the app and subscribes to
`smartfish/data` on `localhost:1883`.

## 3. Frontend Setup

In a separate terminal:
```bash
cd front
npm install

copy .env.example .env         # Windows
# cp .env.example .env         # macOS/Linux
```

`front/.env` should contain:
VITE_API_BASE_URL=http://localhost:8000/api/v1

Run the dev server:
```bash
npm run dev
```

Open http://localhost:5173 and log in (any email/password — auth is a
frontend stub, not yet enforced against the backend).

## 4. Simulating Sensor Data (MQTT)

With Mosquitto running and the backend started, publish a test payload:

```bash
mosquitto_pub -h localhost -t smartfish/data -m '{"temperature": 32, "ph": 7.1, "turbidity": 10, "oxygen": 6, "water_level": 40}'
```

Expected result on the running Dashboard, without a page refresh:
- The 5 sensor cards update with the new values
- A toast notification appears if any value crosses a threshold
  (e.g. `temperature: 32` triggers a "too HIGH" warning)
- The connection badge in the navbar shows **Live**

## Project Structure
web_smart_fish/
├── back/
│   ├── app/
│   │   ├── api/          # REST + WebSocket routers
│   │   ├── core/         # config, security, exception handlers
│   │   ├── database/     # SQLAlchemy engine, session, Base
│   │   ├── models/       # ORM models (users, sensors, measurements, alerts...)
│   │   ├── mqtt/         # Paho MQTT client, threshold engine, WS bridge
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── services/     # Business logic (CRUD, password hashing...)
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
└── front/
├── src/
│   ├── components/   # ui, layout, dashboard, charts, tables
│   ├── contexts/      # Theme, Auth, Realtime (WebSocket state)
│   ├── hooks/          # useWebSocket, useDebounce, useClock...
│   ├── layouts/        # DashboardLayout, AuthLayout
│   ├── pages/          # Dashboard, Sensors, Analytics, Alerts...
│   ├── services/       # Axios API clients
│   └── utils/
└── .env.example

## Known Limitations / Roadmap

- Authentication is currently a frontend-only stub — the backend has the
  `users` table and password hashing ready, but login isn't yet wired to
  a real JWT flow.
- `Sensors`, `Analytics`, `History`, `Reports`, and `Device Status` pages
  still run on mock data (`front/src/utils/mockData.js`) — only the
  Dashboard's sensor cards, chart, and alert toasts are live-wired to
  the real API + WebSocket.
- No `ponds` concept exists in the database — the app monitors 5 fixed
  sensors directly.

## Troubleshooting

- **`ModuleNotFoundError` on backend startup**: activate the venv and
  re-run `pip install -r requirements.txt`.
- **WebSocket won't connect / 404 on `/ws/live`**: make sure
  `uvicorn[standard]` is installed (plain `uvicorn` lacks WebSocket
  support).
- **`bcrypt` / `passlib` errors**: this project pins `bcrypt==4.0.1` for
  compatibility with `passlib==1.7.4`. Reinstall that exact version if
  password hashing fails.
- **MQTT payload not parsed / `json.loads` error**: check for a stale
  retained message on the topic (`mosquitto_pub -h localhost -t
  smartfish/data -r -n` clears it) and make sure your publish command
  sends valid JSON with double-quoted keys.