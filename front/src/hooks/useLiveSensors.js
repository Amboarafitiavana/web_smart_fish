import { useEffect, useState } from 'react'
import { getAllSnapshots } from '../utils/mockData'

// Simulates a live sensor feed by reseeding mock snapshots on an interval.
// Swap the interval body for a WebSocket/polling call to sensorService later.
export function useLiveSensors(pondSeed = 1, intervalMs = 8000) {
  const [snapshots, setSnapshots] = useState(() => getAllSnapshots(pondSeed))
  const [lastSync, setLastSync] = useState(new Date())

  useEffect(() => {
    setSnapshots(getAllSnapshots(pondSeed))
  }, [pondSeed])

  useEffect(() => {
    const id = setInterval(() => {
      setSnapshots(getAllSnapshots(pondSeed + Math.floor(Math.random() * 1000)))
      setLastSync(new Date())
    }, intervalMs)
    return () => clearInterval(id)
  }, [pondSeed, intervalMs])

  return { snapshots, lastSync }
}
