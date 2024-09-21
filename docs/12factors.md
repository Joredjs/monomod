# 12 Factors

## Codebase

Monorepo gestionado con *NX*, con la siguiente estuctura

### Ramas

Se utliza como metódlogía de ramas *trunk based development* tomando ***main*** como rama base para los desarrollos

### Contenido

#### Apps

> Servidores:

- **local**: App básica que ejecuta localmente un servidor nodejs : `nx serve local`
- **firebase**: App básica que ejecuta localmente un servidor nodejs usando [firebase-functions](https://firebase.google.com/docs/functions?hl=es) : `nx serve fbfunc`

> Frameworks:

- **express**: Punto de entrada desde las apps de servidores hacia la lógica, usa [express](https://expressjs.com) como framework

> Lógica:

- **core**: Lógica de la aplicación

## Dependencies

En el package.json

## Config

Archivo .ENV

## Banking Services

N/A

## Build, Release, Run

TODO: Enable CI & CD

## Processes

Stateles processes

## Port Binding

Listado de puertos

## Concurrency

??

## Disposability

??

## Dev/Pord parity

N/A

## LOGS

N/A

## Admin Processes


 