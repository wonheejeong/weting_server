CREATE TABLE `meeting` (
  `fk_meeting_interest` int NOT NULL,
  `fk_captain_id` int NOT NULL,
  `meeting_id` int NOT NULL AUTO_INCREMENT,
  `meeting_name` varchar(200) NOT NULL,
  `meeting_description` text,
  `meeting_location` varchar(300) NOT NULL,
  `meeting_recruitment` int NOT NULL,
  `meeting_time` varchar(30) NOT NULL,
  `age_limit_min` int DEFAULT '0',
  `age_limit_max` int DEFAULT '0',
  `meeting_img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`meeting_id`),
  KEY `fk_captain_id` (`fk_captain_id`),
  KEY `fk_meeting_interest` (`fk_meeting_interest`),
  CONSTRAINT `fk_meeting_interest` FOREIGN KEY (`fk_meeting_interest`) REFERENCES `meeting_interests` (`interests_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_captain_id` FOREIGN KEY (`fk_captain_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci