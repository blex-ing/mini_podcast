import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, CheckCircle2, CircleDashed, GitPullRequest, Layers3, RefreshCw, ShieldCheck } from 'lucide-react'
import { baseStatus, percentage, refreshFromGithub, roadmap, type FeatureStatus } from './data/roadmap'

const statusText = (s: FeatureStatus) => s.integrated ? 'Completada' : s.state === 'in_progress' ? 'En desarrollo' : s.state === 'blocked' ? 'Bloqueada' : 'Pendiente'

export default function RoadmapPage() {
  const [statuses, setStatuses] = useState<Record<string, FeatureStatus>>(baseStatus)
  const [sync, setSync] = useState<'loading' | 'live' | 'unavailable'>('loading')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    refreshFromGithub(controller.signal).then(next => {
      if (!controller.signal.aborted) { setStatuses(next); setSync('live') }
    }).catch(() => { if (!controller.signal.aborted) setSync('unavailable') })
    return () => controller.abort()
  }, [refreshKey])
  const development = percentage(statuses, 'integrated')
  const production = percentage(statuses, 'released')
  const completed = roadmap.features.filter(f => statuses[f.id]?.integrated).length
  const active = roadmap.features.filter(f => statuses[f.id]?.state === 'in_progress').length
  const total = roadmap.features.length
  const milestones = useMemo(() => [...roadmap.milestones].sort((a,b) => a.order - b.order), [])
  return <main id="roadmap" className="roadmap-page wrap">
    <div className="roadmap-breadcrumb"><a href="#inicio"><ArrowLeft size={16}/> Volver al estudio</a><span>/</span><span>Plan de desarrollo</span></div>
    <div className="roadmap-hero"><div className="eyebrow">— VISIÓN Y EVOLUCIÓN DEL PRODUCTO</div><div className="roadmap-hero-grid"><div><h1>Construyendo el <em>futuro del audio.</em></h1><p>Una hoja de ruta transparente para transformar artículos, textos y conocimiento en podcasts. Un único motor, diferentes experiencias — incluida <strong>Un Capítulo con Jesús</strong>.</p></div><div className="roadmap-sync"><Layers3 size={23}/><span>ROADMAP v{roadmap.planVersion}</span><small>{sync==='loading'?'Consultando GitHub…':sync==='live'?'Sincronizado con GitHub':'Sin conexión a GitHub · Estado de referencia'}</small><button onClick={()=>{setSync('loading');setRefreshKey(x=>x+1)}} aria-label="Actualizar estados desde GitHub" title="Actualizar estados"><RefreshCw size={17}/></button></div></div></div>
    <div className="roadmap-stats">
      <div className="roadmap-stat roadmap-main-stat"><span>AVANCE DE DESARROLLO</span><strong>{development}%</strong><div className="roadmap-bar"><i style={{width:`${development}%`}}/></div><small>{100-development}% del alcance pendiente de integrar</small></div>
      <div className="roadmap-stat"><span>PUBLICADO EN MASTER</span><strong>{production}%</strong><div className="roadmap-bar secondary"><i style={{width:`${production}%`}}/></div><small>Disponible en la rama estable</small></div>
      <div className="roadmap-stat"><span>FEATURES COMPLETADAS</span><strong>{completed}<small> / {total}</small></strong><div className="roadmap-minirow"><CheckCircle2 size={16}/>{active} en desarrollo actualmente</div></div>
    </div>
    <div className="roadmap-explain"><ShieldCheck size={18}/><p><strong>¿Cómo se calcula?</strong> Cada feature tiene un peso fijo y solo suma al porcentaje cuando su PR está fusionado en <code>develop</code>. Se verifica por separado si llegó a <code>master</code>. Las features en curso no suman porcentajes ficticios.</p></div>
    <div className="roadmap-list-title"><div><div className="eyebrow">— NUESTROS HITOS</div><h2>El camino, <em>paso a paso.</em></h2><p>{total} funcionalidades distribuidas en {milestones.length} etapas.</p></div><div className="roadmap-filter" role="group" aria-label="Filtrar funcionalidades"><button className={filter==='all'?'selected':''} onClick={()=>setFilter('all')}>Todas</button><button className={filter==='pending'?'selected':''} onClick={()=>setFilter('pending')}>Pendientes</button><button className={filter==='completed'?'selected':''} onClick={()=>setFilter('completed')}>Completadas</button></div></div>
    <div className="milestone-stack">{milestones.map((milestone,index)=>{
      const all=roadmap.features.filter(f=>f.milestone===milestone.id)
      const visible=all.filter(f=>filter==='all'||(filter==='completed'?statuses[f.id]?.integrated:!statuses[f.id]?.integrated))
      const weight=all.reduce((sum,f)=>sum+f.weight,0)
      const done=all.reduce((sum,f)=>sum+(statuses[f.id]?.integrated?f.weight:0),0)
      if(!visible.length) return null
      return <section className="milestone" key={milestone.id}><div className="milestone-heading"><span className="milestone-index">{String(index+1).padStart(2,'0')}</span><div className="milestone-heading-text"><h3>{milestone.title}</h3><p>{milestone.description}</p></div><div className="milestone-total"><strong>{Math.round(100*done/weight)}%</strong><span>{all.filter(f=>statuses[f.id]?.integrated).length}/{all.length} features</span></div></div><div className="roadmap-bar milestone-bar"><i style={{width:`${100*done/weight}%`}}/></div>
      <div className="feature-list">{visible.map(feature=>{const status=statuses[feature.id];return <article className="feature-card" key={feature.id}><span className={status.integrated?'feature-symbol complete':'feature-symbol'}>{status.integrated?<CheckCircle2 size={20}/>:<CircleDashed size={20}/>}</span><div className="feature-info"><div className="feature-heading"><h4>{feature.title}</h4><span className={status.integrated?'feature-tag complete':status.state==='in_progress'?'feature-tag active':'feature-tag'}>{statusText(status)}</span>{status.released&&<span className="feature-tag production">En producción</span>}</div><p>{feature.description}</p><div className="feature-meta"><span>Peso {feature.weight}%</span><span>Prioridad {feature.priority==='high'?'alta':'media'}</span><code>{feature.branch}</code></div><details><summary>Criterios de aceptación</summary><ul>{feature.acceptance.map(item=><li key={item}>{item}</li>)}</ul></details></div><div className="feature-pr">{status.prUrl?<a href={status.prUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver PR de ${feature.title}`}><GitPullRequest size={18}/><span>PR #{status.pr}</span><ArrowUpRight size={14}/></a>:<span className="no-pr">Sin PR</span>}</div></article>})}</div></section>
    })}</div>
    <div className="roadmap-footer"><h2>El siguiente capítulo <em>lo construimos juntos.</em></h2><p>La hoja de ruta y la arquitectura están documentadas en el repositorio. Las funcionalidades se incorporarán siguiendo feature → develop → release → master.</p><a href="https://github.com/blex-ing/mini_podcast" target="_blank" rel="noopener noreferrer">Consultar el repositorio <ArrowUpRight size={16}/></a></div>
  </main>
}
