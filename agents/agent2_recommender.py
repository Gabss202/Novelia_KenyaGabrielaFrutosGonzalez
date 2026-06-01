from google import genai
from dotenv import load_dotenv
import os
import json
import sys

# Asegurar rutas correctas
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importamos la función de análisis
from agents.agent1_vibe import detectar_vibe

try:
    from database.db_setup import get_connection
except ImportError:
    get_connection = None

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODO_DESARROLLO = os.getenv("MODO_DESARROLLO", "false").lower() == "true"

# BASE DE CONOCIMIENTO 
REGLAS_INFERENCIA = [
    {
        "id": "R001",
        "condicion": lambda v, e, t: "enemies to lovers" in v or "rabia" in e,
        "genero": "dark romance y fantasía con alta tensión",
        "explicacion": "Detecté tensión y conflicto entre personajes — ideales para los amantes del enemies to lovers."
    },
    {
        "id": "R002",
        "condicion": lambda v, e, t: "romance oscuro" in v or t == "oscuro" or "oscura" in v,
        "genero": "dark fantasy romance y suspenso gótico",
        "explicacion": "Tu vibe contiene sombras y profundidad — libros que habitan en una hermosa oscuridad."
    },
    {
        "id": "R003",
        "condicion": lambda v, e, t: "nostalgia" in e or "melancolía" in e or t == "nostálgico",
        "genero": "ficción contemporánea emotiva y drama existencial",
        "explicacion": "Sentí una profunda carga melancólica en tu descripción — historias que calan hondo en el alma."
    },
    {
        "id": "R004",
        "condicion": lambda v, e, t: "magia" in v or t == "mágico",
        "genero": "fantasía mágica de alta construcción de mundos",
        "explicacion": "Tu atmósfera desborda magia y universos extraordinarios — portales hacia mundos increíbles."
    },
    {
        "id": "R005",
        "condicion": lambda v, e, t: "cozy" in v or "reconfortante" in v or t == "suave",
        "genero": "cozy fiction, slow life y romance tierno",
        "explicacion": "Tu vibe es sumamente cálida y acogedora — libros reconfortantes como un té caliente en un día gris."
    },
    {
        "id": "R006",
        "condicion": lambda v, e, t: "traición" in v or "secretos" in e,
        "genero": "thriller psicológico y misterio con giros de tuerca",
        "explicacion": "Detecté misterios ocultos y traiciones — tramas que te mantendrán pegado a la lectura."
    },
    {
        "id": "R007",
        "condicion": lambda v, e, t: "aventura" in v or t == "aventurero",
        "genero": "fantasía distópica, aventura y acción emocionante",
        "explicacion": "Tu vibe es indomable, libre y emocionante — relatos cargados de adrenalina, valentía y acción."
    }
]

def aplicar_motor_inferencia(vibes: list, emociones: list, tono: str) -> list:
    """ Compara las etiquetas extraídas contra las reglas lógicas del sistema experto """
    reglas_activadas = []
    vibes_lower = [v.lower() for v in vibes]
    emociones_lower = [e.lower() for e in emociones]
    tono_lower = tono.lower()
    
    for regla in REGLAS_INFERENCIA:
        if regla["condicion"](vibes_lower, emociones_lower, tono_lower):
            reglas_activadas.append(regla)
            
    if not reglas_activadas:
        reglas_activadas.append({
            "id": "R000",
            "genero": "ficción general literaria contemporánea",
            "explicacion": "No localicé una regla exacta para esta combinación, pero estas recomendaciones universales te fascinarán."
        })
    return reglas_activadas


# AGENTE 2: GENERADOR DINÁMICO DE RECOMENDACIONES

def generar_recomendacion_dinamica_ia(entrada_original: str, reglas_activadas: list, idioma: str = "español") -> dict:
    """
    Usa el género inferido por las reglas lógicas para buscar en su conocimiento
    libros reales cambiantes del mundo de la literatura, adaptándose al idioma del usuario.
    """
    generos_objetivo = [r["genero"] for r in reglas_activadas]
    
    if MODO_DESARROLLO:
        return {
            "libros": ["Los Siete Maridos de Evelyn Hugo - Taylor Jenkins Reid", "La Vida Invisible de Addie LaRue - V.E. Schwab"],
            "texto_recommendation": "Respuesta de simulación activa. Cambia MODO_DESARROLLO=false para consultar la API real."
        }

    prompt = f"""
    Eres Bloom, la sofisticada y elocuente bibliotecaria de la prestigiosa aplicación de lectura 'Novelia'.
    
    El usuario colocó este detonante multimedia o frase:
    "{entrada_original}"
    
    Nuestro motor de inferencia lógico determinó que el género ideal para este estado de ánimo es: {", ".join(generos_objetivo)}.
    
    Tu misión es recomendar exactamente 3 libros REALES diferentes del mercado literario actual que encajen con lo descrito. 
    ¡Sé sumamente creativa y varía tus opciones! No te limites siempre a los mismos títulos comerciales conocidos.
    
    REQUISITO DE IDIOMA: El usuario interactúa en '{idioma}'. Los títulos oficiales traducidos y la reseña DEBEN estar en '{idioma}'.
    
    Responde estrictamente en formato JSON válido:
    {{
        "libros": ["Título - Autor", "Título - Autor", "Título - Autor"],
        "texto_recommendation": "Una reseña poética y apasionada en idioma {idioma} (máximo 3 párrafos). Valida artísticamente la entrada del usuario y explícale con total claridad por qué elegiste cada uno de esos 3 libros específicos."
    }}
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text.strip())
    except Exception as e:
        print(f"⚠️ Error generando libros dinámicos: {e}")
        return {
            "libros": ["Crónica de una muerte anunciada - Gabriel García Márquez"],
            "texto_recommendation": "Un clásico de suspenso e intriga que se adapta a momentos intensos."
        }

def guardar_en_db(input_vibe: str, libros: list, explicacion: str):
    """ Almacena los resultados en la base de datos local """
    if not get_connection:
        return
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO recommendations (input_vibe, recommended_books, explanation)
            VALUES (?, ?, ?)
        """, (input_vibe, json.dumps(libros, ensure_ascii=False), explicacion))
        conn.commit()
        conn.close()
    except Exception as e:
        pass

