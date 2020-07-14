CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_passwd` varchar(100) NOT NULL,
  `user_img` varchar(255) DEFAULT NULL,
  `user_status` tinyint(4) DEFAULT '0',
  `user_birth` datetime DEFAULT NULL,
  `user_nick_name` varchar(100) NOT NULL,
  `user_interests` varchar(255) DEFAULT NULL
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_nick_name_UNIQUE` (`user_nick_name`),
  UNIQUE KEY `user_email_UNIQUE` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8