# language: es
@checkout @smoke
Característica: Proceso de Checkout
  Como cliente de SauceDemo
  Quiero completar el proceso de checkout
  Para poder comprar los productos en mi carrito

  Antecedentes:
    Dado el usuario ha iniciado sesión con credenciales de usuario estándar
    Y el usuario ha agregado productos al carrito

  @positivo @critico @e2e
  Escenario: Completar el proceso de checkout exitosamente
    Cuando el usuario navega a la página del carrito
    Y el usuario procede al checkout
    Y el usuario completa la información de checkout:
      | firstName  | John    |
      | lastName   | Doe     |
      | postalCode | 12345   |
    Y el usuario continúa al resumen del checkout
    Y el usuario completa el checkout
    Entonces la orden debería ser confirmada exitosamente
    Y un mensaje de confirmación debería ser mostrado
    Y el encabezado de confirmación debería contener "Thank you for your order"

