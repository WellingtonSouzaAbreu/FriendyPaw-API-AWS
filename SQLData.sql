-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: friend_paw
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adoptions`
--

DROP TABLE IF EXISTS `adoptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoptions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `dateAdoption` date NOT NULL,
  `adaptationPeriod` tinyint(1) DEFAULT '0',
  `collaboratorId` int unsigned NOT NULL,
  `animalId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoptions`
--

LOCK TABLES `adoptions` WRITE;
/*!40000 ALTER TABLE `adoptions` DISABLE KEYS */;
INSERT INTO `adoptions` VALUES (30,'2022-02-03',0,70,28,14);
/*!40000 ALTER TABLE `adoptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal-pictures`
--

DROP TABLE IF EXISTS `animal-pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal-pictures` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `imageURL` varchar(100) NOT NULL,
  `animalId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal-pictures`
--

LOCK TABLES `animal-pictures` WRITE;
/*!40000 ALTER TABLE `animal-pictures` DISABLE KEYS */;
INSERT INTO `animal-pictures` VALUES (83,'1637607320557_1637430403977_dobermann.jpg',28),(85,'1637430462090_download.jpg',27),(86,'gato.jpg',29);
/*!40000 ALTER TABLE `animal-pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animals`
--

DROP TABLE IF EXISTS `animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animals` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `color` varchar(20) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `castrated` tinyint(1) DEFAULT '0',
  `specie` varchar(30) NOT NULL,
  `breed` varchar(10) NOT NULL DEFAULT 'Vira-lata',
  `surname` varchar(20) DEFAULT NULL,
  `sex` enum('M','F') NOT NULL,
  `othersCharacteristics` varchar(2000) DEFAULT NULL,
  `availableForAdoption` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animals`
--

LOCK TABLES `animals` WRITE;
/*!40000 ALTER TABLE `animals` DISABLE KEYS */;
INSERT INTO `animals` VALUES (27,'Azul','Lulu','2021-11-20',1,'Cão','Pitbull',NULL,'F','Ele é muito dócil, gosta de jogar bola e de correr atrás de gatos, principalmente os ranjados. Sempre que vai comer, deve-se manter distância para não ser atacado. Ele é bem territorial, mas não oferece risco algum à outros bichinhos ou crianças. Ele é muito dócil, gosta de jogar bola e de correr atrás de gatos, principalmente os ranjados. Sempre que vai comer, deve-se manter distância para não ser atacado. Ele é bem territorial, mas não oferece risco algum à outros bichinhos ou crianças. Ele é muito dócil, gosta de jogar bola e de correr atrás de gatos, principalmente os ranjados. Sempre que vai comer, deve-se manter distância para não ser atacado. Ele é bem territorial, mas não oferece risco algum à outros bichinhos ou crianças. Ele é muito dócil, gosta de jogar bola e de correr atrás de gatos, principalmente os ranjados. Sempre que vai comer, deve-se manter distância para não ser atacado. Ele é bem territorial, mas não oferece risco algum à outros bichinhos ou crianças.',1),(28,'Marron','Margarida','2021-11-20',1,'Cão','Golden',NULL,'F','Ele é Bomzinho',1),(29,'Preto','James','2022-10-10',1,'Gato','Seamês',NULL,'M','Ele mia',1);
/*!40000 ALTER TABLE `animals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaborators`
--

DROP TABLE IF EXISTS `collaborators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collaborators` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `city` varchar(40) NOT NULL,
  `cellNumber` varchar(20) NOT NULL,
  `dateOfBirth` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborators`
--

LOCK TABLES `collaborators` WRITE;
/*!40000 ALTER TABLE `collaborators` DISABLE KEYS */;
INSERT INTO `collaborators` VALUES (70,'Lucas Martins de Jesus','Rolim de Moura ','69984565241s','2000-11-20'),(72,'Wellington','Novo Horizonte','696969120','2022-02-23'),(73,'zé','New York','699928446','2022-02-23'),(74,'a','s','d','2022-02-23'),(75,'asd','ads','as','2022-02-23');
/*!40000 ALTER TABLE `collaborators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaborators-involveds-in-rescue`
--

DROP TABLE IF EXISTS `collaborators-involveds-in-rescue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collaborators-involveds-in-rescue` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `collaboratorId` int unsigned NOT NULL,
  `rescueId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborators-involveds-in-rescue`
--

LOCK TABLES `collaborators-involveds-in-rescue` WRITE;
/*!40000 ALTER TABLE `collaborators-involveds-in-rescue` DISABLE KEYS */;
/*!40000 ALTER TABLE `collaborators-involveds-in-rescue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(500) NOT NULL,
  `address` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `locale` varchar(200) DEFAULT NULL,
  `complaintType` varchar(15) NOT NULL,
  `city` varchar(40) NOT NULL,
  `district` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (11,'Tem um mendigo tentando come-lo','Av. das Primeras','2021-11-20',0,'Praca','Abandono','Novo Horizonte','Centro'),(12,'Ele esta machacado','Av. Peroval','2021-11-20',1,'Terreno baldio','Maus tratos','Novo Horizonte','Centro'),(13,'Cachorro amarrado','Av. Joaquin','2021-11-22',0,'Casa abandonada','Abandono','Novo Horizonte','Centro'),(14,'Cachorro amarrado','Av. Joaquin','2021-11-22',0,'Casa abandonada','Abandono','Novo Horizonte','Centro'),(15,'Foi oouco','Av oeboral','2022-01-15',0,'Casa abandonada','Maus tratos','Novo','Centro'),(16,'Sjsk','Js','2022-01-15',1,'Jsks','Abandono','Hd','Hs'),(17,'Foi clous','Qjxj','2022-01-15',1,'Centro','Maus tratos','Teste','Qwe');
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `costs-veterinaries`
--

DROP TABLE IF EXISTS `costs-veterinaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costs-veterinaries` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `veterinaryCareId` int unsigned NOT NULL,
  `medicament` varchar(50) NOT NULL,
  `value` float(7,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `costs-veterinaries`
--

LOCK TABLES `costs-veterinaries` WRITE;
/*!40000 ALTER TABLE `costs-veterinaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `costs-veterinaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(200) DEFAULT NULL,
  `date` date NOT NULL,
  `name` varchar(50) NOT NULL,
  `cellNumber` varchar(20) NOT NULL,
  `donationType` varchar(15) DEFAULT NULL,
  `donationReceived` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (51,'Meu filho','2022-02-24','Wellington Souza','+55 (69) 98449-8330','others',0),(52,'Colchao','2021-11-20','Wellington Souza','+55 (69) 98449-8330','others',1),(53,'Dipirona','2021-11-22','Lucas Martins','699928446599','medicines',1),(54,'Panos velhos','2021-11-22','Jaquieli Cristina','+55 (69) 99991-5685','others',0),(72,'asd','2022-02-24','sad','asd','medicines',0),(73,'das','2022-02-24','ads','sda','others',0),(74,'asdasd','2022-02-24','dsa','sad','others',0),(75,'asdasdasd','2022-02-24','Administrador','Admin','others',0),(76,'asdsadasd','2022-02-24','Administrador','Admin','others',0),(77,'asdasd','2022-02-24','Administrador','Admin','others',0),(78,'asdasd','2022-02-24','Administrador','Admin','others',0),(79,'asdasdasd','2022-02-24','Administrador','Admin','others',0),(80,'dasd','2022-02-24','Administrador','Admin','others',0),(81,'asdasd','2022-02-24','Administrador','Admin','others',0);
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interesteds-in-adoption`
--

DROP TABLE IF EXISTS `interesteds-in-adoption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interesteds-in-adoption` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(200) NOT NULL,
  `userId` int unsigned NOT NULL,
  `animalId` int unsigned NOT NULL,
  `verified` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interesteds-in-adoption`
--

LOCK TABLES `interesteds-in-adoption` WRITE;
/*!40000 ALTER TABLE `interesteds-in-adoption` DISABLE KEYS */;
INSERT INTO `interesteds-in-adoption` VALUES (24,'Sítio ',1,2,0),(26,'Hdjdkdkdkdkdkdkdjdkdndndkdndkdkdkdkekdkdkd eid did. Dod did did did dkd zkd wi',1,1,0),(30,'addsdds',11,1,0),(32,'Popp',11,2,0),(33,'Bonito',12,1,0),(34,'Ceu',13,1,0),(35,'Ceu',13,1,0),(36,'Ceu',13,1,0),(37,'Limpo e fechado',14,24,0),(38,'Fechado e limpo',14,26,0),(39,'Quintal fechado, sitio Quintal fechado, sitio Quintal fechado, sitio Quintal fechado, sitio Quintal fechado, sitio Quintal fechado, sitio Quintalado, siti',14,28,1),(40,'Grande e fechado',17,27,1),(41,'Oi\n',15,27,0);
/*!40000 ALTER TABLE `interesteds-in-adoption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interesteds-pictures`
--

DROP TABLE IF EXISTS `interesteds-pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interesteds-pictures` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `imageURL` varchar(100) NOT NULL,
  `interestedInAdoptionId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interesteds-pictures`
--

LOCK TABLES `interesteds-pictures` WRITE;
/*!40000 ALTER TABLE `interesteds-pictures` DISABLE KEYS */;
INSERT INTO `interesteds-pictures` VALUES (1,'1624732659842_20210625_124214.jpg',1),(2,'1624732987515_20210625_124214.jpg',1),(3,'1624734500374_guide02.jpg',1),(4,'1624734500458_guide01.jpg',1),(5,'1624734501021_guide02.jpg',1),(6,'1624734501177_guide01.jpg',1),(7,'1624734506411_guide01.jpg',1),(8,'1624734506356_guide02.jpg',1),(9,'1634588300326_IMG-20211018-WA0003.jpg',2),(10,'1634588621645_20211018_125728.jpg',10),(11,'1634588792358_IMG-20211018-WA0060.jpg',12),(12,'1634589067185_IMG-20211018-WA0061.jpg',18),(13,'1634589322986_IMG-20211018-WA0058.jpg',21),(14,'1634590784863_IMG-20211018-WA0068.jpg',21),(15,'1634591026102_IMG-20211018-WA0061.jpg',22),(16,'1634594913984_IMG-20211017-WA0006.jpg',23),(17,'1634596547306_IMG-20211014-WA0019.jpg',24),(19,'1637024352807_IMG-20211110-WA0001.jpg',26),(23,'1637091828912_20211114_215355.jpg',30),(25,'1637100330900_IMG-20211107-WA0001.jpg',32),(26,'1637369022981_IMG-20211106-WA0002.jpg',33),(27,'1637412579870_IMG-20211106-WA0002.jpg',34),(28,'1637412579874_IMG-20211102-WA0002.jpg',34),(29,'1637412580002_IMG-20211102-WA0002.jpg',35),(30,'1637412579950_IMG-20211106-WA0002.jpg',35),(31,'1637412580081_IMG-20211106-WA0002.jpg',36),(32,'1637412580522_IMG-20211102-WA0002.jpg',36),(33,'1637418966978_20210802_154021.jpg',37),(34,'1637420094230_20211101_105430_Burst02.jpg',38),(35,'1637433988480_IMG-20211107-WA0001.jpg',39),(36,'1637607810252_IMG-20211116-WA0012.jpg',40),(37,'1637607810292_IMG-20211116-WA0011.jpg',40),(38,'1642277055848_IMG_20220106_211734_749.jpg',41);
/*!40000 ALTER TABLE `interesteds-pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publications`
--

DROP TABLE IF EXISTS `publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `startDateTime` datetime NOT NULL,
  `endDateTime` datetime NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(40) DEFAULT NULL,
  `publicationType` enum('event','done') NOT NULL,
  `district` varchar(30) DEFAULT NULL,
  `animalName` varchar(50) DEFAULT NULL,
  `history` text,
  `reasonRescue` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publications`
--

LOCK TABLES `publications` WRITE;
/*!40000 ALTER TABLE `publications` DISABLE KEYS */;
INSERT INTO `publications` VALUES (10,'2022-03-01 02:19:00','2023-03-10 00:15:00','Feira de Liquidação','Venha comprar cães adultos a Venha comprar cães adultos a Venha comprar cães adultos a Venha comprar cães adultos a Venha comprar cães adultos a Venha comprar cães adultos a Venha comprar cães adultos a Venha comprar cães adultos a Venha comprar cães adultos a Venha comprar cães adultos aVenha comprar cães adultos aVenha comprar cães adultos aVenha comprar cães adultos aVenha comprar cães adultos a Venha comprar cães adultos a  Venha comprar cães adultos a Venha comprar cães adultos a','Centro da cidade','Av. Castelo Branco','Alta Floresta D\'Oeste','event','Princesa Isabel',NULL,NULL,NULL),(11,'2022-01-25 05:24:00','2023-04-02 09:20:00','Bazar beneficente','Venha comprar coisas que você não precisa para nos ajudar!','Centro da cidade','Av. Castelo Branco','Nova Brasilândia D\'Oeste','event','Princesa Isabel',NULL,NULL,NULL),(12,'2021-11-20 10:28:53','2022-04-03 04:20:00','A volta dos Querubins',NULL,NULL,NULL,NULL,'done',NULL,'Luna','Ele foi e depois voltou montado em um anjo','Sequestro'),(13,'2022-11-20 10:28:53','2022-09-03 04:20:00','Crime do Mozzarth',NULL,NULL,NULL,NULL,'done',NULL,'Mozzarth','Invasão de padaria e posse de sanduíche de presunto, e roubo de instrumentos musicais. Ele não ouviu a polícia chegando.','Assauto à pata armada');
/*!40000 ALTER TABLE `publications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publications-pictures`
--

DROP TABLE IF EXISTS `publications-pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publications-pictures` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `imageURL` varchar(100) NOT NULL,
  `publicationId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publications-pictures`
--

LOCK TABLES `publications-pictures` WRITE;
/*!40000 ALTER TABLE `publications-pictures` DISABLE KEYS */;
INSERT INTO `publications-pictures` VALUES (80,'1637419697088_dobermann.jpg',11),(81,'1637419697088_dobermann.jpg',11),(82,'1637420234959_images (1).jpg',12),(83,'1637420378637_images.jpg',13),(86,'1645739045584_Challenge.png',10);
/*!40000 ALTER TABLE `publications-pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remote-monitoring-pictures`
--

DROP TABLE IF EXISTS `remote-monitoring-pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `remote-monitoring-pictures` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `imageURL` varchar(100) NOT NULL,
  `remoteMonitoringId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remote-monitoring-pictures`
--

LOCK TABLES `remote-monitoring-pictures` WRITE;
/*!40000 ALTER TABLE `remote-monitoring-pictures` DISABLE KEYS */;
INSERT INTO `remote-monitoring-pictures` VALUES (36,'1637420517037_IMG-20211119-WA0000.jpg',18),(37,'1637420776876_20211114_215355.jpg',19),(38,'1637433803854_IMG-20211107-WA0001.jpg',20),(39,'1637433803843_IMG-20211109-WA0000.jpg',20),(40,'1637433803897_Screenshot_2021-11-06-20-21-09.png',20),(41,'1637609408549_IMG-20211121-WA0001.jpg',21);
/*!40000 ALTER TABLE `remote-monitoring-pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remote-monitorings`
--

DROP TABLE IF EXISTS `remote-monitorings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `remote-monitorings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `observations` varchar(200) DEFAULT NULL,
  `adoptionId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remote-monitorings`
--

LOCK TABLES `remote-monitorings` WRITE;
/*!40000 ALTER TABLE `remote-monitorings` DISABLE KEYS */;
INSERT INTO `remote-monitorings` VALUES (18,'2021-11-20','8Ela anda comendo chinelos, mas está saludable',26),(19,'2021-11-20','Ela t beleza',26),(20,'2021-11-20','Ele anda muito eltrico',27),(21,'2021-11-22','Ela anda muito eletrca',29);
/*!40000 ALTER TABLE `remote-monitorings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rescues`
--

DROP TABLE IF EXISTS `rescues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rescues` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `forwardedToKennel` tinyint(1) DEFAULT '0',
  `dateOfRescue` date NOT NULL,
  `policeSupport` tinyint(1) DEFAULT '0',
  `locale` varchar(100) DEFAULT NULL,
  `BONumber` varchar(60) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `veterinaryCareId` int unsigned DEFAULT NULL,
  `animalId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rescues`
--

LOCK TABLES `rescues` WRITE;
/*!40000 ALTER TABLE `rescues` DISABLE KEYS */;
INSERT INTO `rescues` VALUES (17,1,'2021-11-20',0,'Terreno abandonado','69247024101','Av. Perobal',71,24);
/*!40000 ALTER TABLE `rescues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temporary-homes`
--

DROP TABLE IF EXISTS `temporary-homes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temporary-homes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `adopterName` varchar(50) NOT NULL,
  `cellNumber` varchar(20) NOT NULL,
  `animalId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temporary-homes`
--

LOCK TABLES `temporary-homes` WRITE;
/*!40000 ALTER TABLE `temporary-homes` DISABLE KEYS */;
INSERT INTO `temporary-homes` VALUES (29,'2021-11-20','Gabriel de Souza','69984465997',24),(43,'2022-04-02','3adad','2312',29);
/*!40000 ALTER TABLE `temporary-homes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `cellNumber` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `houseNumber` varchar(10) DEFAULT NULL,
  `city` varchar(40) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `district` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (8,'Administrador','Admin','$2a$10$EbrXvE3Xg/JaEEV3v4qMHuufrWxQ3OlE.rW8YWOH.xXQ8pRNy5Ge6',NULL,NULL,NULL,'wellingtonsouza6300@gmail.com',NULL,NULL),(14,'Wellington Souza','+55 (69) 98449-8330','$2a$10$G97bsTBc3fpvJDBe875f.O1iKSSywa8uqR9WwVGEUPaB0WpSjF.LG','Honorato','555','Rolim','wellington@gmail.com','','Centro'),(15,'Wellington Souza Abreu','+55 (69) 99284-6582','$2a$10$wkZ0affuM1jairq4V7.zX.LV2rFxO24yNo0hxXzFfbE1H35nBTSFG','','3326','New Horiaint','wellingtonsouza6300@gmail.com',NULL,'Centeo'),(16,'Lucas','+55 (69) 99846-3562','$2a$10$QiYDAWs0f3l4uPFmjKpneekQOWXWM6wbtE2wl4GS8D6hI43jdvsKe',NULL,NULL,NULL,NULL,NULL,NULL),(17,'Jaquieli Cristina','+55 (69) 99991-5685','$2a$10$PW0Un9WU2NneT156iKpTo.8G6n8rpM583K7oaPCn8M3pLrCbZcKPe','Av. Jk','5555','Rolim de Moura','lucas.martins.jss@gmail.com',NULL,'Centro'),(18,'Ggg','+55 (69) 99284-6581','$2a$10$90Xp/ldLn6WjZhHZkI4M2ezAPMqy9JEKjWFfdN4O6ObuvsubyVEyS',NULL,NULL,NULL,NULL,NULL,NULL),(19,'Tupio','+55 (69) 99284-6583','$2a$10$8zQWaBjgMmeYLrug0Zi9fuahoqVrdUoeK6JUmrqJQ3Ti6vSjwjsRS',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veterinary-cares`
--

DROP TABLE IF EXISTS `veterinary-cares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veterinary-cares` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `needOfHospitalization` tinyint(1) DEFAULT '0',
  `needOfMedication` tinyint(1) DEFAULT '0',
  `dateOfVeterinaryCare` date NOT NULL,
  `totalCostOfTreatment` float(7,2) DEFAULT NULL,
  `anamnese` varchar(1000) DEFAULT NULL,
  `veterinaryName` varchar(50) NOT NULL,
  `animalId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veterinary-cares`
--

LOCK TABLES `veterinary-cares` WRITE;
/*!40000 ALTER TABLE `veterinary-cares` DISABLE KEYS */;
INSERT INTO `veterinary-cares` VALUES (1,0,0,'2021-11-20',550.00,'Saudável','Dra. Keila Noronha',24),(72,0,0,'2021-11-20',10.00,'Saudável','Dra. Keila Ferreira',25),(73,0,0,'2021-11-20',500.00,'Corte magnífico','Dra. Keila Ferreira',26),(74,0,0,'2021-11-20',222.00,'Morrendo!','Sra. Keila',27),(75,0,0,'2021-11-20',222.00,'Saudável','Sra. Keila',28),(76,1,1,'2021-11-22',500.00,'Saudável','Dr. Lucas',30),(77,1,1,'2021-11-22',500.00,'Observação','Dr. Lucas',30),(78,0,0,'2022-02-23',222.00,'asdasd','asdwd',31),(82,0,0,'2022-02-23',222.00,'asd','asdwd',27),(83,0,0,'2022-02-23',222.00,'asdasd','asdwd',32),(84,0,0,'2022-02-23',332.00,'sdfsdf','asdd',33),(85,0,0,'2022-03-03',45.00,'Bão xi bão xi bão bão bão','Zé pinguelo',27);
/*!40000 ALTER TABLE `veterinary-cares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visits` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `report` varchar(2000) NOT NULL,
  `date` date NOT NULL,
  `adoptionId` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
INSERT INTO `visits` VALUES (1,'legal','2021-02-02',1),(2,'Foi louco','2021-10-09',2),(6,'Foi louco pra cacete','2021-10-14',3),(7,'Foi louco de mais','2021-10-14',3),(8,'Foi louco','2021-10-15',1),(9,'Foi louco','2021-11-06',3),(10,'Foi louco','2021-11-06',3),(11,'Ela anda bem, só come Marshmallow','2021-11-20',26),(12,'Ele anda bem','2021-11-22',28);
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-02 10:49:26
