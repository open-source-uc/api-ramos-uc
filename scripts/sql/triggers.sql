-- Trigger: set_fecha_update
DROP TRIGGER IF EXISTS set_fecha_update;

CREATE TRIGGER set_fecha_update
AFTER UPDATE ON review
FOR EACH ROW
BEGIN
    UPDATE review SET date = datetime('now') WHERE course_id = NEW.course_id AND email_hash = NEW.email_hash;
END;

-- Trigger: insert_course_reviews_course
DROP TRIGGER IF EXISTS insert_course_reviews_course;

CREATE TRIGGER insert_course_reviews_course
AFTER INSERT ON course
FOR EACH ROW
BEGIN
    INSERT INTO course_reviews (
        course_id, sigle, name, category_id, school_id, area_id, credits, promedio, promedio_creditos_est
    )
    VALUES (
        NEW.id,
        NEW.sigle, 
        NEW.name, 
        NEW.category_id,   
        NEW.school_id, 
        NEW.area_id, 
        NEW.credits, 
        -1,  -- valor predeterminado para promedio
        -1   -- valor predeterminado para promedio_creditos_est
    );
END;

-- Trigger: insert_course_reviews
DROP TRIGGER IF EXISTS insert_course_reviews;

CREATE TRIGGER insert_course_reviews
AFTER INSERT ON review
FOR EACH ROW
BEGIN
    UPDATE course_reviews
    SET 
        promedio = (
            SELECT 
                CASE 
                    WHEN COUNT(r.course_id) = 0 THEN -1
                    ELSE AVG(CASE WHEN r.liked THEN 1 ELSE 0 END) 
                END
            FROM review r
            WHERE r.course_id = NEW.course_id
        ),
        promedio_creditos_est = (
            SELECT 
                COALESCE(AVG(r.estimated_credits), -1)
            FROM review r
            WHERE r.course_id = NEW.course_id
        )
    WHERE course_id = NEW.course_id;
END;

-- Trigger: update_course_reviews
DROP TRIGGER IF EXISTS update_course_reviews;

CREATE TRIGGER update_course_reviews
AFTER UPDATE ON review
FOR EACH ROW
BEGIN
    UPDATE course_reviews
    SET 
        promedio = (
            SELECT 
                CASE 
                    WHEN COUNT(r.course_id) = 0 THEN -1
                    ELSE AVG(CASE WHEN r.liked THEN 1 ELSE 0 END) 
                END
            FROM review r
            WHERE r.course_id = NEW.course_id
        ),
        promedio_creditos_est = (
            SELECT 
                COALESCE(AVG(r.estimated_credits), -1)
            FROM review r
            WHERE r.course_id = NEW.course_id
        )
    WHERE course_id = NEW.course_id;
END;

-- Trigger: delete_course_reviews
DROP TRIGGER IF EXISTS delete_course_reviews;

CREATE TRIGGER delete_course_reviews
AFTER DELETE ON review
FOR EACH ROW
BEGIN
    UPDATE course_reviews
    SET 
        promedio = (
            SELECT 
                CASE 
                    WHEN COUNT(r.course_id) = 0 THEN -1
                    ELSE AVG(CASE WHEN r.liked THEN 1 ELSE 0 END) 
                END
            FROM review r
            WHERE r.course_id = OLD.course_id
        ),
        promedio_creditos_est = (
            SELECT 
                COALESCE(AVG(r.estimated_credits), -1)
            FROM review r
            WHERE r.course_id = OLD.course_id
        )
    WHERE course_id = OLD.course_id;
END;


-- Trigger que se activa después de cada inserción o eliminación de permisos para un usuario
CREATE TRIGGER update_token_version_after_permission_change
AFTER INSERT ON userpermission
BEGIN
    UPDATE useraccount
    SET token_version = datetime('now')  -- Actualiza la versión del token a la fecha y hora actual
    WHERE email_hash = NEW.email_hash;  -- Se aplica solo al usuario que acaba de tener un cambio de permisos
END;

CREATE TRIGGER update_token_version_after_permission_removal
AFTER DELETE ON userpermission
BEGIN
    UPDATE useraccount
    SET token_version = datetime('now')  -- Actualiza la versión del token a la fecha y hora actual
    WHERE email_hash = OLD.email_hash;  -- Se aplica solo al usuario que acaba de perder permisos
END;
