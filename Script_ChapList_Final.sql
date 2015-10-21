-- MySQL Script generated by MySQL Workbench
-- dom 18 oct 2015 20:16:26 CST
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema ChapList_DB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ChapList_DB` ;

-- -----------------------------------------------------
-- Schema ChapList_DB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ChapList_DB` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `ChapList_DB` ;

-- -----------------------------------------------------
-- Table `ChapList_DB`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ChapList_DB`.`usuario` ;

CREATE TABLE IF NOT EXISTS `ChapList_DB`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `nombre` VARCHAR(45) NOT NULL COMMENT '',
  `apellido` VARCHAR(45) NOT NULL COMMENT '',
  `nick` VARCHAR(45) NOT NULL UNIQUE COMMENT '',
  `correo` VARCHAR(100) NOT NULL UNIQUE COMMENT '',
  `pass` binary(16) NOT NULL COMMENT '',
  `fechaNac` DATE NULL COMMENT '',
  `sexo` int(1) NULL COMMENT '',
  PRIMARY KEY (`idusuario`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ChapList_DB`.`tipo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ChapList_DB`.`tipo` ;

CREATE TABLE IF NOT EXISTS `ChapList_DB`.`tipo` (
  `idtipo` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `nombre` VARCHAR(45) NOT NULL COMMENT '',
  `descripcion` VARCHAR(100) NULL COMMENT '',
  PRIMARY KEY (`idtipo`)  COMMENT '')
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ChapList_DB`.`listas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ChapList_DB`.`listas` ;

CREATE TABLE IF NOT EXISTS `ChapList_DB`.`listas` (
  `idlistas` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `nombre` VARCHAR(45) NOT NULL COMMENT '',
  `descripcion` VARCHAR(100) NULL COMMENT '',
  `fecha` VARCHAR(45) NULL COMMENT '',
  `usuario_idusuario` INT NOT NULL COMMENT '',
  PRIMARY KEY (`idlistas`)  COMMENT '',
  INDEX `fk_listas_usuario1_idx` (`usuario_idusuario` ASC)  COMMENT '',
  CONSTRAINT `fk_listas_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `ChapList_DB`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ChapList_DB`.`producto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ChapList_DB`.`producto` ;

CREATE TABLE IF NOT EXISTS `ChapList_DB`.`producto` (
  `idproducto` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `nombre` VARCHAR(45) NOT NULL COMMENT '',
  `tipo_idtipo` INT NOT NULL COMMENT '',
  `Imagen` VARCHAR(250) NULL COMMENT '',
  PRIMARY KEY (`idproducto`, `tipo_idtipo`)  COMMENT '',
  INDEX `fk_producto_tipo_idx` (`tipo_idtipo` ASC)  COMMENT '',
  CONSTRAINT `fk_producto_tipo`
    FOREIGN KEY (`tipo_idtipo`)
    REFERENCES `ChapList_DB`.`tipo` (`idtipo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ChapList_DB`.`compartir`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ChapList_DB`.`compartir` ;

