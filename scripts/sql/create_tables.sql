-- Tabla: career (con ID numérico)
CREATE TABLE career (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Tabla: permission (con ID numérico)
CREATE TABLE permission (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Tabla: useraccount
CREATE TABLE useraccount (
    email_hash TEXT PRIMARY KEY,
    password TEXT,
    nickname TEXT NOT NULL UNIQUE,
    admission_year INTEGER NOT NULL,  
    career_id INTEGER NOT NULL,
    token_version TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (career_id) REFERENCES career(id)
);

-- Tabla: userpermission (tabla de relación entre usuarios y permisos)
CREATE TABLE userpermission (
    email_hash TEXT,
    permission_id INTEGER,
    PRIMARY KEY (email_hash, permission_id),
    FOREIGN KEY (email_hash) REFERENCES useraccount(email_hash),
    FOREIGN KEY (permission_id) REFERENCES permission(id)
);

-- Tabla: school (con ID numérico)
CREATE TABLE school (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Tabla: area (con ID numérico)
CREATE TABLE area (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Tabla: category (con ID numérico)
CREATE TABLE category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Tabla: course (modificada para usar un ID numérico único)
CREATE TABLE course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID numérico autoincremental
    sigle TEXT NOT NULL UNIQUE,            -- Sigla del curso
    name TEXT NOT NULL,                    -- Nombre del curso
    credits INTEGER NOT NULL,              -- Créditos del curso
    school_id INTEGER NOT NULL,            -- Referencia a la escuela
    area_id INTEGER NOT NULL,              -- Referencia al área
    category_id INTEGER NOT NULL,          -- Referencia a la categoría
    UNIQUE (id),                           -- Asegura que el ID es único
    FOREIGN KEY (school_id) REFERENCES school(id),
    FOREIGN KEY (area_id) REFERENCES area(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE review (
    id INTEGER PRIMARY KEY AUTOINCREMENT,      -- Columna id autoincremental
    course_id INTEGER,                         -- Referencia al ID del curso
    email_hash TEXT,                           -- Hash del email
    year INTEGER,
    section_number INTEGER,
    liked BOOLEAN,
    comment TEXT,
    estimated_credits INTEGER,
    status TEXT NOT NULL,
    date TEXT DEFAULT (datetime('now')),
    CHECK (status IN ('visible', 'hidden')),
    FOREIGN KEY (course_id) REFERENCES course(id),  -- Relación con course por ID
    FOREIGN KEY (email_hash) REFERENCES useraccount(email_hash),
    UNIQUE (course_id, email_hash)  -- Asegura que la combinación de course_id y email_hash sea única
);

-- Tabla: course_reviews (modificada para usar ID numérico único)
CREATE TABLE course_reviews (
    course_id INTEGER,  -- ID numérico autoincremental
    sigle TEXT NOT NULL,                   -- Sigla del curso
    name TEXT,                             -- Nombre del curso
    credits INTEGER NOT NULL,              -- Créditos del curso
    school_id INTEGER NOT NULL,            -- Referencia a la escuela
    area_id INTEGER NOT NULL,              -- Referencia al área
    category_id INTEGER NOT NULL,          -- Referencia a la categoría
    promedio REAL,                         -- Promedio de las reseñas
    promedio_creditos_est REAL,            -- Promedio de créditos estimados
    FOREIGN KEY (school_id) REFERENCES school(id),
    FOREIGN KEY (area_id) REFERENCES area(id),
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (course_id) REFERENCES course(id),
    PRIMARY KEY (course_id)                       
);
