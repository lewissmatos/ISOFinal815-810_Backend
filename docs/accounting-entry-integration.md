# Guia de Integracion de Asientos Contables

## Resumen

Este documento explica como cada sistema auxiliar puede autenticarse contra la API de ISO Backend y crear asientos contables. Compartelo con cada socio para que puedan completar la integracion por su cuenta.

## Prerrequisitos

- URL base del despliegue, referenciada como `https://<host>` en este documento.
- Usuario y contrasena unicos emitidos por sistema auxiliar.
- Mapeo de los IDs de cuentas contables permitidas.
- Servidor configurado con las variables de entorno necesarias (principalmente `AUTH_TOKEN_SECRET` y los datos de base de datos).

## Paso 1. Autenticarse

Envie una solicitud `POST /api/v1/auth/login` con las credenciales asignadas.

```bash
curl -X POST https://<host>/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
        "username": "aux-demo",
        "password": "ISO815810"
      }'
```

**Respuesta exitosa**

```json
{
	"isOk": true,
	"message": "Authentication successful",
	"data": {
		"token": "<jwt-token>",
		"auth": {
			"username": "aux-demo",
			"auxiliarySystem": {
				"id": 3,
				"name": "Demo Auxiliary"
			}
		}
	}
}
```

Guarde el valor de `token`; es obligatorio en cada llamada posterior. Si un socio recibe respuestas HTTP 401, pida que repita este paso para obtener un token nuevo.

## Paso 2. Autorizar solicitudes

Incluya el token en cada solicitud agregando el encabezado:

```
Authorization: Bearer <token>
```

Incluya siempre `Content-Type: application/json` para los cuerpos JSON. No se requieren cookies ni encabezados adicionales.

## Paso 3. Crear asientos contables

Llame a `POST /api/v1/accounting-entries` usando el token. Proporcione los siguientes campos (todos simples, sin objetos anidados):

| Campo               | Tipo            | Requerido | Notas                                                             |
| ------------------- | --------------- | --------- | ----------------------------------------------------------------- |
| `description`       | string          | Si        | Descripcion libre del asiento.                                    |
| `accountId`         | number o string | Si        | Identificador de la cuenta contable vinculada.                    |
| `movementType`      | string          | Si        | Use `"DB"` para debito o `"CR"` para credito.                     |
| `amount`            | number o string | Si        | Acepta numero o texto numerico; se normaliza a decimal.           |
| `entryDate`         | string          | No        | Fecha ISO `YYYY-MM-DD`; por defecto se usa la fecha del servidor. |
| `transactionStatus` | string          | No        | Por defecto `"R"`.                                                |

No envie identificadores `auxiliaryId` ni `auxiliary`; el servidor vincula el asiento al sistema auxiliar segun el token autenticado.

**Solicitud de ejemplo**

```bash
curl -X POST https://<host>/api/v1/accounting-entries \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
        "description": "Compra orden 123",
        "accountId": 201,
        "movementType": "DB",
        "amount": "1250.75",
        "entryDate": "2025-11-16"
      }'
```

**Respuesta exitosa**

```json
{
	"id": 42,
	"description": "Compra orden 123",
	"movementType": "DB",
	"amount": 1250.75,
	"entryDate": "2025-11-16",
	"transactionStatus": "R",
	"account": {
		"id": 201
	},
	"auxiliary": {
		"id": 3
	},
	"createdAt": "2025-11-16T12:34:56.000Z",
	"isActive": true
}
```

## Paso 4. Verificar o consultar asientos

Use `GET /api/v1/accounting-entries` para revisar los registros creados. Filtros disponibles:

- `accountId`: filtra por identificador de cuenta.
- `auxiliaryId` o `auxiliarySystemId`: restringe a un sistema auxiliar especifico (aplicado automaticamente segun el token).
- `movementType`: `DB` o `CR`.
- `startDate`/`endDate`: filtra por rango inclusivo.
- `entryDate`: coincide exactamente una fecha.

**Solicitud de ejemplo**

```bash
curl https://<host>/api/v1/accounting-entries?startDate=2025-11-01&endDate=2025-11-30 \
  -H 'Authorization: Bearer <token>'
```

La respuesta incluye la lista de asientos contables que cumplen los filtros, junto con los objetos `account` y `auxiliary` relacionados.

## Paso 5. Resolucion de problemas

- **401 Unauthorized**: Token ausente o vencido. Repita el paso de inicio de sesion.
- **400 Bad Request**: Cuerpo invalido (faltan campos obligatorios, movimiento incorrecto o cuenta inexistente). Revise la solicitud y el mensaje de error.
- **404 Not Found**: La cuenta o el sistema auxiliar referenciado no existe o esta inactivo.
- **500 Server Error**: Comparta timestamp, payload y respuesta con el equipo backend para investigacion.

## Endpoints de consulta utiles

- `GET /api/v1/accounts`: Obtiene el catalogo de cuentas (admite `?active=true`).
- `GET /api/v1/auxiliary-systems`: Obtiene la lista de sistemas auxiliares.

Comparta estos endpoints con socios que necesiten consultar IDs de referencia de forma programatica.
