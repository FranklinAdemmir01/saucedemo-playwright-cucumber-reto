# language: es
@login @smoke
Característica: Autenticación de Usuario
  Como usuario de SauceDemo
  Quiero poder autenticarme con mis credenciales
  Para poder acceder a la aplicación y comprar productos

  Antecedentes:
    Dado el usuario navega a la página de login de SauceDemo

  @positivo @critico
  Escenario: Inicio de sesión exitoso con credenciales válidas de usuario estándar
    Cuando el usuario ingresa usuario "standard_user" y contraseña "secret_sauce"
    Y el usuario hace clic en el botón de login
    Entonces el usuario debería ser redirigido a la página de inventario
    Y la página de inventario debería mostrar productos

  @negativo @critico @C45075-oaklawn
  Escenario: Intento de inicio de sesión fallido con usuario bloqueado
    Cuando el usuario ingresa usuario "locked_out_user" y contraseña "secret_sauce"
    Y el usuario hace clic en el botón de login
    Entonces un mensaje de error debería ser mostrado
    Y el mensaje de error debería contener "Epic sadface: Sorry, this user has been locked out."

