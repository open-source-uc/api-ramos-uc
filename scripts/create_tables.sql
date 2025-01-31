-- Tabla: career
CREATE TABLE career (
    name VARCHAR(255) PRIMARY KEY
);

-- Tabla: permission
CREATE TABLE permission (
    name VARCHAR(100) PRIMARY KEY
);

-- Tabla: course
CREATE TABLE course (
    sigle VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credits INTEGER,
    school VARCHAR(100),
    area VARCHAR(100),
    category VARCHAR(100)
);

-- Tabla: teacher
CREATE TABLE teacher (
    name VARCHAR(100) PRIMARY KEY
);

-- Tabla: schedule
CREATE TABLE schedule (
    day_block VARCHAR(2),
    type VARCHAR(50),
    place VARCHAR(50),
    campus VARCHAR(50),
    PRIMARY KEY (day_block, place, campus),
    CONSTRAINT check_campus CHECK (campus IN ('Campus Externo', 'Casa Central', 'Lo Contador', 'Oriente', 'San Joaquín', 'Villarrica'))
);

-- Tabla: useraccount
CREATE TABLE useraccount (
    email_hash TEXT PRIMARY KEY,
    password VARCHAR(1024),
    nickname VARCHAR(100) NOT NULL,
    admision_year INTEGER NOT NULL,
    carrer_name VARCHAR(255) NOT NULL,
    CONSTRAINT check_admission_year CHECK (
        admision_year BETWEEN (CAST(strftime('%Y','now') AS INTEGER) - 12) 
                            AND CAST(strftime('%Y','now') AS INTEGER)
    ),
    FOREIGN KEY (carrer_name) REFERENCES career(name)
);

-- Tabla: section
CREATE TABLE section (
    sigle VARCHAR(50),
    number INTEGER NOT NULL,
    year INTEGER,
    semester INTEGER,
    format VARCHAR(50),
    is_english BOOLEAN,
    is_removable BOOLEAN,
    is_special BOOLEAN,
    CONSTRAINT check_year CHECK (
        year BETWEEN (CAST(strftime('%Y','now') AS INTEGER) - 5) 
                 AND CAST(strftime('%Y','now') AS INTEGER)
    ),
    CONSTRAINT check_semester CHECK (semester IN (1, 2, 3)),
    PRIMARY KEY (sigle, number, year, semester),
    FOREIGN KEY (sigle) REFERENCES course(sigle)
);

-- Tabla: quota
CREATE TABLE quota (
    section_sigle VARCHAR(50),
    section_number INTEGER,
    section_year INTEGER,
    section_semester INTEGER,
    type VARCHAR(200),
    count INTEGER,
    PRIMARY KEY (section_sigle, section_number, section_year, section_semester, type),
    FOREIGN KEY (section_sigle, section_number, section_year, section_semester)
       REFERENCES section(sigle, number, year, semester)
);

-- Tabla: sectionteacher
CREATE TABLE sectionteacher (
    section_sigle VARCHAR(50),
    section_number INTEGER,
    year INTEGER,
    semester INTEGER,
    teacher_name VARCHAR(100),
    PRIMARY KEY (section_sigle, section_number, year, semester, teacher_name),
    FOREIGN KEY (teacher_name) REFERENCES teacher(name),
    FOREIGN KEY (section_sigle, section_number, year, semester)
        REFERENCES section(sigle, number, year, semester)
);

-- Tabla: sectionschedule
CREATE TABLE sectionschedule (
    section_sigle VARCHAR(50),
    section_number INTEGER,
    year INTEGER,
    semester INTEGER,
    day_block VARCHAR(2),
    place VARCHAR(50),
    campus VARCHAR(50),
    PRIMARY KEY (section_sigle, section_number, year, semester, day_block),
    FOREIGN KEY (section_sigle, section_number, year, semester)
       REFERENCES section(sigle, number, year, semester),
    FOREIGN KEY (day_block, place, campus)
       REFERENCES schedule(day_block, place, campus)
);

-- Tabla: userpermission
CREATE TABLE userpermission (
    email_hash TEXT,
    permission_name VARCHAR(100),
    PRIMARY KEY (email_hash, permission_name),
    FOREIGN KEY (email_hash) REFERENCES useraccount(email_hash),
    FOREIGN KEY (permission_name) REFERENCES permission(name)
);

-- Tabla: review
CREATE TABLE review (
    section_sigle VARCHAR(50),
    section_number INTEGER,
    year INTEGER,
    semester INTEGER,
    email_hash TEXT,
    liked BOOLEAN,
    comment TEXT,
    estimated_credits INTEGER,
    status VARCHAR(20),
    PRIMARY KEY (section_sigle, section_number, year, semester, email_hash),
    CONSTRAINT check_status CHECK (status IN ('visible', 'hidden')),
    FOREIGN KEY (email_hash) REFERENCES useraccount(email_hash),
    FOREIGN KEY (section_sigle, section_number, year, semester)
       REFERENCES section(sigle, number, year, semester)
);
