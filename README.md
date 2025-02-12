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


Si deseas aportar alguna idea, sugerencia o realizar modificaciones al flujo, no dudes en compartirlo. Cualquier aporte será bienvenido para mejorar el proyecto uwu.

## Seguridad

Los correos electrónicos ingresados **no se almacenan en texto plano**, sino que se guardan como un hash usando el algoritmo Hash256. Esto asegura que, en caso de una filtración de datos, los correos no sean legibles, evitando el uso indebido de los mismos, para spam masivo en la universidad.

Las contraseñas son encriptadas utilizando un **salt de 10 pasos**, lo que agrega una capa adicional de seguridad.

Los **tokens de autenticación** emplean un sistema de versiones. Esto significa que, al cambiar la contraseña de un usuario, el token anterior se invalida, garantizando que nadie pueda seguir utilizando el acceso con credenciales obsoletas, incluso si el token ha sido comprometido previamente.
