USE ChapList_DB;

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA CREAR USUARIOS
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.PRUEBA_PROC;
DELIMITER $
CREATE PROCEDURE PRUEBA_PROC()
BEGIN
	DECLARE i INT DEFAULT 0;
-- CREACION DE USUARIOS
	WHILE i <= 10 DO
		CALL CREAR_USUARIO(CONCAT("PRUEBA",CAST(i as char(2))),CONCAT("PRUEBA",CAST(i as char(2))),"hd","10/06/1993",CONCAT("pr",CAST(i as char(2))),1,'APELLIDO');
      SET i=i+1;
	END WHILE;
	select * from usuario;
 -- 	CALL CREAR_USUARIO('PRUEBA0','PRUEBA0',"hd","10/06/1993",'H',1,'APELLIDO');
-- login con correo
	SET i=0;
	WHILE i <= 5 DO
-- CALL LOGIN(CONCAT("PRUEBA",CAST(i as char(2))),'hd','');
      SET i=i+1;
	END WHILE;
-- login con nick
	SET i=0;
	WHILE i <= 5 DO
		CALL LOGIN('','hd',CONCAT("pr",CAST(i as char(2))));
      SET i=i+1;
	END WHILE;
-- no login
	CALL LOGIN('PRUE','hd','');
	CALL LOGIN('PRUEBA0','had','');
	CALL LOGIN('','hd','');
	CALL LOGIN('','hd','PRUE');
-- creacion de tipos
	SET i=0;
	WHILE i <= 25 DO
		CALL CREAR_TIPO(CONCAT("TIPO",CAST(i as char(2))),CONCAT("TIPO",CAST(i as char(2))));
      SET i=i+1;
	END WHILE;
	SELECT * FROM tipo;
-- crear productos
	SET i=0;
	WHILE i <= 50 DO
		CALL CREAR_PRODUCTO(CONCAT("PRODUCTO",CAST(i as char(2))),CONCAT("IMG",CAST(i as char(2))),(SELECT FLOOR(1 + (RAND() * 5))));
      SET i=i+1;
	END WHILE;
	SELECT * FROM producto;
-- CREAR LISTAS
	SET i=0;
	WHILE i <= 50 DO
		CALL CREAR_LISTA(CONCAT("LISTA",CAST(i as char(2))),CONCAT("DES",CAST(i as char(2))),'10/06/1993',
						(SELECT FLOOR(1 + (RAND() * 5))));
      SET i=i+1;
	END WHILE;
	SELECT * FROM listas;
-- mostras listas de usuario
	SET i=0;
	WHILE i <= 3 DO
		CALL GET_LISTAS((SELECT FLOOR(1 + (RAND() * 5))));
      SET i=i+1;
	END WHILE;
-- obtener listas
	CALL GET_PRODUCTOS('');
	CALL GET_PRODUCTOS(3);
-- agregar productos a lista

	CALL ADD_PROD_LIST( 3 , 1 ,10 , 10 ,'DESCRIPCION' );
	CALL ADD_PROD_LIST( 3 , 2 ,10 , 10 ,'DESCRIPCION' );
	CALL ADD_PROD_LIST( 3 , 3 ,10 , 10 ,'DESCRIPCION' );
	CALL ADD_PROD_LIST( 3 , 4 ,10 , 10 ,'DESCRIPCION' );
	CALL ADD_PROD_LIST( 3 , 5 ,10 , 10 ,'DESCRIPCION' );
	CALL ADD_PROD_LIST( 3 , 6 ,10 , 10 ,'DESCRIPCION' );
	CALL ADD_PROD_LIST( 3 , 7 ,10 , 10 ,'DESCRIPCION' );
	SELECT * FROM lista_producto;

-- eliminar productos de lista
	CALL REMOVE_PROD_LIST(3,6);
	CALL GET_PRODUCTOS(3);
-- actualizar producto
	CALL UPDATE_PROD_LIST(3,7,11,11,'NUEVA DES');
	CALL GET_PRODUCTOS(3);
END $

CALL PRUEBA_PROC();