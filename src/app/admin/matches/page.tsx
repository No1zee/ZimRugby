"use client";

import { useState, useEffect } from "react";
import type { Match } from "@/lib/data-fetcher";
import { Save, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/matches.json');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMatches(data.filter((m: Match) => m.homeTeam?.name !== 'Date'));
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleScoreChange = (id: string, side: 'home' | 'away', val: number) => {
    setMatches(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          score: {
            home: side === 'home' ? val : (m.score?.home || 0),
            away: side === 'away' ? val : (m.score?.away || 0)
          }
        };
      }
      return m;
    }));
  };

  const handleStatusChange = (id: string, status: Match['status']) => {
    setMatches(prev => prev.map(m => {
      if (m.id === id) return { ...m, status };
      return m;
    }));
  };

  if (loading) return <div className="p-20 text-white">Loading fixtures...</div>;

  return (
    <div className="min-h-screen bg-rich-black p-8 md:p-20">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-white uppercase italic">Fixture Management</h1>
            <p className="text-white/60 text-sm">Update live scores and manage match statuses for the Match Centre.</p>
          </div>
          
          <button 
            disabled={syncing}
            className="flex items-center gap-2 bg-zru-gold text-rich-black px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync from Official Website
          </button>
        </header>

        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-[10px] font-black uppercase text-white/60 tracking-widest">Match Details</th>
                <th className="p-4 text-[10px] font-black uppercase text-white/60 tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-black uppercase text-white/60 tracking-widest">Score (H - A)</th>
                <th className="p-4 text-[10px] font-black uppercase text-white/60 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {matches.map((match) => (
                <tr key={match.id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">{match.homeTeam.name} vs {match.awayTeam.name}</span>
                      <span className="text-white/60 text-[10px] uppercase tracking-wider">{match.date} • {match.venue}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <select 
                      value={match.status}
                      title="Match Status"
                      onChange={(e) => handleStatusChange(match.id, e.target.value as Match['status'])}
                      className="bg-rich-black border border-white/10 text-white text-xs p-2 rounded focus:outline-none focus:border-zru-gold"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="finished">Finished</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        title="Home Score"
                        value={match.score?.home || 0}
                        onChange={(e) => handleScoreChange(match.id, 'home', parseInt(e.target.value))}
                        className="w-12 bg-white/5 border border-white/10 text-white text-center p-2 rounded text-xs"
                      />
                      <span className="text-white/50">-</span>
                      <input 
                        type="number"
                        title="Away Score"
                        value={match.score?.away || 0}
                        onChange={(e) => handleScoreChange(match.id, 'away', parseInt(e.target.value))}
                        className="w-12 bg-white/5 border border-white/10 text-white text-center p-2 rounded text-xs"
                      />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-white/60 hover:text-white p-2" title="Save Changes">
                      <Save className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {matches.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-white/10 mx-auto" />
              <p className="text-white/60 font-bold uppercase tracking-widest">No active fixtures found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
