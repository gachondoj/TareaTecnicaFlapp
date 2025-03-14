# TareaTecnicaFlapp

## Como correr:

### Opcion 1: Docker

1. Agregar llaves de apis Uder y TraeloYa a .env de BackEnd
````
UDER_KEY=[KEY]
TRAELO_KEY=[KEY]
````

2.  Crear imagenes
````
docker-compose up --build -d
````

3. Levantar contenedores
````
docker-compose up
````

### Opcion 2: Sin Docker

#### Front End

1. Instalar dependencias
````
npm install
````

2. Correr Programa
````
npm run dev
````

#### Back End

1. Instalar dependencias
````
npm install
````

2. Agregar llaves de apis Uder y TraeloYa a .env
````
UDER_KEY=[KEY]
TRAELO_KEY=[KEY]
````

3. Correr Programa
````
npm run dev
````

## Supuestos

1. Las tarifas entregadas por la tarificación de Traelo Ya eran demasiado altas por lo que se ajustaron para que calzaran con las de Uder en terminos de dimensiones (Dividir por 10.000.000).