CREATE TABLE IF NOT EXISTS `ChapList_DB`.`compartir` (
  `listas_idlistas` INT NOT NULL COMMENT '',
  `usuario_idusuario` INT NOT NULL COMMENT '',
  PRIMARY KEY (`listas_idlistas`, `usuario_idusuario`)  COMMENT '',
  INDEX `fk_compartir_usuario1_idx` (`usuario_idusuario` ASC)  COMMENT '',
  CONSTRAINT `fk_compartir_listas1`
    FOREIGN KEY (`listas_idlistas`)
    REFERENCES `ChapList_DB`.`listas` (`idlistas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compartir_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `ChapList_DB`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ChapList_DB`.`lista_producto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ChapList_DB`.`lista_producto` ;

CREATE TABLE IF NOT EXISTS `ChapList_DB`.`lista_producto` (
  `cantidad` INT NULL COMMENT '',
  `precio_unidad` DECIMAL(10,0) NULL COMMENT '',
  `descripcion` VARCHAR(45) NULL COMMENT '',
  `producto_idproducto` INT NOT NULL COMMENT '',
  `listas_idlistas` INT NOT NULL COMMENT '',
  `check` BOOL  NULL COMMENT '',
  PRIMARY KEY (`producto_idproducto`, `listas_idlistas`)  COMMENT '',
  INDEX `fk_lista_producto_listas1_idx` (`listas_idlistas` ASC)  COMMENT '',
  CONSTRAINT `fk_lista_producto_listas1`
    FOREIGN KEY (`listas_idlistas`)
    REFERENCES `ChapList_DB`.`listas` (`idlistas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA CREAR USUARIOS
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.CREAR_USUARIO;
DELIMITER $
CREATE PROCEDURE CREAR_USUARIO(IN NOM VARCHAR(45),IN COR VARCHAR(100)
								,IN PASSW VARCHAR(45),NAC VARCHAR(100),nic VARCHAR(45)
								,IN SEX INT(1),IN APE VARCHAR(45)
							  )
BEGIN
	INSERT 
	INTO usuario(nombre,correo,pass,fechaNac,nick,sexo,apellido)
	VALUES(NOM,COR,unhex(md5(PASSW)),str_to_date(NAC, '%d/%m/%Y'),nic,SEX,APE);
	-- SELECT 'EL USUARIO SE REGISTRO CORRECTAMENTE ' AS MENSAJE;
END $

-- CALL CREAR_USUARIO("PRUEBA","PRUEBA@GMAIL.COM","hd","10/06/1993","pr");

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA LOGEO DE  USUARIOS
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.LOGIN;
$
CREATE PROCEDURE LOGIN(IN COR VARCHAR(45),IN PASSW VARCHAR(45),NIC VARCHAR(45))
BEGIN
	IF (!(COR = '')) 
		THEN SELECT idusuario,nick 
			 FROM usuario 
			 WHERE COR=correo 
			 AND  unhex(md5(PASSW))=PASS;
	ELSEIF (!(NIC ='')) 
		THEN SELECT idusuario,nick
			 FROM usuario 
			 WHERE NIC=nick 
			 AND unhex(md5(PASSW))=PASS;
	ELSE
		 SELECT '-1' as idusuario; 
	End if;
END $

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA CREAR CATEGORIAS
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.CREAR_TIPO;
$
CREATE PROCEDURE CREAR_TIPO(IN NOM VARCHAR(45),IN DES VARCHAR(100))
BEGIN
		INSERT 
		INTO tipo (nombre,descripcion)
		VALUES (NOM,DES);
END $

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA CREAR PRODUCTOS
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.CREAR_PRODUCTO;
$
CREATE PROCEDURE CREAR_PRODUCTO(IN NOM VARCHAR(45),IN IMG VARCHAR(100),IN TIPO INT)
BEGIN
		INSERT 
		INTO producto (nombre,Imagen,tipo_idtipo)
		VALUES (NOM,IMG,TIPO);
END $

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA CREAR LISTAS 
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.CREAR_LISTA;
$
CREATE PROCEDURE CREAR_LISTA(IN NOM VARCHAR(45),IN DES VARCHAR(100),FEC VARCHAR(45),IN USR INT)
BEGIN
	INSERT 
	INTO listas (nombre,descripcion,fecha,usuario_idusuario)
	VALUES (NOM,DES,str_to_date(FEC, '%d/%m/%Y'),USR);
-- 	SELECT 'La lista se creo con exito' AS Mensaje;
END $

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA OBTENER LISTAS DE USUARIO
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.GET_LISTAS;
$
CREATE PROCEDURE GET_LISTAS(IN USR INT)
BEGIN
		SELECT idlistas,nombre,descripcion,fecha 
		FROM listas 
		WHERE usuario_idusuario = USR;
END $

-- --------------------------------------------------------------------
-- PROCEDIMIENTO PARA OBTENER PRODUCTOS POR LISTA O TODOS LOS PRODUCTOS
-- --------------------------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.GET_PRODUCTOS;
$
CREATE PROCEDURE GET_PRODUCTOS(IN LISTA INT)
BEGIN
		IF (LISTA = '')
			THEN  SELECT P.nombre AS producto, T.nombre AS categoria 
				  FROM producto P, tipo T 
				  WHERE P.tipo_idtipo = T.idtipo;
		ELSE 
			SELECT P.nombre AS producto, T.nombre AS categoria, LP.cantidad, LP.precio_unidad,
			LP.descripcion
			FROM producto P, tipo T, lista_producto LP, listas L
			WHERE P.tipo_idtipo = T.idtipo  -- tipo producto con tipo
			AND L.idlistas = LP.listas_idlistas -- listas y listas de productos
			AND LP.producto_idproducto = P.idproducto -- productos con productos en lists
			AND LP.listas_idlistas = LISTA; -- Filtro por lista 
		END IF;
END $

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA AGREGAR PRODUCTOS A LISTA
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.ADD_PROD_LIST;
$
CREATE PROCEDURE ADD_PROD_LIST(IN LISTA INT,IN PROD INT,IN CAN INT,IN PREC decimal,
							   IN DES VARCHAR(45))
BEGIN
	INSERT 
	INTO lista_producto (cantidad,precio_unidad,descripcion,producto_idproducto,listas_idlistas)
	VALUES (CAN,PREC,DES,PROD,LISTA);
-- 	SELECT 'EL PRODUCTO SE AGREGO EXITOSAMENTE' AS Mensaje;
END $

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA ELIMINAR PRODUCTOS A LISTA
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.REMOVE_PROD_LIST;
$
CREATE PROCEDURE REMOVE_PROD_LIST(IN LISTA INT,IN PROD INT)
BEGIN
	DELETE
	FROM lista_producto 
	WHERE listas_idlistas = LISTA
	AND producto_idproducto = PROD;
-- 	SELECT 'EL PRODUCTO SE AGREGO EXITOSAMENTE' AS Mensaje;
END $

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA ELIMINAR PRODUCTOS A LISTA
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.UPDATE_PROD_LIST;
$
CREATE PROCEDURE UPDATE_PROD_LIST(IN LISTA INT,IN PROD INT,IN CAN INT,IN PREC decimal,
							   IN DES VARCHAR(45))
BEGIN
	UPDATE lista_producto
	SET cantidad = CAN, precio_unidad = PREC, descripcion = DES
	WHERE listas_idlistas = LISTA
	AND producto_idproducto = PROD;
-- 	SELECT 'EL PRODUCTO SE ACTUALIZO EXITOSAMENTE' AS Mensaje;
END $

-- -----------------------------------------------------
-- PROCEDIMIENTO PARA ACTUALIZAR ESTADO DE  PRODUCTOS EN LA LISTA
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS ChapList_DB.UPDATE_STATE_PROD_LIST;
$
CREATE PROCEDURE UPDATE_STATE_PROD_LIST(IN LISTA INT,IN PROD INT,IN CHK BOOL)
BEGIN
	UPDATE lista_producto
	SET `check` = CHK
	WHERE listas_idlistas = LISTA
	AND producto_idproducto = PROD;
-- 	SELECT 'EL PRODUCTO SE ACTUALIZO EXITOSAMENTE' AS Mensaje;
END $