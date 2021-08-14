# Covid App
_Covid App es una aplicación para android que ayuda a llevar un control de tu estado de salud respecto al COVID-19, permitiendote realizar check ups de manera constante._

_Conoce más acerca de __[Covid App](https://covid.binaryfractal.com).___

## Pre-requisitos 📋

_El proyecto trabaja con firebase por lo que primero es necesario que genere un proyecto en __[Firesabe](https://firebase.google.com/).___

_Una vez generado el proyecto, deberá habilitar la __autenticación por correo electrónico__, __firestore__ y __functions.___

## Comenzando 🚀

_Es necesario instalar la ultima versión de firebase-tools._ 

```
npm i -g firebase-tools
```
_Deberás loguearte en firebase para permitir acceso a tus proyectos._

```
firebase login
```

_Una vez clonado el repositorio deberá ejecutar el siguiente comando sobre la raíz del proyecto._

```
firebase add
```

## Instalación🔧
En `covid-project-backend/functions` es necesario ejecutar el siguiente comando para obtener los paquetes del proyecto.

```
npm i
```
__Listo!!!__

## Deployment📦
_Para poder hacer el despliegue , debe posicionarse en `covid-project-backend/` y ejecutar los siguientes comandos dependiendo del elemento a desplegar._

_Para functions._
```
firebase deploy --only functions
```
_Para rules._
```
firebase deploy --only firestore:rules
```

## Construido con 🛠️

* [express] (https://expressjs.com/es/) _: El framework de node más utilizado. Es un framework mínimo y flexible que proporciona un conjunto robusto de características para las aplicaciones.  
* [nestjs] (https://nestjs.com/) _: Un framework de node progresivo para la creación de aplicaciones del lado del servidor eficientes, confiables y escalables._

## Versiones 📌
### Versión 1.0.0

## Autores 📖
* [César](https://www.linkedin.com/in/cesaralbertonavachavez)
* [René](https://www.linkedin.com/in/rene-santiago-resendiz)

- - -
__[binaryfractal](https://binaryfractal.com/)__  
