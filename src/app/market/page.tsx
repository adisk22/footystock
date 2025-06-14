'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Player = {
  id: string
  name: string
  team: string
  position: string
  league: string
  current_price: number
  image_url?: string
}

export default function MarketPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlayers() {
      const { data, error } = await supabase.from('players').select('*')
      if (error) console.error('Error fetching players:', error)
      else setPlayers(data)
      setLoading(false)
    }

    fetchPlayers()
  }, [])

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <p className="text-green-400 p-6">Loading players...</p>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-4">📈 Player Market</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search players..."
          className="w-full sm:w-1/2 p-2 rounded-lg text-black placeholder-gray-500 outline-none border border-green-400 focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredPlayers.length === 0 ? (
        <p className="text-gray-400">No players found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map(player => (
            <div
              key={player.id}
              className="bg-zinc-900 hover:bg-zinc-800 transition p-4 rounded-2xl shadow-lg"
            >
              {player.image_url && (
                <img
                  src={player.image_url}
                  alt={player.name}
                  className="h-32 w-full object-contain mb-4"
                />
              )}
              <h2 className="text-xl font-semibold text-green-300 mb-1">{player.name}</h2>
              <p className="text-sm text-gray-300 mb-1">
                {player.team} — <span className="uppercase">{player.position}</span>
              </p>
              <p className="text-green-400 font-bold mt-3 text-lg">
                ${player.current_price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
