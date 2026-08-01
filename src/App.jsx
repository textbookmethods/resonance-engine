import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// 1. We officially import all 4 of your components here
import PlayerHUD from './components/PlayerHUD';
import GridBoard from './components/GridBoard';
import GMDashboard from './components/GMDashboard';
import Reference from './components/Reference';

// REPLACE THESE WITH YOUR ACTUAL FIREBASE KEYS
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID"
};

// Initialize Firebase only once
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";
if (isFirebaseConfigured && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const DEFAULT_STATE = {
    player: { name: '', title: '', weaponBase: 3, dpFront: 0, dpSupport: 0, dpBack: 0, resPool: 3, customCards: [] },
    encounter: { round: 1, enemies: [], playerPoolTotal: 10, enemyPoolTotal: 10 },
    grid: Array(150).fill({ type: 'empty', terrain: null }),
    tokens: []
};

export default function App() {
    const [activeTab, setActiveTab] = useState('player');
    const [sessionId, setSessionId] = useState('PLAYTEST-1');
    const [gameState, setGameState] = useState(DEFAULT_STATE);
    const [dbStatus, setDbStatus] = useState(isFirebaseConfigured ? 'Connecting...' : 'Local Only (Waiting for Firebase Keys)');

    // Firebase Sync Effect
    useEffect(() => {
        if (!isFirebaseConfigured) return;
        
        const roomRef = firebase.database().ref('sessions/' + sessionId);
        roomRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Force numerical parsing for DP to ensure dynamic class math always works
                if (data.player) {
                    data.player.dpFront = parseInt(data.player.dpFront) || 0;
                    data.player.dpSupport = parseInt(data.player.dpSupport) || 0;
                    data.player.dpBack = parseInt(data.player.dpBack) || 0;
                }
                setGameState(data);
            } else {
                roomRef.set(DEFAULT_STATE);
            }
            setDbStatus('Connected to ' + sessionId);
        });

        return () => roomRef.off();
    }, [sessionId]);

    // Unified state updater
    const pushUpdate = (updater) => {
        setGameState(prev => {
            const next = updater(prev);
            if (isFirebaseConfigured) {
                firebase.database().ref('sessions/' + sessionId).set(next);
            }
            return next;
        });
    };

    // 2. We add the GM and Database tabs to the navigation array
    const tabs = [
        { id: 'player', label: 'Combat HUD' },
        { id: 'gm', label: 'GM Dashboard' },
        { id: 'grid', label: 'Tabula Rasa' },
        { id: 'ref', label: 'Database' }
    ];

    return (
        <div className="min-h-screen bg-[#0b0f14] text-slate-200 p-4 font-sans">
            <header className="flex flex-col md:flex-row justify-between items-end mb-6 border-b-2 border-[#ff6600] pb-2">
                <div>
                    <h1 className="text-3xl font-bold text-white">RESONANCE <span className="text-[#ff6600] font-light">ENGINE</span></h1>
                    <div className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest">{dbStatus}</div>
                </div>
                <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono text-xs font-bold">SESSION ID:</span>
                        <input 
                            type="text" 
                            className="bg-black border border-[#ff6600] text-white px-2 py-1 font-mono text-sm uppercase font-bold outline-none"
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                        />
                    </div>
                    <nav className="flex gap-1 font-mono text-sm uppercase">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                className={`px-4 py-2 transition-colors border-t border-l border-r ${activeTab === tab.id ? 'bg-[#ff6600] text-black border-[#ff6600] font-bold' : 'bg-[#1a222c] text-gray-400 border-gray-700 hover:text-white'}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* 3. We tell the engine how to render all 4 components */}
                {activeTab === 'player' && <PlayerHUD player={gameState.player} pushUpdate={pushUpdate} />}
                {activeTab === 'gm' && <GMDashboard encounter={gameState.encounter} pushUpdate={pushUpdate} />}
                {activeTab === 'grid' && <GridBoard grid={gameState.grid} tokens={gameState.tokens} pushUpdate={pushUpdate} />}
                {activeTab === 'ref' && <Reference />}
            </main>
        </div>
    );
}