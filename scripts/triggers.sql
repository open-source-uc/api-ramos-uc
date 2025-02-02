CREATE TRIGGER set_fecha_update
AFTER UPDATE ON review
FOR EACH ROW
BEGIN
    UPDATE review SET date = datetime('now') WHERE rowid = NEW.rowid;
END;
