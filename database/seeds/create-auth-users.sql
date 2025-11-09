
DECLARE @DefaultPasswordHash NVARCHAR(60) = N'd70f9f53c58ab5252453a518783bf965e7f9ee8a3f2e2f56d15cb006777192cb';

WITH SeedData AS (
	SELECT 1 AS AuxiliaryId, N'Contabilidad' AS AuxiliaryName, N'contabilidad_user' AS Username UNION ALL
	SELECT 2, N'Nomina', N'nomina_user' UNION ALL
	SELECT 3, N'Facturacion', N'facturacion_user' UNION ALL
	SELECT 4, N'Inventario', N'inventario_user' UNION ALL
	SELECT 5, N'Cuentas por Cobrar', N'cxc_user' UNION ALL
	SELECT 6, N'Cuentas por Pagar', N'cxp_user' UNION ALL
	SELECT 7, N'Compras', N'compras_user' UNION ALL
	SELECT 8, N'Activos Fijos', N'activos_fijos_user' UNION ALL
	SELECT 9, N'Cheques', N'cheques_user'
)
MERGE dbo.auth AS target
USING (
	SELECT sd.AuxiliaryId, sd.Username
	FROM SeedData sd
	INNER JOIN dbo.auxiliary_systems aux ON aux.id = sd.AuxiliaryId
) AS source
ON target.auxiliaryId = source.AuxiliaryId
WHEN MATCHED THEN
	UPDATE SET
		target.username = source.Username,
		target.password = @DefaultPasswordHash
WHEN NOT MATCHED THEN
	INSERT (username, password, auxiliaryId)
	VALUES (source.Username, @DefaultPasswordHash, source.AuxiliaryId);

GO

PRINT 'Auth users seeded successfully.';
