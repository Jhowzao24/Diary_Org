import React, { useState } from 'react'
import { useTarefas } from '../useTarefas'

const DAYS = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const PRIORITY_STYLE = {
  alta:  { background: '#450a0a', color: '#fca5a5' },
  media: { background: '#431407', color: '#fdba74' },
  baixa: { background: '#052e16', color: '#86efac' },
}

function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export default function TaskPanel({ currentDate, onChangeDay, onToday }) {
  const [texto, setTexto] = useState('')
  const [prioridade, setPrioridade] = useState('media')
  const [filtro, setFiltro] = useState('todas')
  const { tarefas, loading, addTarefa, toggleTarefa, deleteTarefa } = useTarefas(currentDate)

  const now = new Date()
  const h = now.getHours()
  const greeting = h < 12 ? 'Bom dia! 🌅' : h < 18 ? 'Boa tarde! ☀️' : 'Boa noite! 🌙'

  const today = new Date(); today.setHours(0,0,0,0)
  const cur = new Date(currentDate); cur.setHours(0,0,0,0)
  const diff = Math.round((cur - today) / 86400000)
  const suffix = diff === 0 ? ' — Hoje' : diff === -1 ? ' — Ontem' : diff === 1 ? ' — Amanhã' : ''
  const dateLabel = `${DAYS[currentDate.getDay()]}, ${currentDate.getDate()} de ${MONTHS[currentDate.getMonth()]} de ${currentDate.getFullYear()}${suffix}`
  const navLabel = `${String(currentDate.getDate()).padStart(2,'0')}/${String(currentDate.getMonth()+1).padStart(2,'0')}/${currentDate.getFullYear()}`

  const done = tarefas.filter(t => t.concluida).length
  const total = tarefas.length
  const pct = total ? Math.round((done / total) * 100) : 0

  const filtered = tarefas.filter(t => {
    if (filtro === 'pendentes') return !t.concluida
    if (filtro === 'concluidas') return t.concluida
    if (filtro === 'alta') return t.prioridade === 'alta'
    return true
  })

  async function handleAdd() {
    if (!texto.trim()) return
    await addTarefa(texto.trim(), prioridade)
    setTexto('')
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>

      {/* Cabeçalho de data */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9' }}>{greeting}</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{dateLabel}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <NavBtn onClick={() => onChangeDay(-1)}>‹</NavBtn>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#cbd5e1', minWidth: 120, textAlign: 'center' }}>{navLabel}</span>
          <NavBtn onClick={() => onChangeDay(1)}>›</NavBtn>
          <NavBtn onClick={onToday} style={{ width: 'auto', padding: '0 12px', fontSize: 12 }}>Hoje</NavBtn>
        </div>
      </div>

      {/* Progresso */}
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{done} de {total} tarefas concluídas ({pct}%)</p>
      <div style={{ background: '#1e293b', borderRadius: 8, height: 8, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 8, transition: 'width .4s' }} />
      </div>

      {/* Adicionar tarefa */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nova tarefa..."
          maxLength={120}
          style={inputStyle}
        />
        <select value={prioridade} onChange={e => setPrioridade(e.target.value)} style={selectStyle}>
          <option value="baixa">🟢 Baixa</option>
          <option value="media">🟡 Média</option>
          <option value="alta">🔴 Alta</option>
        </select>
        <button onClick={handleAdd} style={addBtnStyle}>+ Adicionar</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['todas','pendentes','concluidas','alta'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={filterBtnStyle(filtro === f)}>
            {f === 'todas' ? 'Todas' : f === 'pendentes' ? 'Pendentes' : f === 'concluidas' ? 'Concluídas' : '🔴 Alta'}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading && <p style={{ color: '#475569', fontSize: 14 }}>Carregando...</p>}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#475569', padding: '40px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          Nenhuma tarefa aqui. Adicione uma acima!
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(t => (
          <div key={t.id} style={{ ...taskItemStyle, opacity: t.concluida ? 0.5 : 1, animation: 'slideIn .2s ease' }}>
            <div onClick={() => toggleTarefa(t.id, t.concluida)} style={checkStyle(t.concluida)}>
              {t.concluida && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: 14, color: '#cbd5e1', textDecoration: t.concluida ? 'line-through' : 'none' }}>
              {t.texto}
            </span>
            <span style={{ ...badgeStyle, ...PRIORITY_STYLE[t.prioridade] }}>
              {t.prioridade.charAt(0).toUpperCase() + t.prioridade.slice(1)}
            </span>
            <span style={{ fontSize: 11, color: '#475569' }}>
              {t.criada_em ? t.criada_em.slice(0,5) : ''}
            </span>
            <button onClick={() => deleteTarefa(t.id)} style={deleteBtnStyle}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const NavBtn = ({ children, onClick, style }) => (
  <button onClick={onClick} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16, ...style }}>
    {children}
  </button>
)

const inputStyle = { flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '10px 14px', color: '#f1f5f9', fontSize: 14, outline: 'none' }
const selectStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '10px', color: '#94a3b8', fontSize: 13, outline: 'none', cursor: 'pointer' }
const addBtnStyle = { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, padding: '10px 18px', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const filterBtnStyle = active => ({ background: active ? '#312e81' : '#1e293b', border: `1px solid ${active ? '#6366f1' : '#334155'}`, borderRadius: 8, padding: '6px 14px', color: active ? '#a5b4fc' : '#64748b', fontSize: 12, cursor: 'pointer' })
const taskItemStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }
const checkStyle = checked => ({ width: 20, height: 20, borderRadius: 6, border: checked ? 'none' : '2px solid #475569', background: checked ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 })
const badgeStyle = { fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }
const deleteBtnStyle = { background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 16, padding: '2px 6px', borderRadius: 6 }
