-- Tabla: career
CREATE TABLE career (
    name VARCHAR(255) PRIMARY KEY
);

-- Tabla: permission
CREATE TABLE permission (
    name VARCHAR(100) PRIMARY KEY
);

-- Tabla: useraccount
CREATE TABLE useraccount (
    email_hash TEXT PRIMARY KEY,
    password VARCHAR(1024),
    nickname VARCHAR(100) NOT NULL UNIQUE,
    admission_year INTEGER NOT NULL,  
    career_name VARCHAR(255) NOT NULL,
    secret_key TEXT NOT NULL,
    FOREIGN KEY (career_name) REFERENCES career(name)
);

-- Tabla: userpermission (tabla de relación entre usuarios y permisos)
CREATE TABLE userpermission (
    email_hash TEXT,
    permission_name VARCHAR(100),
    PRIMARY KEY (email_hash, permission_name),
    FOREIGN KEY (email_hash) REFERENCES useraccount(email_hash),
    FOREIGN KEY (permission_name) REFERENCES permission(name)
);

-- Tabla: course (se mantiene sin cambios)
CREATE TABLE course (
    sigle VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credits INTEGER,
    school VARCHAR(100),
    area VARCHAR(100),
    category VARCHAR(100)
);


-- Tabla: review
CREATE TABLE review (
    course_sigle VARCHAR(50),
    section_number INTEGER,
    email_hash TEXT,
    liked BOOLEAN,
    comment TEXT,
    estimated_credits INTEGER,
    status VARCHAR(20),
    PRIMARY KEY (course_sigle, section_number, email_hash),
    CONSTRAINT check_status CHECK (status IN ('visible', 'hidden')),
    FOREIGN KEY (course_sigle) REFERENCES course(sigle),
    FOREIGN KEY (email_hash) REFERENCES useraccount(email_hash)
);

