DROP TRIGGER IF EXISTS set_fecha_update;

CREATE TRIGGER set_fecha_update
AFTER UPDATE ON review
FOR EACH ROW
BEGIN
    UPDATE review SET date = datetime('now') WHERE rowid = NEW.rowid;
END;

DROP TRIGGER IF EXISTS insert_course_reviews_course;
CREATE TRIGGER insert_course_reviews_course
AFTER INSERT ON course
FOR EACH ROW
BEGIN
    INSERT INTO course_reviews (
        sigle, name, category, school, area, credits, promedio, promedio_creditos_est
    )
    VALUES (
        NEW.sigle, 
        NEW.name, 
        NEW.category, 
        NEW.school, 
        NEW.area, 
        NEW.credits, 
        NULL,  -- valor predeterminado para promedio
        NULL   -- valor predeterminado para promedio_creditos_est
    );
END;

DROP TRIGGER IF EXISTS insert_course_reviews;
CREATE TRIGGER insert_course_reviews
AFTER INSERT ON review
FOR EACH ROW
BEGIN
    -- Recalcular promedio y promedio_creditos_est para el curso afectado al insertar una nueva reseña
    UPDATE course_reviews
    SET 
        promedio = (
            SELECT 
                CASE 
                    WHEN COUNT(r.course_sigle) = 0 THEN NULL
                    ELSE AVG(CASE WHEN r.liked THEN 1 ELSE 0 END) 
                END
            FROM review r
            WHERE r.course_sigle = NEW.course_sigle
        ),
        promedio_creditos_est = (
            SELECT 
                AVG(r.estimated_credits)
            FROM review r
            WHERE r.course_sigle = NEW.course_sigle
        )
    WHERE sigle = NEW.course_sigle;
END;

DROP TRIGGER IF EXISTS update_course_reviews;
CREATE TRIGGER update_course_reviews
AFTER UPDATE ON review
FOR EACH ROW
BEGIN
    -- Recalcular promedio y promedio_creditos_est para el curso afectado al actualizar una reseña
    UPDATE course_reviews
    SET 
        promedio = (
            SELECT 
                CASE 
                    WHEN COUNT(r.course_sigle) = 0 THEN NULL
                    ELSE AVG(CASE WHEN r.liked THEN 1 ELSE 0 END) 
                END
            FROM review r
            WHERE r.course_sigle = NEW.course_sigle
        ),
        promedio_creditos_est = (
            SELECT 
                AVG(r.estimated_credits)
            FROM review r
            WHERE r.course_sigle = NEW.course_sigle
        )
    WHERE sigle = NEW.course_sigle;
END;

DROP TRIGGER IF EXISTS delete_course_reviews;
CREATE TRIGGER delete_course_reviews
AFTER DELETE ON review
FOR EACH ROW
BEGIN
    -- Recalcular promedio y promedio_creditos_est para el curso afectado al eliminar una reseña
    UPDATE course_reviews
    SET 
        promedio = (
            SELECT 
                CASE 
                    WHEN COUNT(r.course_sigle) = 0 THEN NULL
                    ELSE AVG(CASE WHEN r.liked THEN 1 ELSE 0 END) 
                END
            FROM review r
            WHERE r.course_sigle = OLD.course_sigle
        ),
        promedio_creditos_est = (
            SELECT 
                AVG(r.estimated_credits)
            FROM review r
            WHERE r.course_sigle = OLD.course_sigle
        )
    WHERE sigle = OLD.course_sigle;
END;
