CREATE TABLE `chat` (
  `chat_id` int NOT NULL AUTO_INCREMENT,
  `meeting_id` int NOT NULL,
  `user_nick_name` varchar(100) NOT NULL,
  `room` int NOT NULL,
  `message` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`chat_id`),
  KEY `meeting_id` (`meeting_id`),
  KEY `user_nick_name` (`user_nick_name`),
  CONSTRAINT `tt_meeting_id` FOREIGN KEY (`meeting_id`) REFERENCES `meeting` (`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tt_user_nick_name` FOREIGN KEY (`user_nick_name`) REFERENCES `users` (`user_nick_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci