# NExpWS
## Back End

Hecho con:
[![](https://raw.githubusercontent.com/DigiChanges/node-experience/cadad09988e2b242ed3f964044eb14abd0d4eba3/NExp.svg)](https://github.com/DigiChanges/node-experience)

### **Tabla de Contenidos**
1. [Actores](#actores-)
2. [Fases de los sprints](#fases-de-los-sprints-)
3. [Aspectos funcionales](#aspectos-funcionales-)
4. [Aspectos Tecnicos](#aspectos-tecnicos-)
5. [Primeros Pasos](#primeros-pasos)
6. [Instalaci贸n](#instalacion)
7. [Puesta en marcha](#puesta-en-marcha)
8. [Pruebas unitarias](#pruebas-unitarias)

# **ACTORES 馃懃**

* Roxnny Barrios / Desarrollador Backend / rbarrios@wingsoft.com

## **FASES DE LOS SPRINTS 馃搮**
- [x] Inicio
- [x] Planificaci贸n y estimaci贸n
- [x] Desarrollo
- [x] Revisi贸n y restrospectiva
- [x] Entrega

# **ASPECTOS FUNCIONALES 馃搵**

#### - Objetivo General:


#### - Objetivos Espec铆ficos:


#### - A qui茅n va dirigido:

# **ASPECTOS T脡CNICOS 馃洜**

Este es un servicio construido monol铆ticamente con la intenci贸n de administrar todas aquellas peticiones salientes desde los clientes definidos haciendo uso de tecnolog铆as vanguardistas que complementan al lenguaje con el que se encuentra construido.

Este servicio se encuentra dividido por diferentes dominios que forman parte de la l贸gica de negocio:

- App
- Auth
- Crypted
- File
- Log
- Notification
- Role
- User

A demas de dos casos particulares:

- Config
- Shared

### Estructura basica de carpetas para un dominio.
```sh 
鈹溾攢鈹? Domain
鈹?   鈹溾攢鈹? Entities
鈹?   鈹溾攢鈹? Exceptions
鈹?   鈹溾攢鈹? Payloads
鈹?   鈹溾攢鈹? Services
鈹?   鈹斺攢鈹? UseCases
鈹溾攢鈹? Infrastructure
鈹?   鈹溾攢鈹? Repositories
鈹?   鈹溾攢鈹? Schema
鈹?   鈹溾攢鈹? Services
鈹?   鈹斺攢鈹? Seeds
鈹溾攢鈹? InterfaceAdapters
鈹溾攢鈹? Presentation
鈹?   鈹溾攢鈹? Commands
鈹?   鈹溾攢鈹? Controllers
鈹?   鈹溾攢鈹? Criterias
鈹?   鈹溾攢鈹? Exceptions
鈹?   鈹溾攢鈹? Handlers
鈹?   鈹溾攢鈹? Middlewares
鈹?   鈹溾攢鈹? Requests
鈹?   鈹斺攢鈹? Transformers
鈹溾攢鈹? Tests
 ```

```mermaid
sequenceDiagram
participant C as Client 
participant S as Server

C--)S: Request
activate S

S--)C: Response
deactivate S
```

```mermaid
sequenceDiagram
participant C as Client 
participant P as Presentation 
participant D as Domain
participant I as Infrastructure

C--)P: Request
activate P

P-)D: Payload
activate D

D-)I: IDomain
activate I

I-)D: IDomain
deactivate I

D-)P: IDomain
deactivate D

P--)C: Response 
deactivate P

```

### Plataforma Tecnol贸gica:
* Tipo de Aplicaci贸n: **API REST**
* Framework de Desarrollo: **NExp**
* Servidor de Aplicaciones: **por definir**
* Servidor de Base de Datos: **PostgreSql - MongoDB**
* Lenguaje de Programaci贸n: **Node js - Typescript.**
* Arquitectura: **Hexagonal**


# PRIMEROS PASOS

Clonar el repositorio:

```
$ git clone <URL>
```
Configura tu usuario y contrase帽a y presiona enter. Luego entra a la carpeta ```<FOLDER>```

```sh
cd <FOLDER>
```

# INSTALACION

El servicio require:

1. [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
2. [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
3. [Lazydocker](https://github.com/jesseduffield/lazydocker)

# PUESTA EN MARCHA

Ejecute el siguiente comando en su terminal de preferencia para inciar en alguno de los siguientes modos.

```bash
# local mode
$ make loc

# development mode
$ make dev

# production mode
$ make prod
```

### Variables de entorno
```sh
# Set to production when deploying to production
NODE_ENV
NODE_PATH

SET_COOKIE_SECURE
SET_COOKIE_SAME_SITE

# Node.js server configuration
SERVER_PORT

# Database configuration
DB_HOST
DB_HOST_MONGO
DB_USER
DB_DATABASE
DB_PASSWORD
DB_PORT
DB_PORT_MONGO
DB_SYNCHRONIZE
DB_TYPE_DEFAULT
# Type only SQL
DB_TYPE

CACHE_HOST
CACHE_PORT
CACHE_PASSWORD

MINIO_HOST
MINIO_ACCESS_KEY
MINIO_SECRET_KEY
MINIO_USE_SSL
MINIO_PORT
MINIO_PUBLIC_BUCKET
MINIO_PRIVATE_BUCKET
MINIO_ROOT_PATH
MINIO_REGION
FILESYSTEM_DEFAULT

TZ

JWT_SECRET
JWT_EXPIRES
JWT_ISS
JWT_AUD

SMTP_HOST
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
SMTP_SECURE_SSL
SMTP_SENDER_NAME
SMTP_SENDER_EMAIL_DEFAULT

URL_API
URL_WEB

AUTHORIZATION

PRODUCT_NAME

ENCRYPTION_DEFAULT

EXECUTE_CRONS

PUSH_PUBLIC_KEY
PUSH_PRIVATE_KEY

LOCALE

SYMMETRIC_KEY
```

# PRUEBAS UNITARIAS

NexpWS usa Jest para correr las pruebas unitarias. Puedes correrlas todas o espec铆ficas.

1. Para correrla todas:
    ```bash
    # unit tests
    $ yarn test
    ```

2. Para correr cada una individual:
    ```sh
     # unit tests
     yarn test <PATH_OF_YOUR_ROOT_FOLDER>
    ```
