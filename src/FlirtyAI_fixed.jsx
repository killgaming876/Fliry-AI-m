import { useState, useCallback } from "react";

const API_ROUTE = "/api/ai";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Syne:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body,#root{background:#080809;min-height:100vh;font-family:'Syne',sans-serif;color:#e8e0f0;overflow-x:hidden}
    :root{
      --p:#FF007F;--pd:#cc0066;--pg:rgba(255,0,127,.35);--pf:rgba(255,0,127,.08);
      --bd:rgba(255,0,127,.22);--gl:rgba(14,14,16,.78);
      --tx:#e8e0f0;--mt:rgba(232,224,240,.45);--r:18px;
    }
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:#080809}
    ::-webkit-scrollbar-thumb{background:var(--p);border-radius:99px}

    @keyframes float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-13px) rotate(1deg)}}
    @keyframes pulseGlow{0%,100%{box-shadow:0 0 18px var(--pg),0 0 40px var(--pg)}50%{box-shadow:0 0 36px var(--pg),0 0 90px rgba(255,0,127,.45)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideR{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:translateX(0)}}
    @keyframes progFill{from{width:0%}}
    @keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}
    @keyframes neonFlick{0%,18%,20%,22%,54%,56%,100%{text-shadow:0 0 10px var(--p),0 0 30px var(--p),0 0 60px var(--p);opacity:1}19%,21%,55%{text-shadow:none;opacity:.7}}
    @keyframes typingDot{0%,80%,100%{transform:scale(0);opacity:.3}40%{transform:scale(1);opacity:1}}
    @keyframes cardIn{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.25)}28%{transform:scale(1)}}

    .fu{animation:fadeUp .5s cubic-bezier(.4,0,.2,1) both}
    .fi{animation:fadeIn .35s ease both}

    .btn{font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:1.8px;
      text-transform:uppercase;padding:13px 26px;border-radius:9px;cursor:pointer;
      position:relative;overflow:hidden;transition:all .25s cubic-bezier(.4,0,.2,1)}
    .btn:disabled{opacity:.38;cursor:not-allowed}
    .btn:active:not(:disabled){transform:scale(.96)}
    .btn span{position:relative;z-index:1}
    .btn-o{background:transparent;border:1.5px solid var(--p);color:var(--p);
      box-shadow:0 0 12px rgba(255,0,127,.18),inset 0 0 12px rgba(255,0,127,.04)}
    .btn-o::before{content:'';position:absolute;inset:0;background:var(--p);
      transform:scaleX(0);transform-origin:left;transition:transform .28s cubic-bezier(.4,0,.2,1);z-index:0}
    .btn-o:not(:disabled):hover::before{transform:scaleX(1)}
    .btn-o:not(:disabled):hover{color:#fff;box-shadow:0 0 28px var(--pg)}
    .btn-s{background:var(--p);border:none;color:#fff;
      box-shadow:0 0 20px var(--pg),0 4px 22px rgba(255,0,127,.4)}
    .btn-s::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,.15);
      transform:scaleX(0);transform-origin:left;transition:transform .28s cubic-bezier(.4,0,.2,1);z-index:0}
    .btn-s:not(:disabled):hover::before{transform:scaleX(1)}
    .btn-s:not(:disabled):hover{box-shadow:0 0 38px var(--pg),0 6px 32px rgba(255,0,127,.5)}

    .card{background:var(--gl);backdrop-filter:blur(22px) saturate(1.9);
      -webkit-backdrop-filter:blur(22px) saturate(1.9);
      border:1px solid var(--bd);border-radius:var(--r);position:relative}

    .ltab{padding:8px 16px;border-radius:8px;
      font-family:'Orbitron',monospace;font-size:9px;font-weight:700;
      letter-spacing:1.8px;text-transform:uppercase;cursor:pointer;
      transition:all .2s ease;border:1px solid transparent}
    .ltab.on{background:var(--p);color:#fff;box-shadow:0 0 14px var(--pg)}
    .ltab.off{color:var(--mt);border-color:var(--bd)}
    .ltab.off:hover{border-color:var(--p);color:var(--p)}

    .prog-track{height:5px;background:rgba(255,0,127,.1);border-radius:99px;overflow:hidden}
    .prog-fill{height:100%;border-radius:99px;
      background:linear-gradient(90deg,#660033,var(--p));
      box-shadow:0 0 12px var(--pg);
      animation:progFill 1.3s cubic-bezier(.4,0,.2,1) both;animation-delay:.3s}

    textarea.ci{
      width:100%;min-height:190px;resize:vertical;
      background:rgba(255,0,127,.04);border:1.5px solid var(--bd);border-radius:12px;
      color:var(--tx);font-family:'Space Mono',monospace;font-size:12px;line-height:1.75;
      padding:16px;outline:none;
      transition:border-color .25s ease,box-shadow .25s ease;
    }
    textarea.ci::placeholder{color:rgba(232,224,240,.22);font-style:italic}
    textarea.ci:focus{border-color:var(--p);box-shadow:0 0 24px var(--pg),inset 0 0 16px rgba(255,0,127,.04)}

    /* chat bubble styles */
    .bubble-wrap{display:flex;flex-direction:column;gap:8px}
    .bubble{
      padding:10px 15px;border-radius:16px;
      font-family:'Syne',sans-serif;font-size:14px;line-height:1.55;
      max-width:82%;word-break:break-word;
      animation:cardIn .35s cubic-bezier(.4,0,.2,1) both;
    }
    .bubble.you{
      align-self:flex-end;
      background:linear-gradient(135deg,rgba(255,0,127,.22),rgba(204,0,102,.18));
      border:1px solid rgba(255,0,127,.3);
      border-bottom-right-radius:5px;
      color:var(--tx);
    }
    .bubble.her{
      align-self:flex-start;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.08);
      border-bottom-left-radius:5px;
      color:rgba(232,224,240,.85);
    }
    .bubble.flirt{
      align-self:flex-end;
      background:linear-gradient(135deg,var(--p),var(--pd));
      border:none;
      border-bottom-right-radius:5px;
      color:#fff;
      box-shadow:0 4px 24px rgba(255,0,127,.45),0 0 40px rgba(255,0,127,.2);
      font-weight:600;font-size:14.5px;
      animation:cardIn .4s cubic-bezier(.4,0,.2,1) both, pulseGlow 3s ease-in-out .5s infinite;
    }
    .sender-label{
      font-family:'Orbitron',monospace;font-size:8px;letter-spacing:1.5px;
      color:var(--mt);margin-bottom:2px;
    }
    .you-wrap{align-self:flex-end;display:flex;flex-direction:column;align-items:flex-end}
    .her-wrap{align-self:flex-start;display:flex;flex-direction:column;align-items:flex-start}
  `}</style>
);

const Bg = () => (
  <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,
      backgroundImage:`linear-gradient(rgba(255,0,127,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,127,.04) 1px,transparent 1px)`,
      backgroundSize:'60px 60px',
      maskImage:'radial-gradient(ellipse 80% 60% at 50% 50%,black 20%,transparent 100%)'}}/>
    <div style={{position:'absolute',top:'-8%',left:'-4%',width:500,height:500,borderRadius:'50%',
      background:'radial-gradient(circle,rgba(255,0,127,.14) 0%,transparent 70%)',filter:'blur(70px)'}}/>
    <div style={{position:'absolute',bottom:'-8%',right:'-4%',width:400,height:400,borderRadius:'50%',
      background:'radial-gradient(circle,rgba(255,0,127,.08) 0%,transparent 70%)',filter:'blur(90px)'}}/>
  </div>
);

const Thinking = () => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'6px 0'}}>
    <div style={{display:'flex',gap:5}}>
      {[0,1,2].map(i=>(
        <div key={i} style={{width:7,height:7,borderRadius:'50%',background:'var(--p)',
          animation:`typingDot 1.2s ease-in-out ${i*0.2}s infinite`}}/>
      ))}
    </div>
    <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:'var(--mt)',fontStyle:'italic'}}>
      cooking up the rizz...
    </span>
  </div>
);

const ConfBar = ({ score }) => {
  const pct = Math.min(100, Math.max(0, score ?? 85));
  const tag = pct>=92?'🔥 UNREAL RIZZ':pct>=80?'💅 CERTIFIED SMOOTH':pct>=65?'😏 SOLID PLAY':'👀 DECENT SHOT';
  const col = pct>=92?'#FF007F':pct>=80?'#ff4da6':pct>=65?'#ff80bf':'#aa3366';
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
        <span style={{fontFamily:"'Orbitron',monospace",fontSize:8,letterSpacing:1.5,color:'var(--mt)'}}>
          BLUSH PROBABILITY
        </span>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:col}}>{tag}</span>
          <span style={{fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:700,color:col}}>{pct}%</span>
        </div>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{width:`${pct}%`}}/>
      </div>
    </div>
  );
};

// parse chat into bubbles for preview
const parseBubbles = (text) => {
  const lines = text.trim().split('\n').filter(l => l.trim());
  return lines.map((line, i) => {
    const youMatch = line.match(/^(you|me|i)\s*[:：]/i);
    const herMatch = line.match(/^(her|him|they|she|he|crush|babe|them)\s*[:：]/i);
    if (youMatch) return { side: 'you', text: line.replace(/^[^:：]+[:：]\s*/, ''), key: i };
    if (herMatch) return { side: 'her', text: line.replace(/^[^:：]+[:：]\s*/, ''), key: i };
    return { side: i % 2 === 0 ? 'her' : 'you', text: line, key: i };
  });
};

export default function FlirtyAI() {
  const [chatText, setChatText]   = useState('');
  const [lang, setLang]           = useState('English');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [regenLoad, setRegenLoad] = useState(false);
  const [errMsg, setErrMsg]       = useState('');
  const [copied, setCopied]       = useState(false);
  const [showInput, setShowInput] = useState(true);

  const callLLM = useCallback(async (text, selectedLang) => {
    const system = `You are Fliry AI — the most charming, witty dating coach alive. Your replies make people blush, smile, and immediately want to reply back.

Your reply style — STRICTLY follow this:
- SHORT. Maximum 1–2 sentences. Never long paragraphs.
- Use the setup → pause → punchline format like these examples:
  • "Lowkey unfair" / "What is?" / "Being that cute and expecting me to stay calm"
  • "You've got a talent" / "Which one?" / "Turning my 'I'll reply later' into instant replies"
  • "You're trouble" / "How?" / "One text from you and suddenly everyone else gets ignored"
  • "I wasn't planning on flirting today" / "Oh really?" / "Then you showed up and ruined the plan"
- Be PLAYFUL, TEASING, CUTE — not cringe or desperate
- Sound like a confident person who's having fun, not trying too hard
- End with a cheeky closer: a 😏 😌 🙈 or nothing at all — never overdo emojis
- NO generic pickup lines. Read the chat, match the energy, make it personal.

Language rules:
- English: smooth, confident, playful urban English
- Hinglish: natural Roman-script Hindi mixed with English slang — yaar, tera, mera, bas, kya, chal, nahi, lagta, haan, seedha baat — like a real Gen-Z chat, short and charming

Return ONLY raw JSON, no markdown:
{"vibe":"<one word>","confidence_score":<60-99>,"generated_reply":"<short witty reply>","why":"<one line on why this works>"}`;

    const res = await fetch(API_ROUTE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  messages: [
    {
      role: "user",
      content: input
    }
  ]
}),
    });

    const data = await res.json().catch(() => ({}));
    setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    content: data.reply,
  },
]);

    if (!res.ok) {
      throw new Error(data?.error || 'Failed to generate response.');
    }

    const raw = typeof data?.raw === 'string' ? data.raw : JSON.stringify(data);
    const cleaned = raw.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error('Model returned invalid JSON.');
    }
  }, []);  const handleAnalyze = async () => {
    if (!chatText.trim()) return;
    setLoading(true); setErrMsg(''); setResult(null);
    try {
      const parsed = await callLLM(chatText, lang);
      setResult(parsed);
      setShowInput(false);
    } catch(e) { setErrMsg(e.message || 'Something went wrong.'); }
    setLoading(false);
  };

  const handleRegen = async () => {
    if (!chatText.trim()) return;
    setRegenLoad(true);
    try { const p = await callLLM(chatText, lang); setResult(p); } catch {}
    setRegenLoad(false);
  };

  const handleLang = async (l) => {
    setLang(l);
    if (result && chatText.trim()) {
      setRegenLoad(true);
      try { const p = await callLLM(chatText, l); setResult(p); } catch {}
      setRegenLoad(false);
    }
  };

  const reset = () => { setResult(null); setChatText(''); setErrMsg(''); setShowInput(true); };

  const copy = () => {
    navigator.clipboard.writeText(result?.generated_reply || '');
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  const bubbles = chatText.trim() ? parseBubbles(chatText) : [];
  const canSubmit = chatText.trim().length > 5 && !loading;

  return (
    <>
      <G/><Bg/>
      <div style={{position:'relative',zIndex:1,minHeight:'100vh',
        display:'flex',flexDirection:'column',alignItems:'center',
        padding:'40px 20px 60px'}}>

        {/* Header */}
        <header style={{textAlign:'center',marginBottom:36}}>
          <div style={{display:'inline-block',animation:'float 5s ease-in-out infinite',marginBottom:10}}>
            <div style={{fontFamily:"'Orbitron',monospace",
              fontSize:'clamp(38px,7vw,60px)',fontWeight:900,letterSpacing:'-1px',
              color:'var(--p)',lineHeight:1,animation:'neonFlick 9s linear infinite',
              textShadow:'0 0 10px var(--p),0 0 30px var(--p),0 0 65px rgba(255,0,127,.5)'}}>
              Fliry AI
            </div>
          </div>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:3.5,
            color:'var(--mt)',textTransform:'uppercase'}}>
            Paste the chat. Make them blush.
          </p>
          <div style={{height:1,maxWidth:160,margin:'14px auto 0',
            background:'linear-gradient(90deg,transparent,var(--p),transparent)'}}/>
        </header>

        <main style={{width:'100%',maxWidth:560}}>

          {/* ── INPUT PANEL ── */}
          {showInput && (
            <div className="fu">
              <div className="card" style={{padding:'22px 20px',marginBottom:14}}>

                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',
                  marginBottom:12,flexWrap:'wrap',gap:8}}>
                  <div>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:9,letterSpacing:2,
                      color:'var(--p)',marginBottom:3}}>PASTE YOUR CHAT</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:'var(--mt)'}}>
                      Format: You: ... / Her: ...
                    </div>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    {['English','Hinglish'].map(l=>(
                      <button key={l} className={`ltab ${lang===l?'on':'off'}`} onClick={()=>setLang(l)}>
                        {l==='English'?'🇺🇸 EN':'🇮🇳 HI'}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea className="ci"
                  placeholder={"You: You've got a talent\nHer: Which one?\nYou: Turning my 'I'll reply later' into instant replies"}
                  value={chatText}
                  onChange={e=>setChatText(e.target.value)}
                  onKeyDown={e=>{if(e.ctrlKey&&e.key==='Enter')handleAnalyze()}}
                />

                <div style={{display:'flex',justifyContent:'space-between',marginTop:7}}>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'rgba(232,224,240,.2)'}}>
                    ctrl+enter to generate
                  </span>
                  {chatText && <button onClick={()=>setChatText('')}
                    style={{background:'none',border:'none',cursor:'pointer',
                      fontFamily:"'Space Mono',monospace",fontSize:9,
                      color:'rgba(255,0,127,.4)',textDecoration:'underline dotted'}}>clear</button>}
                </div>

                {errMsg && (
                  <div className="fi" style={{marginTop:10,padding:'9px 13px',borderRadius:9,
                    background:'rgba(255,0,127,.08)',border:'1px solid rgba(255,0,127,.3)',
                    fontFamily:"'Space Mono',monospace",fontSize:11,color:'#ff80bf',lineHeight:1.6}}>
                    ⚠ {errMsg}
                  </div>
                )}

                <button className="btn btn-s" style={{width:'100%',marginTop:14,padding:'15px'}}
                  onClick={handleAnalyze} disabled={!canSubmit}>
                  {loading
                    ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:9}}>
                        <div style={{width:13,height:13,border:'2px solid rgba(255,255,255,.4)',
                          borderTopColor:'#fff',borderRadius:'50%',animation:'spin .65s linear infinite'}}/>
                        <span>Cooking the rizz...</span>
                      </span>
                    : <span>✨ Generate Reply</span>
                  }
                </button>
              </div>

              <div style={{textAlign:'center',display:'flex',gap:7,justifyContent:'center',flexWrap:'wrap'}}>
                {['WhatsApp','Instagram','Tinder','Hinge','Bumble','iMessage'].map(a=>(
                  <span key={a} style={{fontFamily:"'Space Mono',monospace",fontSize:9,
                    color:'var(--mt)',padding:'4px 11px',borderRadius:100,
                    border:'1px solid rgba(255,0,127,.14)'}}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT PANEL ── */}
          {result && !loading && (
            <div className="fu" style={{display:'flex',flexDirection:'column',gap:14}}>

              {/* Chat preview with reply bubble */}
              <div className="card" style={{padding:'18px 16px'}}>
                <div style={{fontFamily:"'Orbitron',monospace",fontSize:8,letterSpacing:2,
                  color:'var(--mt)',marginBottom:14}}>CHAT PREVIEW</div>
                <div className="bubble-wrap">
                  {bubbles.slice(-4).map((b,i)=>(
                    <div key={b.key} className={b.side==='you'?'you-wrap':'her-wrap'}
                      style={{animationDelay:`${i*0.07}s`}}>
                      <div className={`bubble ${b.side}`}>{b.text}</div>
                    </div>
                  ))}
                  {/* The Fliry AI reply */}
                  <div className="you-wrap" style={{marginTop:4}}>
                    <div style={{fontFamily:"'Orbitron',monospace",fontSize:7,letterSpacing:1.5,
                      color:'var(--p)',marginBottom:4,display:'flex',alignItems:'center',gap:5}}>
                      <div style={{position:'relative'}}>
                        <div style={{width:5,height:5,borderRadius:'50%',background:'var(--p)'}}/>
                        <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'var(--p)',
                          animation:'ping 1.6s ease-out infinite'}}/>
                      </div>
                      FLIRY AI REPLY
                    </div>
                    {regenLoad
                      ? <div className="bubble flirt" style={{minWidth:120}}><Thinking/></div>
                      : <div className="bubble flirt" key={result.generated_reply}>
                          {result.generated_reply}
                        </div>
                    }
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="card" style={{padding:'16px 18px',display:'flex',flexDirection:'column',gap:12}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
                  {/* vibe */}
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontFamily:"'Orbitron',monospace",fontSize:8,letterSpacing:1.5,color:'var(--mt)'}}>VIBE</span>
                    <div style={{display:'inline-flex',alignItems:'center',gap:6,
                      padding:'5px 12px',borderRadius:100,
                      background:'rgba(255,0,127,.12)',border:'1px solid rgba(255,0,127,.3)'}}>
                      <div style={{width:5,height:5,borderRadius:'50%',background:'var(--p)',boxShadow:'0 0 6px var(--p)'}}/>
                      <span style={{fontFamily:"'Orbitron',monospace",fontSize:10,fontWeight:700,color:'var(--p)'}}>
                        {result.vibe}
                      </span>
                    </div>
                  </div>
                  {/* lang toggle */}
                  <div style={{display:'flex',gap:6}}>
                    {['English','Hinglish'].map(l=>(
                      <button key={l} className={`ltab ${lang===l?'on':'off'}`} onClick={()=>handleLang(l)}>
                        {l==='English'?'🇺🇸 EN':'🇮🇳 HI'}
                      </button>
                    ))}
                  </div>
                </div>
                <ConfBar score={result.confidence_score}/>
                {/* Why it works */}
                {result.why && (
                  <div style={{padding:'9px 13px',borderRadius:9,
                    background:'rgba(255,0,127,.06)',border:'1px solid rgba(255,0,127,.15)'}}>
                    <span style={{fontFamily:"'Orbitron',monospace",fontSize:7,letterSpacing:1.5,
                      color:'var(--p)',marginRight:7}}>WHY IT WORKS</span>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,
                      color:'var(--mt)',fontStyle:'italic'}}>{result.why}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <button className="btn btn-s" style={{position:'relative'}} onClick={copy}>
                  {copied && (
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',
                      justifyContent:'center',background:'#22ff88',borderRadius:9,color:'#080809',
                      fontFamily:"'Orbitron',monospace",fontSize:10,fontWeight:700,letterSpacing:1.5,
                      animation:'fadeIn .15s ease',zIndex:2}}>
                      ✓ COPIED!
                    </div>
                  )}
                  <span>📋 Copy Reply</span>
                </button>
                <button className="btn btn-o" onClick={handleRegen} disabled={regenLoad}>
                  <span>⚡ Regenerate</span>
                </button>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <button className="btn btn-o" onClick={()=>{setShowInput(true);setResult(null)}}
                  style={{fontSize:9}}>
                  <span>✏️ Edit Chat</span>
                </button>
                <button className="btn btn-o" onClick={reset} style={{fontSize:9}}>
                  <span>← New Chat</span>
                </button>
              </div>
            </div>
          )}
        </main>

        <footer style={{marginTop:50,textAlign:'center'}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:9,
            color:'rgba(232,224,240,.16)',letterSpacing:2}}>
            FLIRY AI · CERTIFIED RIZZ TECHNOLOGY · MAKE THEM BLUSH
          </p>
        </footer>
      </div>
    </>
  );
}
