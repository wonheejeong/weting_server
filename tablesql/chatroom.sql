CREATE TABLE `chatroom` (
  `chatroom_id` int NOT NULL AUTO_INCREMENT,
  `meeting_id` int NOT NULL,
  `meeting_name` varchar(200) NOT NULL,
  `user_nick_name` varchar(100) NOT NULL,
  `is_member` tinyint NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `room` int NOT NULL,
  PRIMARY KEY (`chatroom_id`),
  KEY `meeting_id` (`meeting_id`),
  KEY `user_nick_name` (`user_nick_name`),
  CONSTRAINT `t_meeting_id` FOREIGN KEY (`meeting_id`) REFERENCES `meeting` (`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t_user_nick_name` FOREIGN KEY (`user_nick_name`) REFERENCES `users` (`user_nick_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci