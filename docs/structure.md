# Estructura

La arquitectura principal usada en la mayoría de librerías es la arquitectura hexagonal o *ports & adapters*. Cada librería que use esta arquitectura debe contener las siguientes carpetas (capas):

* application
* domain
* infra

La estructura del sitio se divide El monorepo se divide en 2 capas de abstracción **apps** y **libs**

## Apps

Están los proyectos que se pueden "servir", es decir, ejecutar por si solos para ver el resultado de este, un ejemplo puede ser el uso del comando `nx serve`, se divide en 2 según su funcionalidad: **back** y **front**

### Back

El back está pensando para que se sirva en "microservicios", estas apps deben estar desacopladas a cualquier framewor de desarrollo de backend, cada *grupo de dominio* se debe servir en un app aparte.

* local: Servidor local en nodejs
* firebase: Servidor local/remoto configurado para firebase/google cloud functions

#### Front

* Usuario
* Admin
* Landing
  
## Libs

Están los módulos reutilizables tanto desde las apps como desde otros módulos, se dividen en 3 **core**, **front** y **modules**

### core(librerias)

#### express

Genera las microapps utilizando el framework express, se crea una microapp por cada *grupo de dominio*

#### main

Se encarga de generar el listado de rutas según cada *grupo de dominio* y exponerlas para su implementación en el framework correspondiente, estas rutas deben ser desacopladas a cualquier framework de desarrollo backend

Está librería se estructura bajo la arquitectura hexagonal, dentro de esta librería se encuentran los servicios(lógica) y las reglas de seguridad compartidos entre los diferentes módulos, estos servicios y reglas se inyectan a los modulos (via puerto y controlador respectivamente) para que puedan hacer uso de estos.

### modules

#### core(modulo)

En este módulo estan las reglas de dominio principales compartidos por todos los módulos, así como el *BaseController* el cual es controlador general del caul extienden todos los controladores de los otros módulos.

Los módulos diferentes a *modules-core* deben tener la siguiente estructura:

```markdown
./mymodule
├── src
| ├── application/
│ │ ├── useCases/
│ │ └── mymodule.port.ts
| ├── domain/
│ │ └── mymodule.routes.ts
│ ├── infra/
│ │ └── mymodule.controller.ts
└── ... (config files)

```

#### asamblea

#### conjunto

#### general

#### unidad

### front

#### services

#### components

#### styles

## Dependencias

Ejecutar `nx graph`

## faqs

libs/core/main puede depender de los modulos, pero los modulos no pueden depender de el

Del modules/core pueden depender los otros mudulos pero este no debe depender de los otros módulos, es decir modules/core debe poder funcionar solito sin los otros módulos

Como saber cuando va en libs/core/main o en /libs/modules/core
Si se usa en los modulos va en /libs/modules/core si no va en libs/core/main
