CREATE TABLE `meeting_participants` (
  `fk_meeting_id` int NOT NULL,
  `fk_participant_id` int NOT NULL,
  PRIMARY KEY (`fk_meeting_id`, `fk_participant_id`),
  KEY `fk_participant_id` (`fk_participant_id`),
  CONSTRAINT `fk_meeting_id` FOREIGN KEY (`fk_meeting_id`) REFERENCES `meeting` (`meeting_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_participant_id` FOREIGN KEY (`fk_participant_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci