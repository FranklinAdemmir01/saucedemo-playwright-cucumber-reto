# language: es
@cart @smoke
Característica: Gestión del Carrito de Compras
  Como usuario registrado de SauceDemo
  Quiero gestionar los artículos en mi carrito de compras
  Para poder revisar mis selecciones antes del checkout

  Antecedentes:
    Dado el usuario ha iniciado sesión con credenciales de usuario estándar
    Y el usuario está en la página de inventario

  @positivo @critico
  Escenario: Agregar un solo producto al carrito de compras
    Cuando el usuario agrega "Sauce Labs Backpack" al carrito
    Entonces la insignia del carrito de compras debería mostrar "1"
    Y el producto "Sauce Labs Backpack" debería mostrarse como agregado

  @positivo
  Escenario: Ver el contenido del carrito de compras
    Cuando el usuario agrega "Sauce Labs Backpack" al carrito
    Y el usuario hace clic en el ícono del carrito de compras
    Entonces el usuario debería estar en la página del carrito
    Y el carrito debería contener 1 artículo
    Y el carrito debería mostrar "Sauce Labs Backpack"

