/*
SQLyog Community v12.4.0 (64 bit)
MySQL - 10.4.10-MariaDB : Database - sehatq
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sehatq` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `sehatq`;

/*Table structure for table `ar_internal_metadata` */

DROP TABLE IF EXISTS `ar_internal_metadata`;

CREATE TABLE `ar_internal_metadata` (
  `key` varchar(255) CHARACTER SET utf8 NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `ar_internal_metadata` */

insert  into `ar_internal_metadata`(`key`,`value`,`created_at`,`updated_at`) values 
('environment','development','2019-12-20 06:26:38','2019-12-20 06:26:38');

/*Table structure for table `examination_schedule_users` */

DROP TABLE IF EXISTS `examination_schedule_users`;

CREATE TABLE `examination_schedule_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `examination_schedule_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `dayname` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `registration_date` date DEFAULT NULL,
  `no_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Data for the table `examination_schedule_users` */

insert  into `examination_schedule_users`(`id`,`examination_schedule_id`,`user_id`,`doctor_id`,`hospital_id`,`dayname`,`created_at`,`updated_at`,`registration_date`,`no_order`) values 
(1,2,1,4,3,'sunday','2019-12-22 06:43:50','2019-12-22 06:43:50','2019-12-22',1);

/*Table structure for table `examination_schedules` */

DROP TABLE IF EXISTS `examination_schedules`;

CREATE TABLE `examination_schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `quota` int(11) DEFAULT NULL,
  `dayname` varchar(255) DEFAULT NULL,
  `time_start` time DEFAULT NULL,
  `time_end` time DEFAULT NULL,
  `close_register` time DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `hospital_user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

/*Data for the table `examination_schedules` */

insert  into `examination_schedules`(`id`,`user_id`,`room_id`,`hospital_id`,`quota`,`dayname`,`time_start`,`time_end`,`close_register`,`created_at`,`updated_at`,`hospital_user_id`) values 
(1,3,3,2,15,'sunday','14:00:00','16:00:00','13:30:00','2019-12-22 05:09:41','2019-12-22 05:09:41',2),
(2,4,2,3,10,'sunday','17:00:00','19:00:00','16:30:00','2019-12-22 05:23:21','2019-12-22 05:23:21',1);

/*Table structure for table `hospital_users` */

DROP TABLE IF EXISTS `hospital_users`;

CREATE TABLE `hospital_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `poly_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `hospital_users` */

insert  into `hospital_users`(`id`,`hospital_id`,`user_id`,`status`,`created_at`,`updated_at`,`poly_id`) values 
(1,3,4,NULL,'2019-12-22 03:57:37','2019-12-22 04:01:06',6),
(2,2,3,NULL,'2019-12-22 04:01:42','2019-12-22 04:01:42',2),
(3,3,3,NULL,'2019-12-22 04:02:02','2019-12-22 04:02:02',4);

/*Table structure for table `hospitals` */

DROP TABLE IF EXISTS `hospitals`;

CREATE TABLE `hospitals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `hospitals` */

insert  into `hospitals`(`id`,`name`,`phone`,`address`,`created_at`,`updated_at`) values 
(2,'Siloam Kebun Jeruk','098765678765','Jakarta Barat, DKI Jakarta\r\n','2019-12-21 09:20:19','2019-12-21 09:20:19'),
(3,'Dharmais','076545676543','Depan Slipi Jaya\r\n','2019-12-21 10:33:09','2019-12-21 10:33:09');

/*Table structure for table `polies` */

DROP TABLE IF EXISTS `polies`;

CREATE TABLE `polies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hospital_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

/*Data for the table `polies` */

insert  into `polies`(`id`,`hospital_id`,`title`,`description`,`created_at`,`updated_at`) values 
(2,2,'Spesialis Penyakit Dalam','Spesialis Penyakit Dalam','2019-12-21 12:37:39','2019-12-21 12:37:39'),
(4,3,'Spesialis Penyakit Dalam','Spesialis Penyakit Dalam','2019-12-21 14:15:00','2019-12-21 14:15:00'),
(5,3,'Spesialis Penyakit Mata','Spesialis Penyakit Mata','2019-12-21 14:15:00','2019-12-21 14:15:00'),
(6,3,'Spesialis Kulit & Kelamin','Spesialis Kulit & Kelamin','2019-12-21 14:15:00','2019-12-22 05:24:18'),
(7,3,'Poli Umum','Poli Umum','2019-12-21 14:15:27','2019-12-21 14:15:27');

/*Table structure for table `providers` */

DROP TABLE IF EXISTS `providers`;

CREATE TABLE `providers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `provider_name` varchar(255) DEFAULT NULL,
  `provider_email` varchar(255) DEFAULT NULL,
  `data_json` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `providers` */

/*Table structure for table `rooms` */

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `rooms` */

insert  into `rooms`(`id`,`name`,`created_at`,`updated_at`,`hospital_id`) values 
(2,'Anggrek','2019-12-21 14:49:37','2019-12-21 14:49:37',3),
(3,'Anggrek','2019-12-21 14:49:49','2019-12-21 14:49:49',2);

/*Table structure for table `schema_migrations` */

DROP TABLE IF EXISTS `schema_migrations`;

CREATE TABLE `schema_migrations` (
  `version` varchar(255) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `schema_migrations` */

insert  into `schema_migrations`(`version`) values 
('20191220055607'),
('20191220061342'),
('20191220061540'),
('20191220061753'),
('20191220061913'),
('20191220062016'),
('20191220062229'),
('20191221064741'),
('20191221082839'),
('20191221104430'),
('20191221110110'),
('20191221141803'),
('20191222032146'),
('20191222043351'),
('20191222133637');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL DEFAULT '',
  `encrypted_password` varchar(255) NOT NULL DEFAULT '',
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `date_birth` date DEFAULT NULL,
  `place_birth` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `registered_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_users_on_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`encrypted_password`,`first_name`,`last_name`,`full_name`,`gender`,`date_birth`,`place_birth`,`status`,`position`,`registered_at`,`created_at`,`updated_at`,`provider`,`uid`,`name`,`image`) values 
(1,'doni.dwiyulianto@yopmail.com','$2a$12$k2oA9p/6jwcC7o1rPyzgoe2u0GSMQpKHE5KyNt/YkX32qoHhwRdf.','Doni','Dwi Yulianto','Doni Dwi Yulianto','male','2019-12-21','','active','user','2019-12-21 05:35:09','2019-12-21 05:35:13','2019-12-21 05:35:13',NULL,NULL,NULL,NULL),
(2,'doni.admin@yopmail.com','$2a$12$k2oA9p/6jwcC7o1rPyzgoe2u0GSMQpKHE5KyNt/YkX32qoHhwRdf.','Doni','Admin','Doni Admin','male','2019-12-21',NULL,'active','admin','2019-12-21 05:35:09','2019-12-21 05:35:13','2019-12-21 05:35:13',NULL,NULL,NULL,NULL),
(3,'aprilia@yopmail.com','$2a$12$voG8GgKDPiUEAf7/zCxUCeUa2rJfz0OU2pdG57l/NHTm0n8jEyz1i','Aprilia','Kurnia Dewi SPOG','Aprilia Kurnia Dewi SPOG','female','2019-12-21','Jakarta','active','doctor','2019-12-21 10:31:52','2019-12-21 10:24:37','2019-12-21 10:31:53',NULL,NULL,NULL,NULL),
(4,'chandra@yopmail.com','$2a$12$pQCqH8KE/aiSSK.P1E4/7OEgK/fZShq2ZgTMiQU7rMRCmVRK1pFvu','Chandra','Liaw','Chandra Liaw','male','2019-12-21','Jakarta','active','doctor','2019-12-21 10:32:21','2019-12-21 10:32:21','2019-12-21 10:32:21',NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
