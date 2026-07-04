"""
WebSocket endpoint for the real-time layer.

Extracted into its own module (instead of living in main.py) to keep the
routing layer modular, consistent with how every REST resource already
has its own endpoint file under app/api/v1/endpoints/.
"""
import asyncio
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.api.v1.websocket import manager

logger = logging.getLogger("smart_fish.websocket")

router = APIRouter(tags=["Real-Time"])

# If no message (not even a client ping) is received within this window,
# the connection is considered stale and closed.
HEARTBEAT_TIMEOUT_SECONDS = 45


@router.websocket("/ws/live")
async def websocket_live(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    await websocket.send_json({"type": "connected", "data": {}})

    try:
        while True:
            try:
                raw = await asyncio.wait_for(
                    websocket.receive_text(), timeout=HEARTBEAT_TIMEOUT_SECONDS
                )
            except asyncio.TimeoutError:
                logger.info("Client idle for %ds, closing connection", HEARTBEAT_TIMEOUT_SECONDS)
                await websocket.close(code=1000)
                break

            # Client heartbeat: respond to ping so the client can confirm
            # the connection is still alive.
            if raw == '{"type":"ping"}' or raw.strip() == "ping":
                await websocket.send_json({"type": "pong", "data": {}})

    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(websocket)