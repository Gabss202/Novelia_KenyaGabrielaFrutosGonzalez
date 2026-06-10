import { useState } from 'react';
import axios from 'axios';
import { HiMusicalNote, HiVideoCamera, HiPhoto, HiSparkles } from 'react-icons/hi2';
import API from '../config';

const Home = () => {
  const [vibeTexto, setVibeTexto] = useState('');
  const [cancion, setCancion] = useState({ nombre: '', artista: '' });
  const [videoUrl, setVideoUrl] = useState('');
  const [imagen, setImagen] = useState(null);
  const [modo, setModo] = useState('texto');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const headers = { Authorization: `Bearer ${token}` };

  const detectarVibe = async () => {
    setCargando(true);
    setResultado(null);
    try {
      let res;
      if (modo === 'texto') {
        res = await axios.post(`${API}/vibe/texto`, { texto: vibeTexto }, { headers });
      } else if (modo === 'cancion') {
        res = await axios.post(`${API}/vibe/cancion`, cancion, { headers });
      } else if (modo === 'video') {
        res = await axios.post(`${API}/vibe/video`, { url: videoUrl }, { headers });
      } else if (modo === 'imagen') {
        const formData = new FormData();
        formData.append('imagen', imagen);
        res = await axios.post(`${API}/vibe/imagen`, formData, { headers });
      }
      setResultado(res.data);
    } catch (e) {
      console.error(e);
    }
    setCargando(false);
  };

  const agregarBiblioteca = async (libro, estado) => {
    try {
      await axios.post(`${API}/biblioteca/agregar`, { libro, estado }, { headers });
      setMensajeGuardado(`"${libro.titulo}" agregado`);
      setLibroSeleccionado(null);
      setTimeout(() => setMensajeGuardado(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const modos = [
    { key: 'cancion', icon: <HiMusicalNote size={20} />, label: 'Canción' },
    { key: 'video', icon: <HiVideoCamera size={20} />, label: 'Video' },
    { key: 'imagen', icon: <HiPhoto size={20} />, label: 'Imagen' },
    { key: 'texto', icon: <HiSparkles size={20} />, label: 'Vibe' },
  ];

  const vibeEmoji = {
    melancolico: '🌧️', romantico: '🌹', misterioso: '🌙',
    cozy: '☕', aventurero: '🗺️', oscuro: '🖤', esperanzador: '🌟'
  };

  return (
    <div style={{ padding: '24px 16px 100px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Hola, {username} 👋</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>¿Qué vibes buscas hoy?</p>
      </div>

      {/* Selector de modo */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {modos.map(m => (
          <button key={m.key} onClick={() => setModo(m.key)} style={{
            flex: 1, padding: '14px 6px', borderRadius: '18px',
            border: '1px solid var(--border)',
            background: modo === m.key ? 'var(--accent)' : 'var(--bg-card)',
            color: modo === m.key ? 'var(--bg-primary)' : 'var(--text-secondary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
            transition: 'all 0.2s'
          }}>
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Card de vibe */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: '24px',
        padding: '20px', marginBottom: '20px',
        border: '1px solid var(--border)'
      }}>
        <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '15px', marginBottom: '14px' }}>
          ✨ ¿Qué vibe buscas hoy?
        </p>

        {modo === 'texto' && (
          <textarea
            placeholder="Ej: Algo melancólico pero esperanzador, como una tarde lluviosa con café..."
            value={vibeTexto}
            onChange={e => setVibeTexto(e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: 'none', width: '100%' }}
          />
        )}

        {modo === 'cancion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Nombre de la canción" value={cancion.nombre}
              onChange={e => setCancion({ ...cancion, nombre: e.target.value })} style={inputStyle} />
            <input placeholder="Artista (opcional)" value={cancion.artista}
              onChange={e => setCancion({ ...cancion, artista: e.target.value })} style={inputStyle} />
          </div>
        )}

        {modo === 'video' && (
          <input placeholder="URL de YouTube" value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)} style={inputStyle} />
        )}

        {modo === 'imagen' && (
          <div>
            <input type="file" accept="image/*"
              onChange={e => setImagen(e.target.files[0])}
              style={{ color: 'var(--text-primary)', marginBottom: '8px', width: '100%' }} />
            {imagen && (
              <img src={URL.createObjectURL(imagen)} alt="preview"
                style={{ width: '100%', borderRadius: '12px', maxHeight: '180px', objectFit: 'cover' }} />
            )}
          </div>
        )}

        <button onClick={detectarVibe} disabled={cargando} style={{
          background: 'var(--accent)', color: 'var(--bg-primary)',
          border: 'none', borderRadius: '14px', padding: '14px',
          fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
          width: '100%', marginTop: '14px', opacity: cargando ? 0.7 : 1,
          transition: 'opacity 0.2s'
        }}>
          {cargando ? '✨ Analizando vibe...' : 'Obtener recomendaciones ✨'}
        </button>
      </div>

      {/* Mensaje guardado */}
      {mensajeGuardado && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--accent)',
          borderRadius: '14px', padding: '12px 16px', marginBottom: '16px',
          color: 'var(--accent)', fontSize: '14px', textAlign: 'center'
        }}>✅ {mensajeGuardado}</div>
      )}

      {/* Resultados */}
      {resultado && (
        <>
          {/* Vibe card */}
          <div style={{
            background: 'var(--bg-card)', borderRadius: '24px',
            padding: '20px', marginBottom: '16px', border: '1px solid var(--border)'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Vibe detectado
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px' }}>{vibeEmoji[resultado.vibe?.vibe] || '✨'}</span>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'capitalize' }}>
                {resultado.vibe?.vibe}
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {resultado.vibe?.tags?.map(tag => (
                <span key={tag} style={{
                  background: 'var(--bg-modal)', color: 'var(--text-secondary)',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px'
                }}>{tag}</span>
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.5' }}>
              {resultado.explicacion?.explicacion}
            </p>
          </div>

          {/* Inferencias */}
          {resultado.recomendaciones?.inferencias?.length > 0 && (
            <div style={{
              background: 'var(--bg-card)', borderRadius: '20px',
              padding: '16px', marginBottom: '16px', border: '1px solid var(--border)'
            }}>
              <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>
                🧠 Razonamiento del sistema
              </p>
              {resultado.recomendaciones.inferencias.map((inf, i) => (
                <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px' }}>• {inf}</p>
              ))}
            </div>
          )}

          {/* Libros */}
          <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '14px' }}>
            Recomendación para ti
          </p>
          {resultado.recomendaciones?.libros?.map(libro => (
            <div key={libro.id} onClick={() => setLibroSeleccionado(libro)} style={{
              background: 'var(--bg-card)', borderRadius: '20px',
              padding: '16px', marginBottom: '14px',
              display: 'flex', gap: '14px', cursor: 'pointer',
              border: '1px solid var(--border)', transition: 'border-color 0.2s'
            }}>
              {libro.portada_url ? (
                <img src={libro.portada_url} alt={libro.titulo}
                  style={{ width: '75px', height: '110px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: '75px', height: '110px', borderRadius: '10px',
                  background: 'var(--bg-modal)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontSize: '10px', textAlign: 'center', padding: '6px'
                }}>📚</div>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px', lineHeight: '1.3' }}>{libro.titulo}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>{libro.autor}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '12px', lineHeight: '1.5' }}>
                  {libro.descripcion?.slice(0, 100)}{libro.descripcion?.length > 100 ? '...' : ''}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={e => { e.stopPropagation(); agregarBiblioteca(libro, 'quiero_leer'); }} style={btnSmall}>
                    🔖 Quiero leer
                  </button>
                  <button onClick={e => { e.stopPropagation(); agregarBiblioteca(libro, 'leyendo'); }} style={btnSmall}>
                    📖 Leyendo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Modal detalle libro */}
      {libroSeleccionado && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'flex-end', zIndex: 200
        }} onClick={() => setLibroSeleccionado(null)}>
          <div style={{
            background: 'var(--bg-modal)', borderRadius: '24px 24px 0 0',
            padding: '24px', width: '100%', maxHeight: '80vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Detalles del libro</h3>
              <button onClick={() => setLibroSeleccionado(null)} style={{
                background: 'none', border: 'none', color: 'var(--text-secondary)',
                fontSize: '24px', cursor: 'pointer'
              }}>×</button>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              {libroSeleccionado.portada_url ? (
                <img src={libroSeleccionado.portada_url} alt={libroSeleccionado.titulo}
                  style={{ width: '90px', height: '130px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: '90px', height: '130px', borderRadius: '12px',
                  background: 'var(--bg-card)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
                }}>📚</div>
              )}
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>{libroSeleccionado.titulo}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{libroSeleccionado.autor}</p>
                <span style={{
                  background: 'var(--bg-card)', color: 'var(--accent)',
                  padding: '4px 10px', borderRadius: '20px', fontSize: '12px'
                }}>{libroSeleccionado.genero}</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              {libroSeleccionado.descripcion || 'Sin descripción disponible.'}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => agregarBiblioteca(libroSeleccionado, 'quiero_leer')} style={{
                flex: 1, background: 'var(--bg-card)', color: 'var(--text-primary)',
                border: '1px solid var(--border)', borderRadius: '14px',
                padding: '12px', fontSize: '13px', cursor: 'pointer', fontWeight: '500'
              }}>🔖 Quiero leer</button>
              <button onClick={() => agregarBiblioteca(libroSeleccionado, 'leyendo')} style={{
                flex: 1, background: 'var(--bg-card)', color: 'var(--text-primary)',
                border: '1px solid var(--border)', borderRadius: '14px',
                padding: '12px', fontSize: '13px', cursor: 'pointer', fontWeight: '500'
              }}>📖 Leyendo</button>
              <button onClick={() => agregarBiblioteca(libroSeleccionado, 'leido')} style={{
                flex: 1, background: 'var(--accent)', color: 'var(--bg-primary)',
                border: 'none', borderRadius: '14px',
                padding: '12px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold'
              }}>✅ Leído</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  borderRadius: '12px', padding: '12px 14px',
  color: 'var(--text-primary)', fontSize: '14px', outline: 'none', width: '100%'
};

const btnSmall = {
  background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
  border: '1px solid var(--border)', borderRadius: '10px',
  padding: '6px 10px', fontSize: '12px', cursor: 'pointer'
};

export default Home;