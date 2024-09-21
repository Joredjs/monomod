# Definiciones

## Entidades

### Unidad residencial

- **Descripción**: hace referencia al a la mínima unidad habitable dentro de la propiedad horizontal, casa,apartamento,cabaña,etc
- **Nombre**: unidad

### Grupo residencial

- **Descripción**: hace referencia a un grupo de unidades residenciales (si aplica para la propiedad horizontal), torre, etapa, manzana, etc
- **Nombre**: grupo

### Propiedad horizontal

- **Descripción**: hace referencia al conjunto, edificio, etc. El cual es un grupo de unidades residenciales o un grupo de grupos residenciales, dependiendo como sea la taxonomía de la propiedad horizontal
- **Nombre**: conjunto

### Asamblea

- **Descripción**: reunion en la cual el usuario administrador puede crear una serie de preguntas y los residentes pueden votar por las opciones
- **Nombre**: asamblea

## Usuarios

### Residente

- **Descripción**: Habitante de la unidad residencial.
- **Nombre**: residente
- **Pertence a:** Unidad residencial

### Administrador

- **Descripción**: Administrador de la propiedad horizontal.
- **Nombre**: admin
- **Pertence a:** Propiedad horizontal

## Sistemas

### Interfaz de residente

- **Descripción**: Pagína web residentes.
- **Funcionalidades**:
  - Login (desde link)
  - Ver Asambleas activas
  - Ver preguntas por asamblea
  - Votar en una pregunta
  - Ver resumen de votación

### Interfaz de administrador

- **Descripción**: Pagína web administrador.
- **Funcionalidades**:
  - Login
  - CRUD Asambleas
  - CRUD preguntas por asamblea
  - Ver resumen de votación
