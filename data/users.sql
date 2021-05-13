-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: taipeiweb
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','test@test.com','test123','2021-05-08 12:12:05'),(2,'try','try@try.com','try','2021-05-11 14:14:04'),(3,'asas','try@tyr.com','4545','2021-05-11 21:23:59'),(4,'second','test@try.com','1234','2021-05-11 21:25:59'),(5,'test','test@test.testcom','4564','2021-05-11 21:26:43'),(6,'test','trytry@test.com','4564','2021-05-11 21:27:06'),(7,'test','test@est.com','45','2021-05-11 21:29:37'),(8,'dsd','test@est.coms','dsdsd','2021-05-11 21:56:34'),(9,'as','test@est.coma','sas','2021-05-11 23:37:25'),(10,'test1616','1616@test.com','12555','2021-05-12 00:48:05'),(11,'Pai','kkk@gmail.com','testpassword','2021-05-12 00:51:13'),(12,'中文','555@.cc.cc','5555','2021-05-12 00:52:54'),(13,'aaa','aa@aa.com','asas','2021-05-12 09:19:45'),(14,'qqq','qq@qq.com','qqq','2021-05-12 14:19:55'),(15,'final','final','sdsd','2021-05-13 11:42:40'),(16,'ff','ff@ff.com','ff','2021-05-13 11:56:45'),(17,'ff32','fff@ff.com','ff','2021-05-13 11:57:46'),(18,'123','fff@ff3.com','123','2021-05-13 11:58:02'),(19,'456','45@456.com','456','2021-05-13 11:59:11'),(20,'xu3','xius@jidsf.com','sd','2021-05-13 12:00:35'),(21,'df','d@df.com','df','2021-05-13 12:11:56'),(22,'test11','et@tet.com','etet','2021-05-13 12:28:26'),(23,'sdsd','sdsd@ssss.com','sdsd','2021-05-13 12:33:14'),(24,'sdsd','sds@qqq.com','sdsdsd','2021-05-13 12:36:32');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-13 13:24:50
