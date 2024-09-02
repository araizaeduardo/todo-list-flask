# todo-list-flask
# todo-list-flask

## Descripción del Proyecto

Este es un proyecto de lista de tareas avanzado desarrollado con Flask, SQLite y Bootstrap. La aplicación permite a los usuarios agregar, editar, eliminar y buscar tareas. Las tareas se pueden clasificar en diferentes estados: pendientes, en proceso, completadas y archivadas. La interfaz de usuario está diseñada con Bootstrap para proporcionar una experiencia de usuario moderna y receptiva.

## Características

- Agregar nuevas tareas con una fecha límite.
- Editar la fecha límite de las tareas.
- Cambiar el estado de las tareas (pendiente, en proceso, completada, archivada).
- Eliminar tareas.
- Buscar tareas por texto.
- Mostrar y ocultar tareas archivadas.
- Clonar tareas archivadas a pendientes.

## Requisitos

- Python 3.x
- Flask
- SQLite
- Bootstrap 5.1.3

## Instalación y Configuración

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local:

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/todo-list-flask.git
    cd todo-list-flask
    ```

2. Crea un entorno virtual y actívalo:
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
    ```

3. Instala las dependencias:
    ```bash
    pip install -r requirements.txt
    ```

4. Inicia la base de datos:
    ```bash
    python -c "from app import init_db; init_db()"
    ```

5. Ejecuta la aplicación:
    ```bash
    python app.py
    ```

6. Abre tu navegador y ve a `http://127.0.0.1:5000` para ver la aplicación en funcionamiento.

## Estructura del Proyecto

- `app.py`: Archivo principal de la aplicación Flask.
- `templates/`: Carpeta que contiene las plantillas HTML.
- `static/js/`: Carpeta que contiene los archivos JavaScript.
- `tasks.db`: Archivo de base de datos SQLite.

## Uso

1. En la página principal, puedes agregar una nueva tarea ingresando el texto y la fecha límite, y luego haciendo clic en "Agregar".
2. Las tareas se mostrarán en las listas correspondientes según su estado.
3. Puedes buscar tareas usando el campo de búsqueda en la parte superior.
4. Para cambiar el estado de una tarea, usa los botones correspondientes en cada tarea.
5. Para editar la fecha límite de una tarea, haz clic en "Editar Fecha".
6. Para eliminar una tarea, haz clic en "Eliminar".
7. Para mostrar u ocultar las tareas archivadas, usa el botón "Mostrar Archivo" o "Ocultar Archivo".

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor haz un fork del repositorio y envía un pull request con tus cambios.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