# FUNCIÓN ORQUESTADORA PRINCIPAL

def recomendar_libros_por_vibe(entrada_usuario: str, idioma_preferido: str = "español") -> dict:
    """
    Orquesta el flujo completo de Novelia enlazando ambos agentes.
    Si MODO_DESARROLLO es True, simula de forma inteligente para no usar la API.
    """
    print(f"🕵️‍♂️ Conectando con Agente 1 para analizar: '{entrada_usuario}'...")
    
    # 1. Llamada al Agente 1
    vibe_analizada = detectar_vibe(entrada_usuario)
    
    # --- SIMULACIÓN DINÁMICA DE ENTRADAS MULTIMEDIA ---
    if MODO_DESARROLLO:
        entrada_lower = entrada_usuario.lower()
        if "devil doesn't bargain" in entrada_lower or "aferrada" in entrada_lower:
            vibe_analizada = {
                "emociones": ["rabia contenida", "tristeza"],
                "vibes": ["enemies to lovers", "romance oscuro"],
                "tono": "oscuro"
            }
        elif "cardigan" in entrada_lower or "lluvioso" in entrada_lower:
            vibe_analizada = {
                "emociones": ["nostalgia", "melancolía"],
                "vibes": ["cozy", "reconfortante"],
                "tono": "nostálgico"
            }

    print(f"🎭 Agente 1 detectó -> Tono: {vibe_analizada.get('tono')}, Vibes: {vibe_analizada.get('vibes')}")
    
    # 2. El motor lógico clasifica según las reglas de ingeniería del conocimiento
    reglas = aplicar_motor_inferencia(
        vibe_analizada.get("vibes", []),
        vibe_analizada.get("emociones", []),
        vibe_analizada.get("tono", "")
    )
    
    # 3. Agente 2 genera recomendaciones (Nombre de parámetro corregido)
    if MODO_DESARROLLO:
        genero_detectado = reglas[0]["genero"]
        if "dark romance" in genero_detectado:
            data_libros = {
                "libros": ["Haunting Adeline - H.D. Carlton", "Twisted Love - Ana Huang", "A Court of Thorns and Roses - Sarah J. Maas"],
                "texto_recommendation": f"Elegí estas piezas para complementar 'The Devil Doesn't Bargain'. Capturan a la perfección esa atmósfera de {genero_detectado} y el sentimiento abrasador de aferrarse a un amor complejo."
            }
        else:
            data_libros = {
                "libros": ["The Midnight Library - Matt Haig", "Los Siete Maridos de Evelyn Hugo - Taylor Jenkins Reid", "Normal People - Sally Rooney"],
                "texto_recommendation": f"Ideal para acompañar acordes melancólicos. Estas recomendaciones de {genero_detectado} te envolverán por completo en una tarde lluviosa."
            }
    else:
        data_libros = generar_recommendation_dinamica_ia(entrada_usuario, reglas_activadas=reglas, idioma=idioma_preferido)
    
    libros_sugeridos = data_libros.get("libros", [])
    resena_completa = data_libros.get("texto_recommendation", "")
    
    # 4. Almacenamiento opcional
    guardar_en_db(str(vibe_analizada.get("vibes")), libros_sugeridos, resena_completa)
    
    return {
        "analisis_emocional": vibe_analizada,
        "reglas_activadas": [r["id"] for r in reglas],
        "generos_deducidos": [r["genero"] for r in reglas],
        "libros": libros_sugeridos,
        "explicacion_bloom": resena_completa
    }

# Área de ejecución de pruebas
if __name__ == "__main__":
    print("✨ --- BIENVENIDO AL SISTEMA DE PRUEBAS DE NOVELIA --- ✨\n")
    
    # PRUEBA A: Descomenta esta línea para simular canciones tristes/románticas oscuras
    prueba_usuario = "Escuchando cardigan "
    
    # PRUEBA B: Descomenta esta línea para simular canciones
    # prueba_usuario = "Escuchando 'Cardigan' en Spotify bajo una cobija en un día muy lluvioso"
    
    resultado = recomendar_libros_por_vibe(prueba_usuario)
    
    print("\n📚 [RESULTADOS DEL SISTEMA EXPERTO MULTIAGENCIAL]")
    print(f"🗂️ Reglas activadas: {resultado['reglas_activadas']}")
    print(f"🎭 Géneros deducidos por el conocimiento local: {resultado['generos_deducidos']}")
    print("\n📖 RECOMENDACIONES DE BLOOM:")
    for lib in resultado['libros']:
        print(f"   • {lib}")
    print(f"\n✍️ JUSTIFICACIÓN DE RAZONAMIENTO:\n{resultado['explicacion_bloom']}")