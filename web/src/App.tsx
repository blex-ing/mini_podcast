import { useEffect, useState, type FormEvent } from 'react'
import RoadmapPage from './RoadmapPage'
import { AudioLines, ArrowRight, BookOpen, Headphones, Link2, Mic2, Plus, Sparkles, WandSparkles } from 'lucide-react'
import { validateArticleUrl, type Episode } from './domain/episode'
import { hasSupabase, supabase } from './lib/supabase'
import { createDraft, listEpisodes } from './services/episodes'

const process = [
  { icon: Link2, title: 'Elige tu artículo', detail: 'Guarda una URL de cualquier lectura interesante.', active: true },
  { icon: WandSparkles, title: 'Crea un guion', detail: 'Próximamente: resumen narrativo con IA.', active: false },
  { icon: Headphones, title: 'Escucha tu podcast', detail: 'Próximamente: audio con voz natural.', active: false },
]
const errMsg = (e: unknown) => e instanceof Error ? e.message : 'Ha ocurrido un error.'
export default function App() {
  const [page,setPage] = useState(() => window.location.hash === '#roadmap' ? 'roadmap' : 'studio')
  useEffect(() => { const updatePage = () => setPage(window.location.hash === '#roadmap' ? 'roadmap' : 'studio'); window.addEventListener('hashchange',updatePage); return () => window.removeEventListener('hashchange',updatePage) }, [])
  const [url,setUrl] = useState('')
  const [title,setTitle] = useState('')
  const [user,setUser] = useState<string|null>(null)
  const [episodes,setEpisodes] = useState<Episode[]>([])
  const [email,setEmail] = useState('')
  const [showLogin,setShowLogin] = useState(false)
  const [loading,setLoading] = useState(false)
  const [notice,setNotice] = useState('')
  useEffect(()=>{
    if (!supabase) return
    const client=supabase
    let mounted=true
    client.auth.getUser().then(({data})=>{if(mounted)setUser(data.user?.id??null)})
    const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>setUser(session?.user.id??null))
    return ()=>{mounted=false;subscription.unsubscribe()}
  },[])
  useEffect(()=>{
    if(!user){setEpisodes([]);return}
    let mounted=true
    listEpisodes().then(items=>{if(mounted)setEpisodes(items)}).catch(e=>{if(mounted)setNotice(errMsg(e))})
    return ()=>{mounted=false}
  },[user])
  async function save(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setNotice('')
    let source:string
    try{source=validateArticleUrl(url)}catch(e){setNotice(errMsg(e));return}
    if(!hasSupabase){setNotice('URL validada. Esta vista previa no almacena datos; conecta Supabase si deseas guardar borradores.');return}
    if(!user){setShowLogin(true);setNotice('Inicia sesión para guardar el artículo.');return}
    setLoading(true)
    try{const episode=await createDraft(source,title,user);setEpisodes(x=>[episode,...x]);setUrl('');setTitle('');setNotice('Borrador guardado. La generación de audio llegará más adelante.')}
    catch(e){setNotice(errMsg(e))}finally{setLoading(false)}
  }
  async function login(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(!supabase)return
    setLoading(true)
    const {error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:window.location.origin}})
    setNotice(error?error.message:'Revisa tu correo para acceder.')
    if(!error)setShowLogin(false)
    setLoading(false)
  }
  return <div className="site">
    <header className="nav wrap"><a className="brand" href="#inicio"><span className="brand-icon"><AudioLines size={22}/></span>mini<strong>podcast</strong><span className="accent">.</span></a><nav><a href="#estudio">Estudio</a><a href="#biblioteca">Biblioteca</a><a href="#proceso">Cómo funciona</a><a href="#roadmap">Roadmap</a></nav><a className="nav-cta" href="#estudio">Crear episodio <ArrowRight size={15}/></a></header>
    {page === 'roadmap' ? <RoadmapPage/> : <main id="inicio">
      <section className="hero wrap">
        <div className="hero-copy"><p className="eyebrow"><span className="online"/> TU ESTUDIO DE AUDIO CON IA <span className="dim">/ BETA</span></p><h1>Las buenas ideas <span>merecen</span> <em>ser escuchadas.</em></h1><p className="intro">Convierte los artículos que te inspiran en historias para escuchar. Un espacio sencillo donde las palabras encuentran su voz.</p><div className="hero-actions"><a className="primary" href="#estudio"><Plus size={19}/> Empezar un proyecto <ArrowRight size={16}/></a><a className="link" href="#proceso">Descubre cómo funciona <ArrowRight size={15}/></a></div><p className="status"><span className="online"/> Guardado de borradores opcional · Audio próximamente</p></div>
        <div className="hero-visual" aria-label="Ilustración de audio"><div className="halo"><div className="mic"><Mic2 size={69} strokeWidth={1.1}/></div></div><span className="floating floating-top"><Sparkles size={15}/> IDEAS QUE COBRAN VIDA</span><span className="floating floating-bottom">● TU HISTORIA COMIENZA AQUÍ</span><div className="wave">{Array.from({length:23},(_,i)=><i key={i} style={{height:12+Math.abs(Math.sin(i*1.38))*48}}/>)}</div></div>
      </section>
      <section id="estudio" className="studio wrap"><p className="eyebrow">— EL ESTUDIO</p><div className="section-head"><div><h2>Tu próxima historia <span>empieza aquí.</span></h2><p>Guarda un artículo y prepáralo para tu próximo podcast.</p></div><small>STUDIO / 0.2</small></div>
        <div className="two-cols"><div className="panel editor ui-glass-primary"><div className="panel-head"><span className="tile"><Link2 size={22}/></span><div><h3>Nuevo proyecto</h3><p>Empieza con una URL</p></div><small>01 / 03</small></div><form onSubmit={save}><label htmlFor="url">ENLACE DEL ARTÍCULO</label><input id="url" required type="url" placeholder="https://ejemplo.com/tu-articulo" value={url} onChange={e=>setUrl(e.target.value)}/><label htmlFor="title">TÍTULO DEL EPISODIO <span>(OPCIONAL)</span></label><input id="title" placeholder="Mi nuevo episodio" maxLength={150} value={title} onChange={e=>setTitle(e.target.value)}/><button className="primary submit" disabled={loading}><Plus size={17}/>{loading?'Guardando...':'Guardar borrador'}<ArrowRight size={16}/></button></form><p className="hint">{hasSupabase?'Los borradores son privados en tu cuenta.':'Vista previa: no se almacenan datos todavía.'}</p>{notice&&<p className="notice" role="status">{notice}</p>}</div>
        <div className="panel process ui-glass-primary" id="proceso"><div className="process-head">DE LA LECTURA AL AUDIO <span>EL PROCESO</span></div>{process.map(({icon:Icon,title:stepTitle,detail,active},index)=><div className="process-item" key={stepTitle}><div className={active?'process-icon active':'process-icon'}><Icon size={21}/></div><div><div className="process-name"><h3>{stepTitle}</h3><small>0{index+1}</small></div><p>{detail}</p></div></div>)}<p className="process-note"><Sparkles size={17}/> Estamos construyendo el estudio. La generación de audio aún no está disponible.</p></div></div>
      </section>
      <section className="library wrap" id="biblioteca"><p className="eyebrow">— TU ESPACIO</p><div className="section-head"><div><h2>Tu biblioteca<span>.</span></h2><p>Un lugar para las historias que quieres contar.</p></div><small>{episodes.length || 'DEMO'} EPISODIOS</small></div><div className="cards">{episodes.length?episodes.map(ep=><article className="episode" key={ep.id}><div className="cover"><BookOpen size={32}/><span>MINI / PODCAST</span></div><div className="episode-body"><small>BORRADOR</small><h3>{ep.title}</h3><a href={ep.source_url} target="_blank" rel="noopener noreferrer">Ver artículo <ArrowRight size={14}/></a></div></article>):<><article className="episode"><div className="cover cover-rose"><BookOpen size={34}/><span>MINI / PODCAST</span></div><div className="episode-body"><small>EJEMPLO VISUAL</small><h3>Historias que vale la pena contar</h3><p>Audio no disponible todavía</p></div></article><article className="episode"><div className="cover cover-blue"><Headphones size={34}/><span>MINI / PODCAST</span></div><div className="episode-body"><small>EJEMPLO VISUAL</small><h3>Una nueva forma de aprender</h3><p>Audio no disponible todavía</p></div></article><a href="#estudio" className="episode add-episode"><span>＋</span><strong>Tu próxima historia</strong><small>Crea tu primer borrador</small><ArrowRight size={19}/></a></>}</div></section>
      <section className="closing wrap"><div><p className="eyebrow">HECHO PARA CREAR</p><h2>Una idea. Una voz. <em>Infinitas historias.</em></h2></div><a className="primary" href="#estudio">Empezar ahora <ArrowRight size={16}/></a></section>
    </main>}<footer className="footer wrap"><span className="brand"><AudioLines size={21}/> mini<strong>podcast</strong>.</span><p>De las palabras al sonido, paso a paso.</p><p>© 2026 · Beta</p></footer>
    {showLogin&&<div className="modal-screen"><section className="modal" role="dialog" aria-modal="true" aria-label="Iniciar sesión"><button className="modal-close" onClick={()=>setShowLogin(false)}>×</button><h2>Accede a tu estudio</h2><p>Recibe un enlace de acceso seguro en tu correo.</p><form onSubmit={login}><label htmlFor="email">CORREO</label><input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/><button className="primary submit" disabled={loading}>Enviar enlace <ArrowRight size={16}/></button></form></section></div>}
  </div>
}
