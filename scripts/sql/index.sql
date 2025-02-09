-- Índice compuesto para ordenar por school_id y luego por promedio
CREATE INDEX idx_course_reviews_school_promedio
ON course_reviews(school_id, promedio DESC);

CREATE INDEX idx_course_reviews_area_promedio
ON course_reviews(area_id, promedio DESC);

CREATE INDEX idx_course_reviews_school
ON course_reviews(school_id);

CREATE INDEX idx_course_reviews_area
ON course_reviews(area_id);

CREATE INDEX idx_course_reviews_promedio
ON course_reviews(promedio DESC);