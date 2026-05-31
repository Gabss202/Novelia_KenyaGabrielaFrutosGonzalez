import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "books.db")

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Tabla principal de libros
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            genre TEXT,
            status TEXT DEFAULT 'quiero_leer',
            cover_url TEXT,
            total_pages INTEGER,
            date_added TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tabla de reseñas y calificaciones
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            rating REAL,
            review_text TEXT,
            favorite_characters TEXT,
            music TEXT,
            vibes TEXT,
            date_reviewed TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (book_id) REFERENCES books(id)
        )
    """)

    # Tabla de recomendaciones generadas
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            input_vibe TEXT,
            recommended_books TEXT,
            explanation TEXT,
            date_generated TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    print("Base de datos inicializada correctamente")

if __name__ == "__main__":
    init_db()