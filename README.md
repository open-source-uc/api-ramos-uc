# api-ramos-uc

API de Ramos

La API de "ramos uc" es la API utilizada para la página **Ramos UC**, una plataforma dedicada a la crítica de ramos.

## Stack:
- **HonoJS**: Framework para APIs.
- **SQLite**: Base de datos ligera.
- **Cloudflare Workers**: Para desplegar la API.

## Configuración para el desarrollo

> [!IMPORTANT]
> Debe llamarse **`.dev.vars`**

1. Crea un archivo `.dev.vars` con las siguientes variables de entorno:
    - `SECRET_GLOBAL_KEY=` // Obligatorio tanto en desarrollo como en producción.

## SetUp

1. Ejecuta los siguientes comandos para instalar las dependencias:
    ```bash
    npm ci
    ```

2. Inicia el servidor en modo de desarrollo:
    ```bash
    npm run dev
    ```

3. Navega a `scripts/bin`:
    ```bash
    cd scripts/bin
    ```

4. Ejecuta el script de configuración:
    ```bash
    bash setup.sh
    ```
    - Selecciona la opción **1** para completar la configuración.

5. Espera a que el setup termine.

¡Ya estás listo para desarrollar!

---

Si deseas añadir algo más o modificar el flujo, no dudes en decírmelo.
