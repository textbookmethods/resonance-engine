/* eslint-disable */
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

import PlayerHUD from './components/PlayerHUD';
import GridBoard from './components/GridBoard';
import GMDashboard from './components/GMDashboard';
import Rulebook from './components/Rulebook';
import Spellbook from './components/Spellbook';
import Reference from './components/Reference';

const firebaseConfig = {
  apiKey: "AIzaSyDFah77C7Jcp6dSbA1cgqNM39QAg_ik65k",
  authDomain: "resonance-playtest.firebaseapp.com",
  databaseURL: "https://resonance-playtest-default-rtdb.firebaseio.com",
  projectId: "resonance-playtest",
  storageBucket: "resonance-playtest.firebasestorage.app",
  messagingSenderId: "368094649772",
  appId: "1:368094649772:web:353df7af50267c34612e09",
  measurementId: "G-KXCPG9YYHC"
};

const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";
if (isFirebaseConfigured && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const safeArray = (arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr.filter(item => item !== null && item !== undefined);
    if (typeof arr === 'object') return Object.values(arr).filter(item => item !== null && item !== undefined);
    return [];
};

const DEFAULT_STATE = {
    players: {}, 
    encounter: { round: 0, enemies: [], playerPoolTotal: 10, enemyPoolTotal: 10, activeTurn: 'player' },
    grid: Array(150).fill({ type: 'empty', terrain: null, terrainElement: null }),
    tokens: [],
    activeAction: null,
    globalLog: null
};

export default function App() {
    const [role, setRole] = useState(null); 
    const [activeTab, setActiveTab] = useState('player');
    const [sessionIdInput, setSessionIdInput] = useState('');
    const [sessionId, setSessionId] = useState('');
    
    const [gameState, setGameState] = useState(DEFAULT_STATE);
    const [dbStatus, setDbStatus] = useState(isFirebaseConfigured ? 'Waiting to Connect...' : 'Local Only (Waiting for Firebase Keys)');
    
    const [dismissedLog, setDismissedLog] = useState(0);

    const [localId] = useState(() => {
        let id = localStorage.getItem('res_player_id');
        if (!id) { id = String(Date.now()) + '-' + Math.random().toString(36).substr(2, 9); localStorage.setItem('res_player_id', id); }
        return String(id);
    });

    useEffect(() => {
        if (!isFirebaseConfigured || !role || !sessionId) return;
        
        setDbStatus('Connecting...');
        const roomRef = firebase.database().ref('sessions/' + sessionId);
        
        const listener = roomRef.on('value', (snapshot) => {
            let data = snapshot.val();
            let needsUpdate = false;

            if (!data) {
                data = JSON.parse(JSON.stringify(DEFAULT_STATE));
                needsUpdate = true;
            }

            if (!data.players) { data.players = {}; needsUpdate = true; }

            if (role === 'player' && !data.players[localId]) {
                data.players[localId] = {
                    name: 'Agent', title: '', weaponId: 'w01', xp: 0, 
                    currentHp: 20, dpFront: 0, dpSupport: 0, dpBack: 0, 
                    resPool: 3, customCards: [], savedSkills: [], statuses: [], 
                    usedParry: false, usedIntercept: false, usedEvade: false, usedBasicAttack: false,
                    affinityRaw: '', affinity: 'Kinetic', affinityLocked: false
                };
                needsUpdate = true;
            }

            Object.keys(data.players).forEach(pid => {
                if (data.players[pid]) {
                    data.players[pid].customCards = safeArray(data.players[pid].customCards);
                    data.players[pid].savedSkills = safeArray(data.players[pid].savedSkills);
                    data.players[pid].statuses = safeArray(data.players[pid].statuses);
                    if (data.players[pid].resPool === undefined) data.players[pid].resPool = 3;
                }
            });
            
            if (data.encounter) {
                data.encounter.enemies = safeArray(data.encounter.enemies);
                data.encounter.enemies.forEach(e => { 
                    if (e) {
                        e.statuses = safeArray(e.statuses);
                        if (e.currentBarriers && typeof e.currentBarriers === 'object' && !Array.isArray(e.currentBarriers)) {
                            e.currentBarriers = Object.values(e.currentBarriers);
                        }
                    } 
                });
            }
            if (data.tokens) data.tokens = safeArray(data.tokens);

            if (needsUpdate) {
                roomRef.set(data);
            } else {
                setGameState(data);
            }
            
            setDbStatus('Connected to ' + sessionId);
        });

        return () => roomRef.off('value', listener);
    }, [sessionId, role, localId]);

    const pushUpdate = (updater) => {
        setGameState(prev => {
            const next = updater(prev);
            if (isFirebaseConfigured && sessionId) {
                firebase.database().ref('sessions/' + sessionId).set(next);
            }
            return next;
        });
    };

    const hardResetSession = () => {
        if (window.confirm("CRITICAL WARNING: This will permanently wipe ALL Agent character sheets, custom grimoires, and grid data for this Session ID. Players will need to refresh their browsers to generate new sheets. Proceed?")) {
            if (isFirebaseConfigured && sessionId) {
                firebase.database().ref('sessions/' + sessionId).set(DEFAULT_STATE);
                alert("Session Data Purged. Ready for new campaign.");
            }
        }
    };

    const joinSession = (selectedRole) => {
        const cleanId = sessionIdInput.trim().toUpperCase();
        if (!cleanId) return alert("Please enter a valid Session ID.");
        
        setSessionId(cleanId);
        setRole(selectedRole);
        setActiveTab(selectedRole === 'gm' ? 'gm' : 'player');
    };

    const leaveSession = () => {
        setRole(null);
        setDbStatus(isFirebaseConfigured ? 'Waiting to Connect...' : 'Local Only');
    };

    if (!role) {
        return (
            <div className="min-h-screen bg-[#05080a] text-slate-200 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a222c] via-[#05080a] to-[#05080a] z-0"></div>
                <div className="z-10 bg-black border border-[#00f0ff] p-8 md:p-12 shadow-[0_0_30px_rgba(0,240,255,0.15)] max-w-lg w-full">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2 tracking-tight">RESONANCE <span className="text-[#ff6600] font-light">ENGINE</span></h1>
                    <p className="text-gray-400 text-center font-mono text-xs uppercase tracking-widest mb-10">Tactical Operations Terminal</p>
                    <div className="space-y-6 font-mono">
                        <div>
                            <label className="text-[#00f0ff] text-xs font-bold uppercase tracking-widest block mb-2">Session Uplink ID</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 p-3 text-white text-center text-xl uppercase font-bold tracking-widest outline-none focus:border-[#ff6600] transition-colors" value={sessionIdInput} onChange={(e) => setSessionIdInput(e.target.value.toUpperCase())} placeholder="ENTER SESSION ID" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                            <button className="bg-[#00f0ff] text-black font-bold p-4 uppercase tracking-wider hover:bg-white transition-colors" onClick={() => joinSession('player')}>Connect as Agent</button>
                            <button className="bg-[#ff6600] text-black font-bold p-4 uppercase tracking-wider hover:bg-white transition-colors" onClick={() => joinSession('gm')}>Initialize GM</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const allTabs = [
        { id: 'player', label: 'Combat HUD', roles: ['player'] },
        { id: 'spellbook', label: 'Spellbook', roles: ['player'] }, 
        { id: 'gm', label: 'GM Dashboard', roles: ['gm'] },
        { id: 'grid', label: 'The Slate', roles: ['player', 'gm'] },
        { id: 'ref', label: 'Database', roles: ['player', 'gm'] },
        { id: 'rules', label: 'Rulebook', roles: ['player', 'gm'] } 
    ];

    const visibleTabs = allTabs.filter(t => t.roles.includes(role));

    return (
        <div className="min-h-screen bg-[#0b0f14] text-slate-200 p-4 font-sans relative">
            <header className="flex flex-col md:flex-row justify-between items-end mb-6 border-b-2 border-[#ff6600] pb-2">
                <div>
                    <h1 className="text-3xl font-bold text-white">RESONANCE <span className="text-[#ff6600] font-light">ENGINE</span></h1>
                    <div className="text-[#00f0ff] font-mono text-xs uppercase tracking-widest">{dbStatus} | ROLE: {role.toUpperCase()}</div>
                </div>
                <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-4">
                        <div className="text-gray-400 font-mono text-xs font-bold uppercase tracking-widest">
                            SESSION: <span className="text-white bg-gray-900 px-2 py-1 border border-gray-700 ml-1">{sessionId}</span>
                        </div>
                        <button className="text-[10px] text-red-500 font-mono uppercase font-bold border border-red-900 bg-red-950/30 px-2 py-1 hover:bg-red-500 hover:text-white transition-colors" onClick={leaveSession}>Disconnect</button>
                    </div>
                    <nav className="flex gap-1 font-mono text-sm uppercase overflow-x-auto max-w-[90vw] md:max-w-none pb-1 md:pb-0 scrollbar-hide">
                        {visibleTabs.map(tab => (
                            <button key={tab.id} className={`px-3 py-2 md:px-4 whitespace-nowrap transition-colors border-t border-l border-r ${activeTab === tab.id ? 'bg-[#ff6600] text-black border-[#ff6600] font-bold' : 'bg-[#1a222c] text-gray-400 border-gray-700 hover:text-white'}`} onClick={() => setActiveTab(tab.id)}>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {activeTab === 'player' && role === 'player' && <PlayerHUD players={gameState?.players || {}} localId={localId} encounter={gameState?.encounter || {}} tokens={gameState?.tokens || []} pushUpdate={pushUpdate} />}
                {activeTab === 'spellbook' && role === 'player' && <Spellbook players={gameState?.players || {}} localId={localId} pushUpdate={pushUpdate} />} 
                {activeTab === 'gm' && role === 'gm' && <GMDashboard encounter={gameState?.encounter || {}} tokens={gameState?.tokens || []} players={gameState?.players || {}} pushUpdate={pushUpdate} hardResetSession={hardResetSession} />}
                {activeTab === 'grid' && <GridBoard players={gameState?.players || {}} grid={gameState?.grid || []} tokens={gameState?.tokens || []} encounter={gameState?.encounter || {}} activeAction={gameState?.activeAction} pushUpdate={pushUpdate} role={role} localId={localId} />}
                {activeTab === 'ref' && <Reference />}
                {activeTab === 'rules' && <Rulebook />} 
            </main>

            {gameState.globalLog && gameState.globalLog.timestamp !== dismissedLog && (
                <div className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[#0b0f14] border border-[#ff6600] p-6 max-w-2xl w-full shadow-[0_0_40px_rgba(255,102,0,0.3)] font-mono flex flex-col max-h-[90vh]">
                        <div className="text-[#ff6600] font-bold text-xl mb-4 border-b border-gray-700 pb-2 uppercase tracking-widest flex items-center gap-2">
                            <span className="animate-pulse">⚠</span> System Broadcast
                        </div>
                        <div className="text-white whitespace-pre-wrap overflow-y-auto flex-1 mb-6 text-sm leading-relaxed p-2 bg-black border border-gray-800">
                            {gameState.globalLog.message}
                        </div>
                        <button className="w-full bg-[#ff6600] text-black font-bold p-3 uppercase tracking-widest hover:bg-white transition-colors" onClick={() => setDismissedLog(gameState.globalLog.timestamp)}>
                            Acknowledge
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}