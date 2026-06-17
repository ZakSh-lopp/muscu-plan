import { useState } from 'react';

const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const PLATE_COLORS = {
  25: '#e53935',
  20: '#1565c0',
  15: '#fdd835',
  10: '#43a047',
  5:  '#ffffff',
  2.5: '#9e9e9e',
  1.25: '#ff7043',
};

function calcPlates(target, bar) {
  let remaining = Math.round(((target - bar) / 2) * 100) / 100;
  if (remaining <= 0) return [];
  const result = [];
  for (const plate of PLATES) {
    const count = Math.floor(Math.round(remaining / plate * 100) / 100);
    if (count > 0) {
      result.push({ kg: plate, count });
      remaining = Math.round((remaining - count * plate) * 100) / 100;
    }
  }
  return result;
}

function PlateBar({ plates }) {
  if (plates.length === 0) return null;

  const flatPlates = [];
  plates.forEach(p => {
    for (let i = 0; i < p.count; i++) flatPlates.push(p.kg);
  });

  const maxKg = Math.max(...flatPlates);
  const heightForKg = kg => 24 + (kg / 25) * 40;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, marginTop: 'var(--s4)' }}>
      <div style={{
        width: 60, height: 12, background: '#888',
        borderRadius: 4, marginRight: 2,
      }} />
      {flatPlates.map((kg, i) => {
        const h = heightForKg(kg);
        const bg = PLATE_COLORS[kg] || '#aaa';
        return (
          <div key={i} style={{
            width: 16,
            height: h,
            background: bg,
            border: '1.5px solid rgba(0,0,0,0.3)',
            borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 7, fontWeight: 700,
              color: bg === '#ffffff' ? '#333' : bg === '#fdd835' ? '#333' : 'white',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
            }}>
              {kg}
            </span>
          </div>
        );
      })}
      <div style={{
        width: 20, height: 12, background: '#888',
        borderRadius: 4, marginLeft: 2,
      }} />
      <div style={{
        width: 8, height: 36, background: '#888', borderRadius: 4,
      }} />
    </div>
  );
}

export default function PlateCalculator({ onClose }) {
  const [target, setTarget] = useState('');
  const [bar, setBar] = useState(20);

  const targetNum = parseFloat(target) || 0;
  const plates = targetNum >= bar ? calcPlates(targetNum, bar) : [];
  const actualTotal = bar + plates.reduce((acc, p) => acc + p.kg * p.count * 2, 0);
  const remainder = Math.round((targetNum - actualTotal) * 100) / 100;
  const impossible = targetNum > 0 && targetNum < bar;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div
        style={{
          width: '100%', maxHeight: '90vh',
          background: 'var(--surface)',
          borderRadius: 'var(--r3) var(--r3) 0 0',
          padding: 'var(--s5)',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto var(--s4)' }} />

        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 'var(--s4)' }}>
          &#9883; Calculateur de disques
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>
              Poids cible (kg)
            </label>
            <input
              type="number"
              value={target}
              onChange={e => setTarget(e.target.value)}
              placeholder="ex: 80"
              min="0"
              step="2.5"
              style={{ textAlign: 'center', fontWeight: 700, fontSize: 22 }}
              autoFocus
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>
              Barre (kg)
            </label>
            <select
              value={bar}
              onChange={e => setBar(Number(e.target.value))}
              style={{ textAlign: 'center', fontWeight: 700, fontSize: 16, padding: '8px' }}
            >
              <option value={20}>20 kg</option>
              <option value={15}>15 kg</option>
              <option value={10}>10 kg</option>
              <option value={0}>0 kg</option>
            </select>
          </div>
        </div>

        {/* Resultat */}
        {impossible && (
          <div style={{
            background: 'var(--danger)', color: 'white', borderRadius: 'var(--r1)',
            padding: 'var(--s3)', textAlign: 'center', fontSize: 13, fontWeight: 600,
          }}>
            Poids cible inferieur au poids de barre ({bar}kg)
          </div>
        )}

        {targetNum >= bar && targetNum > 0 && (
          <div>
            {/* Disques par cote */}
            <div style={{
              background: 'var(--surface-2)', borderRadius: 'var(--r2)',
              padding: 'var(--s4)', marginBottom: 'var(--s3)',
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 'var(--s3)', color: 'var(--text-secondary)' }}>
                Par cote :
              </div>
              {plates.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Barre seule ({bar}kg)</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s2)' }}>
                  {plates.map(p => (
                    <div key={p.kg} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: PLATE_COLORS[p.kg] || 'var(--border)',
                      borderRadius: 'var(--r4)',
                      padding: '6px 12px',
                      border: p.kg === 5 ? '1px solid var(--border)' : 'none',
                    }}>
                      <span style={{
                        fontWeight: 800, fontSize: 15,
                        color: (p.kg === 5 || p.kg === 15) ? '#333' : 'white',
                      }}>
                        {p.count > 1 ? `${p.count}x ` : ''}{p.kg}kg
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Representation visuelle */}
            <PlateBar plates={plates} />

            {/* Total + ecart */}
            <div style={{ display: 'flex', gap: 'var(--s2)', marginTop: 'var(--s4)' }}>
              <div style={{
                flex: 1, background: actualTotal === targetNum ? 'var(--success)' : 'var(--warning)',
                borderRadius: 'var(--r1)', padding: 'var(--s3)', textAlign: 'center',
              }}>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>{actualTotal}kg</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>Total reel</div>
              </div>
              {remainder !== 0 && (
                <div style={{
                  flex: 1, background: 'var(--surface-2)',
                  borderRadius: 'var(--r1)', padding: 'var(--s3)', textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--warning)' }}>
                    {remainder > 0 ? '+' : ''}{remainder}kg
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ecart</div>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 'var(--s4)',
            background: 'var(--surface-2)', color: 'var(--text-secondary)',
            fontWeight: 600, fontSize: 14, padding: 'var(--s4)',
            borderRadius: 'var(--r2)',
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
