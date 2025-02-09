DROP INDEX IF EXISTS idx_review_email_hash;
CREATE INDEX idx_review_email_hash ON review(email_hash);

DROP INDEX IF EXISTS idx_review_status;
CREATE INDEX idx_review_status ON review(status);

DROP INDEX IF EXISTS idx_review_cover;
CREATE INDEX idx_review_cover ON review(course_sigle, liked, estimated_credits);

DROP INDEX IF EXISTS idx_review_liked;
CREATE INDEX idx_review_liked ON review(liked);

DROP INDEX IF EXISTS idx_review_estimated_credits;
CREATE INDEX idx_review_estimated_credits ON review(estimated_credits);

DROP INDEX IF EXISTS idx_course_sigle;
CREATE INDEX idx_course_sigle ON course(sigle);

DROP INDEX IF EXISTS idx_course_school;
CREATE INDEX idx_course_school ON course(school);

DROP INDEX IF EXISTS idx_course_category;
CREATE INDEX idx_course_category ON course(category);

DROP INDEX IF EXISTS idx_course_reviews_area;
CREATE INDEX idx_course_reviews_area ON course_reviews(area);

DROP INDEX IF EXISTS idx_course_reviews_area_promedio;
CREATE INDEX idx_course_reviews_area_promedio ON course_reviews(area, promedio DESC);

DROP INDEX IF EXISTS idx_course_reviews_promedio;
CREATE INDEX idx_course_reviews_promedio ON course_reviews(promedio DESC);

DROP INDEX IF EXISTS idx_course_reviews_shool_promedio;
CREATE INDEX idx_course_reviews_shool_promedio ON course_reviews(school, promedio DESC);

DROP INDEX IF EXISTS idx_course_reviews_area_promedio_sigle;
CREATE INDEX idx_course_reviews_area_promedio_sigle 
ON course_reviews(area, promedio DESC, sigle);