-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 27, 2022 at 01:44 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `homies`
--

-- --------------------------------------------------------

--
-- Table structure for table `internal_users`
--

CREATE TABLE `internal_users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `internal_users`
--

INSERT INTO `internal_users` (`id`, `email`, `password`, `created_at`, `updated_at`) VALUES
('b231fc1a-97c8-11ec-b888-6c626d3a5d34', 'hospital.head@homies.com', '$2b$12$ctxD91/fGgCNsIaU2vjS..aUWy/2DdVB9agjbg.nFoA1cqd7vfN7u', '2022-02-27 20:27:58', NULL),
('c2466cac-97c8-11ec-b888-6c626d3a5d34', 'hr.recruit.hiremngr@homies.com', '$2b$12$HakkhQH0Yb.DfdCofLVkMOwE4adsriNVC1L03aBY519TfYLktQYe2', '2022-02-27 20:28:25', NULL),
('c6164915-97c8-11ec-b888-6c626d3a5d34', 'hr.recruit.recruiter@homies.com', '$2b$12$//imEibCPY.yhL3Jb8.9KuPufBpkSyNAQalhjGf268fB3E7H2CtBC', '2022-02-27 20:28:31', NULL),
('cb325b12-97c8-11ec-b888-6c626d3a5d34', 'icu.manager@homies.com', '$2b$12$2UXKjK7knElxEV9yCfsXkOcvZd9RJdL9yw3ipKf3.sff1cOJEeANu', '2022-02-27 20:28:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `public_profiles`
--

CREATE TABLE `public_profiles` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `suffix_name` varchar(255) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `house_street` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `full_address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `public_users`
--

CREATE TABLE `public_users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_blacklist` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `subsystem` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `redirect_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `subsystem`, `name`, `redirect_url`) VALUES
('a9770f67-97c9-11ec-b888-6c626d3a5d34', 'Recruitment', 'Department Manager', '/dm'),
('b39ad95d-97c9-11ec-b888-6c626d3a5d34', 'Recruitment', 'Department Head', '/dh'),
('bb058297-97c9-11ec-b888-6c626d3a5d34', 'Recruitment', 'Hiring Manager', '/h'),
('c2c48f12-97c9-11ec-b888-6c626d3a5d34', 'Recruitment', 'Talent Recruiter', '/r');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `role_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`) VALUES
('22d2759c-97ca-11ec-b888-6c626d3a5d34', 'b231fc1a-97c8-11ec-b888-6c626d3a5d34', 'b39ad95d-97c9-11ec-b888-6c626d3a5d34'),
('34a106dd-97ca-11ec-b888-6c626d3a5d34', 'c2466cac-97c8-11ec-b888-6c626d3a5d34', 'bb058297-97c9-11ec-b888-6c626d3a5d34'),
('660ec223-97ca-11ec-b888-6c626d3a5d34', 'c6164915-97c8-11ec-b888-6c626d3a5d34', 'c2c48f12-97c9-11ec-b888-6c626d3a5d34'),
('79e76d44-97ca-11ec-b888-6c626d3a5d34', 'cb325b12-97c8-11ec-b888-6c626d3a5d34', 'a9770f67-97c9-11ec-b888-6c626d3a5d34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `internal_users`
--
ALTER TABLE `internal_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `public_profiles`
--
ALTER TABLE `public_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `public_users`
--
ALTER TABLE `public_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `public_profiles`
--
ALTER TABLE `public_profiles`
  ADD CONSTRAINT `public_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `public_users` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `internal_users` (`id`),
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
