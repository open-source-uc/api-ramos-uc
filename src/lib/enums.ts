export enum PERMISSIONS {
    CREATE_EDIT_OWN_REVIEW = 1,
    AUTH = 2,
    UPDATE_QUOTA = 3,// Para que un bot o un servicio externo agregue cursos, cupos, etc
    ADMIN = 4,
    NULL = -1
}