import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import PlayerHUD from './components/PlayerHUD';
import GridBoard from './components/GridBoard';
// import GMDashboard from './components/GMDashboard';
// import Reference from './components/Reference';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com',
  projectId: 'YOUR_PROJECT_ID',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const DEFAULT_STATE = {
  player: {
    name: '',
    title: '',
    weaponBase: 3,
    dpFront: 0,
    dpSupport: 0,
    dpBack: 0,
    resPool: 3,
    customCards: [],
  },
  encounter: { round: 1, enemies: [], playerPoolTotal: 10, enemyPoolTotal: 10 },
  grid: Array(150).fill({ type: 'empty', terrain: null }), // 15x10 Hex Grid
  tokens: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState('player');
  const [sessionId, setSessionId] = useState('PLAYTEST-1');
  const [gameState, setGameState] = useState(DEFAULT_STATE);
  const [dbStatus, setDbStatus] = useState('Connecting...');

  useEffect(() => {
    const roomRef = firebase.database().ref('sessions/' + sessionId);
    roomRef.on('value', (snapshot) => {
      if (snapshot.val()) setGameState(snapshot.val());
      else roomRef.set(DEFAULT_STATE);
      setDbStatus('Connected to ' + sessionId);
    });
    return () => roomRef.off();
  }, [sessionId]);

  const pushUpdate = (updater) => {
    setGameState((prev) => {
      const next = updater(prev);
      firebase
        .database()
        .ref('sessions/' + sessionId)
        .set(next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-200 p-4 font-sans">
      <header className="flex justify-between items-end mb-6 border-b-2 border-[#ff6600] pb-2">
        <div>
          <h1 className="text-3xl font-bold text-white">
            RESONANCE <span className="text-[#ff6600] font-light">ENGINE</span>
          </h1>
          <div className="text-[#00f0ff] font-mono text-xs">
            Vite Component Build // {dbStatus}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono text-xs">SESSION:</span>
            <input
              type="text"
              className="bg-black border border-[#ff6600] text-white px-2 py-1 font-mono text-sm outline-none uppercase"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value.toUpperCase())}
            />
          </div>
          <nav className="flex gap-1 font-mono text-sm uppercase">
            {['player', 'grid'].map(
              (
                tab // Add 'gm', 'ref' back when built
              ) => (
                <button
                  key={tab}
                  className={`px-4 py-2 border-t border-l border-r ${
                    activeTab === tab
                      ? 'bg-[#ff6600] text-black'
                      : 'bg-[#1a222c] text-gray-400 border-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              )
            )}
          </nav>
        </div>
      </header>

      <main>
        {activeTab === 'player' && (
          <PlayerHUD player={gameState.player} pushUpdate={pushUpdate} />
        )}
        {activeTab === 'grid' && (
          <GridBoard
            grid={gameState.grid}
            tokens={gameState.tokens}
            pushUpdate={pushUpdate}
          />
        )}
      </main>
    </div>
  );
}
