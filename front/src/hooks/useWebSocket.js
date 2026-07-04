import { useEffect, useRef, useState, useCallback } from 'react'

const RECONNECT_DELAYS = [1000, 2000, 5000, 10000] // ms, capped at the last value
const PING_INTERVAL_MS = 20000 // stays comfortably under the 45s server heartbeat timeout

/**
 * Generic reconnecting WebSocket hook.
 *
 * Status lifecycle: 'connecting' -> 'connected' -> 'disconnected' -> 'reconnecting' -> 'connected' -> ...
 * Exposes the latest parsed JSON message and a manual send function.
 */
export function useWebSocket(url) {
  const [status, setStatus] = useState('connecting')
  const [lastMessage, setLastMessage] = useState(null)

  const socketRef = useRef(null)
  const reconnectAttemptRef = useRef(0)
  const reconnectTimeoutRef = useRef(null)
  const pingIntervalRef = useRef(null)
  const mountedRef = useRef(true)

  const clearTimers = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
  }, [])

  const connect = useCallback(() => {
    if (!mountedRef.current) return

    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.onopen = () => {
      if (!mountedRef.current) return
      setStatus('connected')
      reconnectAttemptRef.current = 0

      pingIntervalRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }))
        }
      }, PING_INTERVAL_MS)
    }

    socket.onmessage = (event) => {
      if (!mountedRef.current) return
      try {
        const parsed = JSON.parse(event.data)
        setLastMessage(parsed)
      } catch {
        // Ignore malformed frames rather than crashing the app.
      }
    }

    socket.onclose = () => {
      if (!mountedRef.current) return
      clearTimers()
      setStatus('reconnecting')

      const delay =
        RECONNECT_DELAYS[Math.min(reconnectAttemptRef.current, RECONNECT_DELAYS.length - 1)]
      reconnectAttemptRef.current += 1

      reconnectTimeoutRef.current = setTimeout(connect, delay)
    }

    socket.onerror = () => {
      // onclose fires right after — reconnect logic lives there to avoid
      // scheduling two reconnect attempts for a single failure.
      socket.close()
    }
  }, [url, clearTimers])

  useEffect(() => {
    mountedRef.current = true
    setStatus('connecting')
    connect()

    return () => {
      mountedRef.current = false
      clearTimers()
      socketRef.current?.close()
    }
  }, [connect, clearTimers])

  const sendMessage = useCallback((data) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(typeof data === 'string' ? data : JSON.stringify(data))
    }
  }, [])

  return { status, lastMessage, sendMessage }
}