"""
WebSocket connection manager.

Tracks all currently connected clients and provides a resilient
broadcast: a single dead connection must never prevent delivery to
the other connected clients.
"""
import logging
from typing import List

from fastapi import WebSocket

logger = logging.getLogger("smart_fish.websocket")


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info("Client connected. Total clients: %d", len(self.active_connections))

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info("Client disconnected. Total clients: %d", len(self.active_connections))

    async def broadcast(self, message: dict) -> None:
        """
        Send `message` to every connected client.

        A connection that fails to receive the message (closed, network
        error) is dropped from the pool instead of aborting the whole
        broadcast — the other clients must still get their update.
        """
        dead_connections: List[WebSocket] = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as exc:
                logger.warning("Failed to send to a client, dropping it: %s", exc)
                dead_connections.append(connection)

        for dead in dead_connections:
            self.disconnect(dead)


manager = ConnectionManager()