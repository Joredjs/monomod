# NXMS

Framework para desarrollar (en typescript) un monolito modular dentro de un monorepo que permite exponer cada módulo como microservicios independientes. Estos módulos son expuestos en nodejs, pero son independientes de frameworks (express,fastify,koa,nest.etc) e igualmente independiente a los proveedores de nubes donde se expongan estos microservicios (aws,google,azure,etc)

## Requerimientos

- [NX](https://nx.dev/) (^18.x.x): Sistema gestor de monorepo
- [NodeJS](https://nodejs.org/) (^22.x.x)
