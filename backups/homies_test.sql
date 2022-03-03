-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 03, 2022 at 02:00 PM
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
-- Database: `homies_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicants`
--

CREATE TABLE `applicants` (
  `applicant_id` varchar(36) NOT NULL,
  `job_post_id` varchar(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `suffix_name` varchar(255) DEFAULT NULL,
  `resume` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `evaluated_by` varchar(36) DEFAULT NULL,
  `evaluated_at` datetime DEFAULT NULL,
  `screened_by` varchar(36) DEFAULT NULL,
  `screened_at` datetime DEFAULT NULL,
  `hired_by` varchar(36) DEFAULT NULL,
  `hired_at` varchar(36) DEFAULT NULL,
  `rejected_by` varchar(36) DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `applicants`
--

INSERT INTO `applicants` (`applicant_id`, `job_post_id`, `first_name`, `middle_name`, `last_name`, `suffix_name`, `resume`, `contact_number`, `email`, `status`, `evaluated_by`, `evaluated_at`, `screened_by`, `screened_at`, `hired_by`, `hired_at`, `rejected_by`, `rejected_at`, `remarks`, `created_at`, `updated_at`) VALUES
('042e8280-913e-11ec-aea7-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Jim ', '', 'Vargas', '', 'd5daa56abacd4e9abc392954a7bbf242.pdf', '(521)-141-1459', 'jim.vargas@example.com', 'For interview', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-19 15:51:48', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 15:53:10', NULL, NULL, NULL, NULL, NULL, '2022-02-19 12:40:08', '2022-02-19 15:53:10'),
('17dd6322-93ad-11ec-978b-6c626d3a5d34', '9d01b6c0-8d8e-11ec-a6db-6c626d3a5d34', 'Gertrude ', '', 'Mitchelle', '', '616b19dfef304e6ab9177449af45f4a6.pdf', '(495)-604-2133', 'gertrude.mitchelle@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-02-22 15:00:18', '2022-02-22 15:00:18'),
('1ee99481-8e25-11ec-ab27-6c626d3a5d34', '01ed5350-8d8f-11ec-a6db-6c626d3a5d34', 'Jam', '', 'Torres', '', '8e7578d5cc994c46b62cfa98da8239c6.pdf', '1234568790', 'jamtorres@email.com', 'Contract signed', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-15 14:06:36', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 14:56:40', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 16:13:09', NULL, NULL, NULL, '2022-02-15 14:04:22', '2022-02-16 13:23:21'),
('22cc0de9-913e-11ec-aea7-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Ana ', '', 'Ross', '', '05e9d996b5eb4d2880447fb4bc051bea.pdf', '(713)-536-5675', 'ana.ross@example.com', 'Contract signed', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-19 15:51:33', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 15:53:04', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:24:39', NULL, NULL, NULL, '2022-02-19 12:40:59', '2022-02-23 17:31:45'),
('2a8a6bfa-93ad-11ec-978b-6c626d3a5d34', '9d01b6c0-8d8e-11ec-a6db-6c626d3a5d34', 'Flenn ', '', 'Spencer', '', '5250ceac5ddc4c16b54301b30d164fcc.pdf', '(148)-729-0014', 'flenn.spencer@example.com', 'Contract signed', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-23 19:21:21', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:22:45', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:25:37', NULL, NULL, NULL, '2022-02-22 15:00:49', '2022-02-23 19:41:08'),
('40c15e19-93ad-11ec-978b-6c626d3a5d34', '9d01b6c0-8d8e-11ec-a6db-6c626d3a5d34', 'Dolores ', '', 'Willis', '', '441807d4ed094f36a0620ee05615d505.pdf', '(801)-171-2936', 'dolores.willis@example.com', 'Rejected from evaluation', NULL, NULL, NULL, NULL, NULL, NULL, '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-22 15:06:29', 'Invalid resume is submitted', '2022-02-22 15:01:26', '2022-02-22 15:06:29'),
('4e4e381b-93ad-11ec-978b-6c626d3a5d34', '9d01b6c0-8d8e-11ec-a6db-6c626d3a5d34', 'Alicia ', '', 'Sanchez', '', '055a257b0b634a18868750cae80c6f51.pdf', '(361)-239-4848', 'alicia.sanchez@example.com', 'Contract signed', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-23 19:21:18', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:22:39', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:25:34', NULL, NULL, NULL, '2022-02-22 15:01:49', '2022-02-23 19:41:13'),
('5285221a-9469-11ec-b3e4-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Carter ', '', 'Wade', '', 'fea2912d4aee4b688bb6e9317df3f6b6.pdf', '(360)-202-1026', 'carter.wade@example.com', 'Rejected from evaluation', NULL, NULL, NULL, NULL, NULL, NULL, '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-23 17:21:13', 'Invalid resume is submitted', '2022-02-23 13:27:41', '2022-02-23 17:21:13'),
('671f4b14-93ad-11ec-978b-6c626d3a5d34', 'f6c129ed-8d8e-11ec-a6db-6c626d3a5d34', 'Wendy ', '', 'Meyer', '', 'cc49136f36e944d7a1ef8976e0e2e7f0.pdf', '(315)-172-0367', 'wendy.meyer@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-02-22 15:02:31', '2022-02-22 15:02:31'),
('68a66907-9469-11ec-b3e4-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Cameron ', '', 'Welch', '', 'dde948d216684f808c3b56dd2034882d.pdf', '(886)-558-5358', 'cameron.welch@example.com', 'Rejected from screening', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-23 17:21:01', NULL, NULL, NULL, NULL, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 20:09:00', 'Information submitted is invalid', '2022-02-23 13:28:18', '2022-02-26 20:09:00'),
('76373c8a-93ad-11ec-978b-6c626d3a5d34', 'f6c129ed-8d8e-11ec-a6db-6c626d3a5d34', 'Lucille ', '', 'Boyd', '', '5734b9254c2d49e08bfa65b2a3b6cb4f.pdf', '(783)-205-7109', 'lucille.boyd@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-02-22 15:02:56', '2022-02-22 15:02:56'),
('7c45d985-9469-11ec-b3e4-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Jessie ', '', 'Hale', '', '0976d4cd5de448aabfdc100b000e6e7a.pdf', '(466)-855-4215', 'jessie.hale@example.com', 'Contract signed', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-23 17:20:58', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:22:49', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:24:32', NULL, NULL, NULL, '2022-02-23 13:28:51', '2022-02-23 17:31:39'),
('804cc01c-96ca-11ec-bf1d-6c626d3a5d34', 'af3bed09-8d8e-11ec-a6db-6c626d3a5d34', 'Alicia ', '', 'Ford', '', 'a14e2a5d36b84f4080848291424fc0ef.pdf', '(112)-341-9773', 'alicia.ford@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-02-26 14:08:22', '2022-02-26 14:08:22'),
('8ef8c0a2-9a94-11ec-89c4-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Soham ', '', 'Kelley', '', '3b6f7d319a2840eabc6d5c3e3835ad6d.pdf', '(077)-336-3448', 'soham.kelley@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-03-03 09:52:18', '2022-03-03 09:52:18'),
('94aa2dca-9903-11ec-b2be-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Jetsun Prince', '', 'Torres', '', 'f216286cd1ed488d93f6a71cbb85bbc5.pdf', '09123456789', 'jetsunprincetorres@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-03-01 10:01:59', '2022-03-01 10:01:59'),
('95cc52de-9469-11ec-b3e4-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Laurie ', '', 'Richardson', '', '59bc09960c004915829f0a902ab797f9.pdf', '(809)-537-4463', 'laurie.richardson@example.com', 'Hired', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-23 17:20:54', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:22:44', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 11:49:05', NULL, NULL, NULL, '2022-02-23 13:29:34', '2022-02-26 11:49:05'),
('96d556e4-96ca-11ec-bf1d-6c626d3a5d34', 'af3bed09-8d8e-11ec-a6db-6c626d3a5d34', 'Jacqueline ', '', 'Rhodes', '', 'fb01456f909e4512bc49f4c5b614be55.pdf', '(830)-494-2308', 'jacqueline.rhodes@example.com', 'For interview', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-26 14:12:10', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:13:37', NULL, NULL, NULL, NULL, NULL, '2022-02-26 14:08:59', '2022-02-26 14:13:37'),
('99799804-93ad-11ec-978b-6c626d3a5d34', 'f6c129ed-8d8e-11ec-a6db-6c626d3a5d34', 'Aubrey ', '', 'Reid', '', '809eb4c03325499381f53c024c697578.pdf', '(801)-456-5865', 'aubrey.reid@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-02-22 15:03:55', '2022-02-22 15:03:55'),
('aac0066b-96ca-11ec-bf1d-6c626d3a5d34', 'af3bed09-8d8e-11ec-a6db-6c626d3a5d34', 'Calvin ', '', 'Ruiz', '', 'ec8e2785f1f64e1dbe3166fcf878432d.pdf', '(986)-474-5214', 'calvin.ruiz@example.com', 'For interview', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-26 14:11:55', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:13:29', NULL, NULL, NULL, NULL, NULL, '2022-02-26 14:09:33', '2022-02-26 14:13:29'),
('b30a8eaa-9a93-11ec-89c4-6c626d3a5d34', '1e5d7fa2-914c-11ec-aea7-6c626d3a5d34', 'Kelly ', '', 'Ward', '', 'da08bec560ea4213b902599d9acffc8d.pdf', '(173)-222-0521', 'kelly.ward@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-03-03 09:46:09', '2022-03-03 09:46:09'),
('b8dfbaa3-96ca-11ec-bf1d-6c626d3a5d34', 'af3bed09-8d8e-11ec-a6db-6c626d3a5d34', 'Emma ', '', 'Stevens', '', '4ab803d379304248b232310dfb4d433e.pdf', '(878)-830-2240', 'emma.stevens@example.com', 'Hired', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-26 14:11:52', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:13:24', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-03-03 13:51:11', NULL, NULL, NULL, '2022-02-26 14:09:57', '2022-03-03 13:51:11'),
('bbb57585-9a94-11ec-89c4-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Bradley ', '', 'Wright', '', '8f3723d15aef497ba923fb018742ee56.pdf', '(353)-344-7524', 'bradley.wright@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-03-03 09:53:33', '2022-03-03 09:53:33'),
('cb4a8493-96ca-11ec-bf1d-6c626d3a5d34', 'af3bed09-8d8e-11ec-a6db-6c626d3a5d34', 'Letitia ', '', 'Willis', '', '34f813b78b1247b29f23c188c9ae4d08.pdf', '(863)-464-6300', 'letitia.willis@example.com', 'For interview', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-26 14:11:47', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:13:19', NULL, NULL, NULL, NULL, NULL, '2022-02-26 14:10:27', '2022-02-26 14:13:19'),
('e9b7fb48-913d-11ec-aea7-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', 'Dolores ', '', 'Gardner', '', '291ba38ef7454748ab6d24a4109de178.pdf', '(007)-272-6963', 'dolores.gardner@example.com', 'For evaluation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-02-19 12:39:24', '2022-02-19 12:39:24');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
('40accb96-8bda-11ec-88c9-6c626d3a5d34', 'Hospital Core Department', 'Hospital Core Department', '2022-02-12 16:03:24', '2022-02-12 16:03:24'),
('ea5d5b3b-8bd7-11ec-88c9-6c626d3a5d34', 'Human Resource (HR) Department', 'Human Resource (HR) Department', '2022-02-12 15:46:40', '2022-02-12 15:46:40'),
('ffb8fd3e-8bd7-11ec-88c9-6c626d3a5d34', 'Information Technology (IT) Department', 'Information Technology (IT) Department', '2022-02-12 15:47:16', '2022-02-12 15:47:16');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `extension_name` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) NOT NULL,
  `position_id` varchar(36) NOT NULL,
  `employment_type_id` varchar(255) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `user_id`, `first_name`, `middle_name`, `last_name`, `extension_name`, `contact_number`, `position_id`, `employment_type_id`, `status`, `created_at`, `updated_at`) VALUES
('3ffd2f46-8d52-11ec-a6db-6c626d3a5d34', '49aaca6d-8d52-11ec-a6db-6c626d3a5d34', 'Nathan', NULL, 'Andrews', NULL, '(218)-931-1689', 'f771dfa5-8d51-11ec-a6db-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-14 12:54:54', '2022-02-14 12:54:54'),
('62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '7ef3790c-8d5d-11ec-a6db-6c626d3a5d34', 'Crystal', NULL, 'Rodriguez', NULL, '(355)-882-5784', 'bb021c23-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-14 14:14:36', '2022-02-14 14:14:36'),
('7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '8bcfe3b2-8d48-11ec-a6db-6c626d3a5d34', 'Caleb', NULL, 'Ray', NULL, '(026)-502-6807', '4e64359d-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-14 11:44:57', '2022-02-14 11:44:57'),
('92239c6c-8bed-11ec-88c9-6c626d3a5d34', '49aaca6d-8d52-11ec-a6db-6c626d3a5d34', 'Carole', NULL, 'Martinez', NULL, '(009)-792-7145', '1789d150-8be5-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-12 18:21:41', '2022-02-12 18:21:41'),
('974523b2-8d49-11ec-a6db-6c626d3a5d34', 'a0d6df83-8d49-11ec-a6db-6c626d3a5d34', 'Soham', NULL, 'Miles', NULL, '(683)-584-6498', 'e43b841d-8d48-11ec-a6db-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-14 11:52:55', '2022-02-14 11:52:55'),
('a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', '16905375-8cd6-11ec-8d3b-6c626d3a5d34', 'Nicole', NULL, 'Austine', NULL, '(582)-829-6206', '93d489e2-8be0-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-13 22:02:58', '2022-02-13 22:02:58'),
('a89cdb12-8d52-11ec-a6db-6c626d3a5d34', 'bde6f60c-8d52-11ec-a6db-6c626d3a5d34', 'Sherry', NULL, 'McRogers', NULL, '(523)-381-6275', 'b2b030fa-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-14 12:57:49', '2022-02-14 12:57:49'),
('c80dbb20-8d4a-11ec-a6db-6c626d3a5d34', 'daede201-8d4a-11ec-a6db-6c626d3a5d34', 'Kaylee', NULL, 'Brooks', NULL, '(985)-974-2182', '1789d150-8be5-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-14 12:01:26', '2022-02-14 12:01:26'),
('f5fbb7ed-8cd4-11ec-8d3b-6c626d3a5d34', '20ddf0b0-8cd5-11ec-8d3b-6c626d3a5d34', 'Beatrice', NULL, 'Perez', NULL, '(582)-829-6206', '489d836a-8be8-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-13 21:58:02', '2022-02-13 21:58:02'),
('fade7092-8cd2-11ec-8d3b-6c626d3a5d34', '15ff06af-8cd3-11ec-8d3b-6c626d3a5d34', 'Alvin', NULL, 'Morrison', NULL, '(582)-829-6206', '53724726-8be3-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Active', '2022-02-13 21:43:52', '2022-02-13 21:43:52');

-- --------------------------------------------------------

--
-- Table structure for table `employment_types`
--

CREATE TABLE `employment_types` (
  `employment_type_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employment_types`
--

INSERT INTO `employment_types` (`employment_type_id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
('ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Full Time', 'Full Time', 1, '2022-02-12 17:53:49', '2022-02-12 17:53:49'),
('b2ce077a-8be9-11ec-88c9-6c626d3a5d34', 'Part Time', 'Part Time', 1, '2022-02-12 17:53:58', '2022-02-12 17:53:58'),
('c8913b14-8be9-11ec-88c9-6c626d3a5d34', 'Internship/On-Job Training (OJT)', 'Internship/On-Job Training (OJT)', 1, '2022-02-12 17:54:35', '2022-02-12 17:54:35'),
('ce23d0b2-8be9-11ec-88c9-6c626d3a5d34', 'Contractual', 'Contractual', 1, '2022-02-12 17:54:44', '2022-02-12 17:54:44');

-- --------------------------------------------------------

--
-- Table structure for table `internal_users`
--

CREATE TABLE `internal_users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `internal_users`
--

INSERT INTO `internal_users` (`id`, `email`, `password`, `created_at`, `updated_at`) VALUES
('15ff06af-8cd3-11ec-8d3b-6c626d3a5d34', 'it.head@homies.com', '$2b$12$WSJ0EFvUDWuS94JE5ryUaO.IzCnnyXfjA5OIBK6HgbJzSSp17PteS', '2022-02-13 21:44:37', '2022-02-13 21:44:37'),
('16905375-8cd6-11ec-8d3b-6c626d3a5d34', 'it.mngt.manager@homies.com', '$2b$12$NNZ/CEMaH87c5hPcWGLyiub1goEgfo9VSpKZvX9./3YRrWYHjVLOe', '2022-02-13 22:06:07', '2022-02-13 22:06:07'),
('20ddf0b0-8cd5-11ec-8d3b-6c626d3a5d34', 'hr.recruit.manager@homies.com', '$2b$12$Pedg7Ai6a9l/FZjdV44lR.GdN9Zwv9SiDpK5TxddepJdXqf8EH/pG', '2022-02-13 21:59:14', '2022-02-13 21:59:14'),
('49aaca6d-8d52-11ec-a6db-6c626d3a5d34', 'hr.head@homies.com', '$2b$12$Cag14vRq91IldBqORi8dme9OHOCfBTS30F5Sr7n5Y0ezMUP1N4AGa', '2022-02-14 12:55:10', '2022-02-14 12:55:10'),
('4f665ff4-8bef-11ec-88c9-6c626d3a5d34', 'hospital.core.head@homies.com', '$2b$12$taQP8mrB5GyPap35JZMr8Os/WF/vHMfsP5FGEe7GtanFJABPC2H1e', '2022-02-12 18:34:08', '2022-02-12 18:34:08'),
('7ef3790c-8d5d-11ec-a6db-6c626d3a5d34', 'hr.recruit.recruiter@homies.com', '$2b$12$LoYwrTke/Q2LnFSZ.NSNYeBuTAbleyrEzg57fXXMf7U6dLuFG4bfu', '2022-02-14 14:15:23', '2022-02-14 14:15:23'),
('8bcfe3b2-8d48-11ec-a6db-6c626d3a5d34', 'opd.manager@homies.com', '$2b$12$JV.mNSA1C5tu9rClfwKFvOGq76IEFTr4Gwgia4U6Wk8xD5dzXJhha', '2022-02-14 11:45:26', '2022-02-14 11:45:26'),
('a0d6df83-8d49-11ec-a6db-6c626d3a5d34', 'icu.manager@homies.com', '$2b$12$0HISrDr9yZdvNegi8BNANOL2u4fnG13SAU6s9mipr0IPfP0Q5n3I.', '2022-02-14 11:53:11', '2022-02-14 11:53:11'),
('bde6f60c-8d52-11ec-a6db-6c626d3a5d34', 'hr.recruit.hiremngr@homies.com', '$2b$12$M9HPDULvKUPdfLX1pU51o./XaWhxP7g4S3sZ02gy6ddqRwqp9E4vm', '2022-02-14 12:58:25', '2022-02-14 12:58:25'),
('daede201-8d4a-11ec-a6db-6c626d3a5d34', 'hospital.head@homies.com', '$2b$12$J9nyX10T953VpJ0g3ZIY2.GOzHb8yDiR57ZhBCdm/1K.LjQ7aroim', '2022-02-14 12:01:58', '2022-02-14 12:01:58');

-- --------------------------------------------------------

--
-- Table structure for table `interviewees`
--

CREATE TABLE `interviewees` (
  `interviewee_id` varchar(36) NOT NULL,
  `applicant_id` varchar(36) NOT NULL,
  `interview_schedule_id` varchar(36) DEFAULT NULL,
  `is_interviewed` tinyint(1) DEFAULT NULL,
  `interviewed_at` datetime DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `interviewees`
--

INSERT INTO `interviewees` (`interviewee_id`, `applicant_id`, `interview_schedule_id`, `is_interviewed`, `interviewed_at`, `remarks`, `created_at`, `updated_at`) VALUES
('00d7bd3c-949b-11ec-a5cb-6c626d3a5d34', '2a8a6bfa-93ad-11ec-978b-6c626d3a5d34', '00c14db7-949b-11ec-a5cb-6c626d3a5d34', 1, '2022-02-23 19:24:55', NULL, '2022-02-23 19:23:19', '2022-02-23 19:24:55'),
('00ef81f6-949b-11ec-a5cb-6c626d3a5d34', '4e4e381b-93ad-11ec-978b-6c626d3a5d34', '00c14db7-949b-11ec-a5cb-6c626d3a5d34', 1, '2022-02-23 19:25:10', NULL, '2022-02-23 19:23:19', '2022-02-23 19:25:10'),
('20117533-9159-11ec-aea7-6c626d3a5d34', '042e8280-913e-11ec-aea7-6c626d3a5d34', '1ff9610d-9159-11ec-aea7-6c626d3a5d34', NULL, NULL, NULL, '2022-02-19 15:54:11', '2022-02-19 15:54:11'),
('2036436e-9159-11ec-aea7-6c626d3a5d34', '22cc0de9-913e-11ec-aea7-6c626d3a5d34', '1ff9610d-9159-11ec-aea7-6c626d3a5d34', 1, '2022-02-19 16:16:35', NULL, '2022-02-19 15:54:12', '2022-02-19 16:16:35'),
('3e5830aa-948a-11ec-a5cb-6c626d3a5d34', '7c45d985-9469-11ec-b3e4-6c626d3a5d34', '3e4fc84c-948a-11ec-a5cb-6c626d3a5d34', 1, '2022-02-23 17:24:14', NULL, '2022-02-23 17:23:21', '2022-02-23 17:24:14'),
('3e5eb3dd-948a-11ec-a5cb-6c626d3a5d34', '95cc52de-9469-11ec-b3e4-6c626d3a5d34', '3e4fc84c-948a-11ec-a5cb-6c626d3a5d34', 1, '2022-02-26 09:30:38', NULL, '2022-02-23 17:23:21', '2022-02-26 09:30:38'),
('48c6a7f8-96cc-11ec-bf1d-6c626d3a5d34', '96d556e4-96ca-11ec-bf1d-6c626d3a5d34', '48bd11cf-96cc-11ec-bf1d-6c626d3a5d34', 1, '2022-02-26 14:22:01', NULL, '2022-02-26 14:21:08', '2022-02-26 14:22:01'),
('48ecc5d8-96cc-11ec-bf1d-6c626d3a5d34', 'b8dfbaa3-96ca-11ec-bf1d-6c626d3a5d34', '48bd11cf-96cc-11ec-bf1d-6c626d3a5d34', 1, '2022-03-03 13:50:54', NULL, '2022-02-26 14:21:08', '2022-03-03 13:50:54'),
('48f3b61d-96cc-11ec-bf1d-6c626d3a5d34', 'aac0066b-96ca-11ec-bf1d-6c626d3a5d34', '48bd11cf-96cc-11ec-bf1d-6c626d3a5d34', NULL, NULL, NULL, '2022-02-26 14:21:08', '2022-02-26 14:21:08'),
('bd4b7a1a-8e30-11ec-ab27-6c626d3a5d34', '1ee99481-8e25-11ec-ab27-6c626d3a5d34', 'bd3c42ed-8e30-11ec-ab27-6c626d3a5d34', 1, '2022-02-15 16:07:00', NULL, '2022-02-15 15:27:32', '2022-02-15 16:07:00');

-- --------------------------------------------------------

--
-- Table structure for table `interview_questions`
--

CREATE TABLE `interview_questions` (
  `interview_question_id` varchar(36) NOT NULL,
  `question` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `added_by` varchar(36) NOT NULL,
  `updated_by` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `interview_questions`
--

INSERT INTO `interview_questions` (`interview_question_id`, `question`, `type`, `added_by`, `updated_by`, `created_at`, `updated_at`) VALUES
('4058113e-8e36-11ec-ab27-6c626d3a5d34', 'What problems you think you can\'t solve but you find out you can?', 'Added', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 16:07:00', '2022-02-15 16:07:00'),
('5de7cc80-948a-11ec-a5cb-6c626d3a5d34', 'How do you see yourself after 5 years', 'Added', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:24:14', '2022-02-23 17:24:14'),
('6871249d-96cc-11ec-bf1d-6c626d3a5d34', 'How do you see yourself after 5 years?', 'Added', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:22:01', '2022-02-26 14:22:01'),
('82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 'Why should we hire you?', 'General', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 15:18:44', '2022-02-15 15:18:44'),
('ac894026-8e2f-11ec-ab27-6c626d3a5d34', 'What skills do you have that makes you fit for this job?', 'General', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 15:19:55', '2022-02-15 15:19:55'),
('b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 'What are your strength and weaknesses?', 'General', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 15:20:08', '2022-03-03 10:32:43'),
('e3c3f534-9ab5-11ec-89c4-6c626d3a5d34', 'What problems you encountered you thought it is difficult but you make it solved at the end', 'Added', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-03-03 13:50:54', '2022-03-03 13:50:54');

-- --------------------------------------------------------

--
-- Table structure for table `interview_schedules`
--

CREATE TABLE `interview_schedules` (
  `interview_schedule_id` varchar(36) NOT NULL,
  `job_post_id` varchar(36) NOT NULL,
  `scheduled_date` date NOT NULL,
  `start_session` time NOT NULL,
  `end_session` time NOT NULL,
  `set_by` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `interview_schedules`
--

INSERT INTO `interview_schedules` (`interview_schedule_id`, `job_post_id`, `scheduled_date`, `start_session`, `end_session`, `set_by`, `created_at`, `updated_at`) VALUES
('00c14db7-949b-11ec-a5cb-6c626d3a5d34', '9d01b6c0-8d8e-11ec-a6db-6c626d3a5d34', '2022-02-24', '10:30:00', '14:30:00', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:23:19', '2022-02-23 19:23:19'),
('1ff9610d-9159-11ec-aea7-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', '2022-02-20', '11:00:00', '13:00:00', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 15:54:11', '2022-02-19 15:54:11'),
('3e4fc84c-948a-11ec-a5cb-6c626d3a5d34', 'c5843f55-8d8e-11ec-a6db-6c626d3a5d34', '2022-02-24', '11:00:00', '13:30:00', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:23:21', '2022-02-23 17:23:21'),
('48bd11cf-96cc-11ec-bf1d-6c626d3a5d34', 'af3bed09-8d8e-11ec-a6db-6c626d3a5d34', '2022-03-01', '10:30:00', '13:30:00', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:21:07', '2022-02-26 14:21:07'),
('bd3c42ed-8e30-11ec-ab27-6c626d3a5d34', '01ed5350-8d8f-11ec-a6db-6c626d3a5d34', '2022-02-28', '15:30:00', '16:30:00', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 15:27:32', '2022-02-15 15:27:32');

-- --------------------------------------------------------

--
-- Table structure for table `interview_scores`
--

CREATE TABLE `interview_scores` (
  `interview_score_id` varchar(36) NOT NULL,
  `interviewee_id` varchar(36) NOT NULL,
  `interview_question_id` varchar(36) DEFAULT NULL,
  `score` float DEFAULT NULL,
  `scored_by` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `interview_scores`
--

INSERT INTO `interview_scores` (`interview_score_id`, `interviewee_id`, `interview_question_id`, `score`, `scored_by`, `created_at`, `updated_at`) VALUES
('39c1be13-949b-11ec-a5cb-6c626d3a5d34', '00d7bd3c-949b-11ec-a5cb-6c626d3a5d34', '82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 92, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:24:55', '2022-02-23 19:24:55'),
('39c206ce-949b-11ec-a5cb-6c626d3a5d34', '00d7bd3c-949b-11ec-a5cb-6c626d3a5d34', 'b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 94, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:24:55', '2022-02-23 19:24:55'),
('39c29a2b-949b-11ec-a5cb-6c626d3a5d34', '00d7bd3c-949b-11ec-a5cb-6c626d3a5d34', 'ac894026-8e2f-11ec-ab27-6c626d3a5d34', 91, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:24:55', '2022-02-23 19:24:55'),
('40568ce6-8e36-11ec-ab27-6c626d3a5d34', 'bd4b7a1a-8e30-11ec-ab27-6c626d3a5d34', '82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 95, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 16:07:00', '2022-02-15 16:07:00'),
('405721fe-8e36-11ec-ab27-6c626d3a5d34', 'bd4b7a1a-8e30-11ec-ab27-6c626d3a5d34', 'b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 100, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 16:07:00', '2022-02-15 16:07:00'),
('40582065-8e36-11ec-ab27-6c626d3a5d34', 'bd4b7a1a-8e30-11ec-ab27-6c626d3a5d34', 'ac894026-8e2f-11ec-ab27-6c626d3a5d34', 100, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 16:07:00', '2022-02-15 16:07:00'),
('406ff8ab-8e36-11ec-ab27-6c626d3a5d34', 'bd4b7a1a-8e30-11ec-ab27-6c626d3a5d34', '4058113e-8e36-11ec-ab27-6c626d3a5d34', 99, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-15 16:07:00', '2022-02-15 16:07:00'),
('41342715-915c-11ec-aea7-6c626d3a5d34', '2036436e-9159-11ec-aea7-6c626d3a5d34', '82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 98, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 16:16:35', '2022-02-19 16:16:35'),
('41359fd8-915c-11ec-aea7-6c626d3a5d34', '2036436e-9159-11ec-aea7-6c626d3a5d34', 'b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 96, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 16:16:35', '2022-02-19 16:16:35'),
('413f0ea3-915c-11ec-aea7-6c626d3a5d34', '2036436e-9159-11ec-aea7-6c626d3a5d34', 'ac894026-8e2f-11ec-ab27-6c626d3a5d34', 95, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 16:16:35', '2022-02-19 16:16:35'),
('431f06e1-949b-11ec-a5cb-6c626d3a5d34', '00ef81f6-949b-11ec-a5cb-6c626d3a5d34', '82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 99, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:25:10', '2022-02-23 19:25:10'),
('431f9dc4-949b-11ec-a5cb-6c626d3a5d34', '00ef81f6-949b-11ec-a5cb-6c626d3a5d34', 'b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 89, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:25:10', '2022-02-23 19:25:10'),
('431ff6aa-949b-11ec-a5cb-6c626d3a5d34', '00ef81f6-949b-11ec-a5cb-6c626d3a5d34', 'ac894026-8e2f-11ec-ab27-6c626d3a5d34', 96, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 19:25:10', '2022-02-23 19:25:10'),
('5de6e4e1-948a-11ec-a5cb-6c626d3a5d34', '3e5830aa-948a-11ec-a5cb-6c626d3a5d34', '82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 97, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:24:14', '2022-02-23 17:24:14'),
('5de85636-948a-11ec-a5cb-6c626d3a5d34', '3e5830aa-948a-11ec-a5cb-6c626d3a5d34', 'ac894026-8e2f-11ec-ab27-6c626d3a5d34', 98, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:24:14', '2022-02-23 17:24:14'),
('5de87457-948a-11ec-a5cb-6c626d3a5d34', '3e5830aa-948a-11ec-a5cb-6c626d3a5d34', 'b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 96, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-23 17:24:14', '2022-02-23 17:24:14'),
('686fac51-96cc-11ec-bf1d-6c626d3a5d34', '48c6a7f8-96cc-11ec-bf1d-6c626d3a5d34', '82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 94, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:22:01', '2022-02-26 14:22:01'),
('68703e16-96cc-11ec-bf1d-6c626d3a5d34', '48c6a7f8-96cc-11ec-bf1d-6c626d3a5d34', 'ac894026-8e2f-11ec-ab27-6c626d3a5d34', 95, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:22:01', '2022-02-26 14:22:01'),
('6870a37a-96cc-11ec-bf1d-6c626d3a5d34', '48c6a7f8-96cc-11ec-bf1d-6c626d3a5d34', 'b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 96, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 14:22:01', '2022-02-26 14:22:01'),
('b413e034-96a3-11ec-bf1d-6c626d3a5d34', '3e5eb3dd-948a-11ec-a5cb-6c626d3a5d34', 'b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 87, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 09:30:38', '2022-02-26 09:30:38'),
('b413e03a-96a3-11ec-bf1d-6c626d3a5d34', '3e5eb3dd-948a-11ec-a5cb-6c626d3a5d34', '82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 99, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 09:30:38', '2022-02-26 09:30:38'),
('b413e042-96a3-11ec-bf1d-6c626d3a5d34', '3e5eb3dd-948a-11ec-a5cb-6c626d3a5d34', 'ac894026-8e2f-11ec-ab27-6c626d3a5d34', 95, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-26 09:30:38', '2022-02-26 09:30:38'),
('e3c31246-9ab5-11ec-89c4-6c626d3a5d34', '48ecc5d8-96cc-11ec-bf1d-6c626d3a5d34', '82ac0b04-8e2f-11ec-ab27-6c626d3a5d34', 95, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-03-03 13:50:54', '2022-03-03 13:50:54'),
('e3c42777-9ab5-11ec-89c4-6c626d3a5d34', '48ecc5d8-96cc-11ec-bf1d-6c626d3a5d34', 'b49e3260-8e2f-11ec-ab27-6c626d3a5d34', 98, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-03-03 13:50:54', '2022-03-03 13:50:54'),
('e3c47458-9ab5-11ec-89c4-6c626d3a5d34', '48ecc5d8-96cc-11ec-bf1d-6c626d3a5d34', 'ac894026-8e2f-11ec-ab27-6c626d3a5d34', 94, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-03-03 13:50:54', '2022-03-03 13:50:54'),
('e462084e-9ab5-11ec-89c4-6c626d3a5d34', '48ecc5d8-96cc-11ec-bf1d-6c626d3a5d34', 'e3c3f534-9ab5-11ec-89c4-6c626d3a5d34', 91, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-03-03 13:50:55', '2022-03-03 13:50:55');

-- --------------------------------------------------------

--
-- Table structure for table `job_categories`
--

CREATE TABLE `job_categories` (
  `job_category_id` varchar(36) NOT NULL,
  `name` varchar(36) NOT NULL,
  `description` text NOT NULL,
  `is_removed` tinyint(1) NOT NULL,
  `created_by` varchar(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `job_categories`
--

INSERT INTO `job_categories` (`job_category_id`, `name`, `description`, `is_removed`, `created_by`, `created_at`, `updated_at`) VALUES
('2d468441-914c-11ec-aea7-6c626d3a5d34', 'Medical Staff', 'This job category is all about recruitment', 0, '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-19 14:21:30', '2022-02-19 14:21:30'),
('589b0110-8d8d-11ec-a6db-6c626d3a5d34', 'Recruitment', 'This job category is all about recruitment', 1, '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-14 19:57:54', '2022-02-26 20:21:52'),
('820081e6-8d8b-11ec-a6db-6c626d3a5d34', 'Information Technology', 'This job category is all about information technology', 0, '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-14 19:44:45', '2022-02-19 11:47:37'),
('8d5efdc4-8d8b-11ec-a6db-6c626d3a5d34', 'Medical Nurses', 'This job category is all about medical nurses', 0, '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', '2022-02-14 19:45:04', '2022-02-19 11:47:28');

-- --------------------------------------------------------

--
-- Table structure for table `job_posts`
--

CREATE TABLE `job_posts` (
  `job_post_id` varchar(36) NOT NULL,
  `manpower_request_id` varchar(36) NOT NULL,
  `is_salary_visible` tinyint(1) NOT NULL,
  `content` text NOT NULL,
  `expiration_date` datetime DEFAULT NULL,
  `job_category_id` varchar(36) NOT NULL,
  `posted_by` varchar(36) NOT NULL,
  `views` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `job_posts`
--

INSERT INTO `job_posts` (`job_post_id`, `manpower_request_id`, `is_salary_visible`, `content`, `expiration_date`, `job_category_id`, `posted_by`, `views`, `created_at`, `updated_at`) VALUES
('01ed5350-8d8f-11ec-a6db-6c626d3a5d34', 'd04b9bbd-8d48-11ec-a6db-6c626d3a5d34', 1, '<p>test</p>', NULL, '2d468441-914c-11ec-aea7-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 12, '2022-02-14 20:09:48', '2022-02-26 13:38:02'),
('1e5d7fa2-914c-11ec-aea7-6c626d3a5d34', 'd03f1dd7-912b-11ec-aea7-6c626d3a5d34', 0, '<p><span style=\"font-size: 1rem;\">Primary Responsibilities:</span><br></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\"></span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Medical Safety Physician will take on roles involving the provision of medical and scientific judgement in the evaluation of data pertaining to the efficacy and safety of the company products including, but not limited to, the following:</p><ul><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Prepare safety reports/documents, such as PBRER-PSURs, Benefit-Risk evaluations and Risk Management Plans. Ensure the accuracy of the information presented.</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Review medical safety signals and ensure proper disposition and documentation. Review data from the company post-marketing database and related pharmacovigilance sources, as needed.</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Provide support in the preparation and conduct of cross-functional meetings which involve the medical safety organization (e.g., Safety Management Team meetings). Perform tasks hands-on as an individual contributor</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Provide leadership, mentoring and guidance to other MSP/MSS including oversight of day-to-day activities and safety report content development</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Thoroughly understand and communicate stakeholder requirements to appropriate team members, and manage all requirements accordingly to realize each for the stakeholder</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Establish clear ownership for project tasks, ensure that team members have the tool needed, and provide timely feedback</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Coordinate and facilitate delivery of project objectives</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Assess project issues and identify solutions to meet productivity, quality and customer goals</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Track progress, review project tasks and prepare compliance metrics to make certain deadlines are met appropriately</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Maintain timelines and target dates</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">To deliver any other task and/or responsibilities that may be assigned from time to time.</li></ul><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><br style=\"box-sizing: inherit;\"></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\">DESIRED QUALIFICATION:</span></p><ul><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Requirement: board-certified medical physician</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Technical skills: ability to analyze, interpret and present complex in a concise and understandable scientific manner, both orally and in written format, is essential.</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Attention to detail; diligence in record-keeping and records organization; ability to manage high workload and critical issues; computer-literate and proficient in MS Office applications</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Interpersonal skills: team player; display initiative; strong communication and presentation skills.</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">Internal and external networking skills: strong collaborative and interpersonal skills; results-oriented and able to independently create and deliver; ability to thrive in a global; cross-functional environment;</li><li style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">2 years of clinical experience or experience in pharmaceutical medicine is required.</li></ul>', '2022-06-30 19:59:21', '2d468441-914c-11ec-aea7-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 9, '2022-02-19 14:21:05', '2022-03-03 14:05:45'),
('3978d129-8d8e-11ec-a6db-6c626d3a5d34', '30f2b2b9-8d46-11ec-a6db-6c626d3a5d34', 1, '<p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The ideal candidate will be responsible for planning, coordinating, and implementing projects within the decided-upon budget, timeline, and scope. They will also effectively monitor and present project updates to relevant stakeholders, clients, or project team members.</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><br></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\">Responsibilities</span></p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Set project timeline</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Monitor project deliverables</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Update relevant stakeholders or team members on the project progress</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Coach and support project team members with tasks you assign them</li></ul><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\">Qualifications:</span></p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">BPO experience is a must</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Strong business acumen in project planning and management</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Strong verbal, written, and organizational skills</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Experience in Client Services and Transitions a plus</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Experience in program launches and expansions</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Working as a sole contributor and can work independently with less supervision.</li></ul><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\">Why work with us?</span></p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">We offer a Highly Competitive Salary Package comparable to BPO Companies in the Major Cities and Earn More as you grow with the company.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">We Offer an Extensive Health Care Coverage which provides more benefits the longer you stay in the company.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">We are a Leyte Focused BPO Company that wants to offer more job opportunities to Leyteños and neighboring provinces.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Have fun with your teammates and co-employees with our Employee Engagement activities and programs catered all throughout the year.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Earn access to our Rock Star Top Performers Club which is exclusive to our Employees and family only.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Relocation Package!</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">and Many more!</li></ul>', NULL, '820081e6-8d8b-11ec-a6db-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 2, '2022-02-14 20:04:12', '2022-02-26 12:57:56'),
('9d01b6c0-8d8e-11ec-a6db-6c626d3a5d34', '50f0318f-8d46-11ec-a6db-6c626d3a5d34', 1, '<p>test</p>', '2022-04-30 20:06:00', '820081e6-8d8b-11ec-a6db-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 2, '2022-02-14 20:06:59', '2022-03-01 09:39:41'),
('af3bed09-8d8e-11ec-a6db-6c626d3a5d34', 'bbb9a4bf-8d48-11ec-a6db-6c626d3a5d34', 1, '<p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\">Position Summary</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Company Nurse is responsible for providing basic healthcare services to the staff and providing general first aid when needed, along with assessing employee health risks and promoting employee health and wellness.</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><br style=\"box-sizing: inherit;\"></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\">Responsibilities / Duties</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Company Nurse\'s duties and responsibilities include but not limited to;</p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Provide consultation services, first aid treatments, and medications to employees.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Handle health maintenance services and prepare Annual Medical reports for submission to DOLE.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Control dispensing of vitamins and medicine supplies to employees and monitor inventory of medicines and other medical supplies.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Validate submitted Medical Certificates and RT-PCR/Antigen Test of the staff. Report to immediate superior any discrepancies found in the result.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Provide assistance to employees in availing medical services through HMO accredited hospitals, as needed.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Maintain proper health reporting and recording system, ensuring medical confidentiality of clinic and patient information as well as providing non-confidential reports to site management as required. Identify potential occupational illnesses and refer to the company health adviser.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Responsible for coordinating and facilitating Company\'s Annual Physical Examination.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Assist with Employee Relation issues such as addressing employee concerns, development, and implementation of HR policies regarding occupational health and safety.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Prepare health and safety reports including but not limited to summary of consultations and sick applications and COVID monitoring.</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Organizing of company-sponsored events and activities, especially with regards to Health and Wellness.</li></ul>', NULL, '8d5efdc4-8d8b-11ec-a6db-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 2, '2022-02-14 20:07:29', '2022-02-26 14:07:54'),
('c5843f55-8d8e-11ec-a6db-6c626d3a5d34', '6a2a8d33-8d46-11ec-a6db-6c626d3a5d34', 1, '<p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\">RESPONSIBILITIES:</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><br style=\"box-sizing: inherit;\"></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Facilitate and lead process workshops that involve eliciting process requirements and liaising with users</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Manage process change and educate business users and medical teams responsible for managing and operating business processes</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Closely work, collaborate, and meet with hospitals’ key stakeholders, during evaluation, design, planning and implementation of the IT Applications of the hospitals:</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• TeleMedicine / TeleHealth Applications</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Mobile Applications</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Web Sites and other Web- based Applications</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Cloud-based Applications</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Hospital Information Systems (HIS)</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Human Resource Information Systems (HRIS)</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Integration Requirements with other Hospital Systems</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Data Warehouse and Reporting Tools</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Observe processes in action, monitor, measure and provide feedback on process performance</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Closely work with hospital teams and the subject matter experts to find the best way to design new processes and solve process-related problems</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Interpret business requirements for the development of Group IT projects</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Document any information elicited using process maps and business requirements documents via business process modelling notations (BPMN, EPC, BPEL)</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Perform other duties and tasks and handle other projects assigned by the Group IT Digital Apps Lead</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Assist in the assessment (as needed) for on-boarding new Hospitals.</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><br style=\"box-sizing: inherit;\"></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\">MUST HAVE SKILLS:</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\"></span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• The Group IT Business Process Analyst / Systems Analyst shall have the necessary “soft skills” in order to navigate through the enterprise, knowing who to engage, when and how</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Capable of both strategic and operational thinking as well as the attention to detail to focus on the big picture (such as corporate vision and business strategy)</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Applies their knowledge of business process modelling notations (BPMN, EPC, BPEL) to documenting processes</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Has clear understanding of how ERP, BPM, CRM, and BI tools operate</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">• Understands protocols like SOAP, WSDL, XML and other key protocols which are necessary for application integrations via Integration Engines and Middleware</p>', NULL, '820081e6-8d8b-11ec-a6db-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 5, '2022-02-14 20:08:07', '2022-03-03 09:51:42');
INSERT INTO `job_posts` (`job_post_id`, `manpower_request_id`, `is_salary_visible`, `content`, `expiration_date`, `job_category_id`, `posted_by`, `views`, `created_at`, `updated_at`) VALUES
('cda092dc-913f-11ec-aea7-6c626d3a5d34', '382795a1-8d4a-11ec-a6db-6c626d3a5d34', 0, '<p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\">Position Summary</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Company Nurse is responsible for providing basic healthcare services to the staff and providing general first aid when needed, along with assessing employee health risks and promoting employee health and wellness.</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><br style=\"box-sizing: inherit;\"></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\">Responsibilities / Duties</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Company Nurse\'s duties and responsibilities include but not limited to;</p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Provide consultation services, first aid treatments, and medications to employees.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Handle health maintenance services and prepare Annual Medical reports for submission to DOLE.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Control dispensing of vitamins and medicine supplies to employees and monitor inventory of medicines and other medical supplies.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Validate submitted Medical Certificates and RT-PCR/Antigen Test of the staff. Report to immediate superior any discrepancies found in the result.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Provide assistance to employees in availing medical services through HMO accredited hospitals, as needed.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Maintain proper health reporting and recording system, ensuring medical confidentiality of clinic and patient information as well as providing non-confidential reports to site management as required. Identify potential occupational illnesses and refer to the company health adviser.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Responsible for coordinating and facilitating Company\'s Annual Physical Examination.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Assist with Employee Relation issues such as addressing employee concerns, development, and implementation of HR policies regarding occupational health and safety.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Prepare health and safety reports including but not limited to summary of consultations and sick applications and COVID monitoring.</li><li style=\"background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Organizing of company-sponsored events and activities, especially with regards to Health and Wellness.</li></ul>', NULL, '8d5efdc4-8d8b-11ec-a6db-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 1, '2022-02-19 12:52:56', '2022-02-26 13:02:21'),
('ce15bf55-8d8e-11ec-a6db-6c626d3a5d34', 'd845b74a-8d51-11ec-a6db-6c626d3a5d34', 0, '<p><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><b>Job Description</b><br style=\"box-sizing: inherit;\"><br style=\"box-sizing: inherit;\"></span>You will be responsible for recruiting high caliber professionals to join Crowe as we expand our team globally. This is an opportunity to work directly with hiring managers/partners to gain an understanding of their staffing needs. Success will be measured by your ability to identify, attract, and assess applicants as well as facilitate a defined recruiting process. Applicants must be able to demonstrate through experience an ability to build strong relationships with hiring managers, and an ability to influence and guide their recruitment efforts through a strategic and consultative approach.<br style=\"box-sizing: inherit;\"><br style=\"box-sizing: inherit;\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><b>Essential Functions</b><br style=\"box-sizing: inherit;\"></span></p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Successfully source, screen, interview, evaluate and hire qualified candidates</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Manage ongoing candidate relationship during the hiring life cycle</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Performing post-offer activities including communications, answering queries, reference checks, new hire paperwork</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Preforming onboarding, induction for the new hires</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Maintain accurate candidate data in ATS</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Participate in special projects/task forces as assigned</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Solid direct sourcing / cold call experience</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">The ability to interact effectively with all levels of professionals in a strategic capacity<br style=\"box-sizing: inherit;\"></li></ul><p><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><b>Responsibilities<br style=\"box-sizing: inherit;\"></b><br style=\"box-sizing: inherit;\"></span>In addition to the TA responsibilities you will provide support for core people related processes and key HR functions in the following areas<br style=\"box-sizing: inherit;\"></p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Employee transactions / activity</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Resource Management / scheduling</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Employee relations/ Employee engagement initiatives</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Compensation and benefits administration</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Compliance<br style=\"box-sizing: inherit;\"></li></ul><p><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><b>Qualifications</b><br style=\"box-sizing: inherit;\"></span></p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">MBA in Human Resources Management or a Post Graduate Diploma in Human Resources Management</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">2-4 overall years of recruiting experience</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Ability to communicate fluently in English</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Some experience in campus hiring preferred</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Excellent communication, organization, and talent assessment skills</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Ability to coordinate Onboarding and HR generalist functions</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Demonstrated success recruiting in a highly aggressive and competitive market</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Strong proficiency with Microsoft Office package (primarily Excel, Word, and PowerPoint), the internet, and applicant tracking databases</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Exceptional, outgoing interpersonal skills and strong organizational skills</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Must have the ability to work in a fast paced environment and handle multiple tasks/projects at one time</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Experience on Behavioral Interviewing techniques preferred</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Knowledge of multiple recruiting sources with mastery in one or more<br style=\"box-sizing: inherit;\"></li></ul><p>#Indeed<br style=\"box-sizing: inherit;\"><br style=\"box-sizing: inherit;\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><b>Our Benefits</b><br style=\"box-sizing: inherit;\"><br style=\"box-sizing: inherit;\"></span>At Homies, we know that great people are what makes a great firm. We value our people and offer employees a comprehensive benefits package. Learn more about what working at Crowe can mean for you!<br style=\"box-sizing: inherit;\"><br style=\"box-sizing: inherit;\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\">How You Can Grow<br style=\"box-sizing: inherit;\"><br style=\"box-sizing: inherit;\"></span>We will nurture your talent in an inclusive culture that values diversity. You will have the chance to meet on a consistent basis with your Career Coach that will guide you in your career goals and aspirations. Learn more about where talent can prosper!<br style=\"box-sizing: inherit; color: rgba(255, 255, 255, 0.9); font-family: -apple-system, system-ui, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, &quot;Fira Sans&quot;, Ubuntu, Oxygen, &quot;Oxygen Sans&quot;, Cantarell, &quot;Droid Sans&quot;, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Lucida Grande&quot;, Helvetica, Arial, sans-serif; font-size: 14px; background-color: rgb(29, 34, 38);\"></p>', NULL, '589b0110-8d8d-11ec-a6db-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 3, '2022-02-14 20:08:21', '2022-02-26 20:38:46'),
('dafa8c5a-913f-11ec-aea7-6c626d3a5d34', '2d86cf8a-8ef1-11ec-8742-6c626d3a5d34', 0, '<p><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><span style=\"box-sizing: inherit;\">Description</span><br style=\"box-sizing: inherit;\"></span>“Eligibility: R.A. 1080<br style=\"box-sizing: inherit;\"><br style=\"box-sizing: inherit;\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><span style=\"box-sizing: inherit;\">Area Of Assignment/Deployment</span><br style=\"box-sizing: inherit;\"></span>– Hospital Laboratories<br style=\"box-sizing: inherit;\">– COVID-19 Diagnostic Facilities<br style=\"box-sizing: inherit;\"><br style=\"box-sizing: inherit;\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><span style=\"box-sizing: inherit;\">Job Descriptions</span><br style=\"box-sizing: inherit;\"></span></p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Plans and adapts the regular and therapeutic menus of patients</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Directs and participates in preparation of daily menus of patients, purchase,<br style=\"box-sizing: inherit;\"></li></ul><p>inspection, and inventory of food supplies<br style=\"box-sizing: inherit;\"></p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Supervises activities of dietary and food service personnel</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Establishes and maintains sanitary standards in areas of food handling, pest control, cleaning procedures, storage, and trash disposal</li><li style=\"box-sizing: inherit; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ;\">Conducts nutrition and dietary assessment, education and counseling to patients”</li></ul><p><br style=\"box-sizing: inherit;\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\"><span style=\"box-sizing: inherit;\">Requirements</span><br style=\"box-sizing: inherit;\"></span>- Bachelor’s Degree in Nutrition<br style=\"box-sizing: inherit;\">&nbsp;- Dietetics or Community Nutrition<br></p>', NULL, '2d468441-914c-11ec-aea7-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 3, '2022-02-19 12:53:18', '2022-03-03 14:01:56'),
('e5cc53f7-8d8e-11ec-a6db-6c626d3a5d34', '429dd76f-8d4a-11ec-a6db-6c626d3a5d34', 0, '<p>Test</p>', NULL, '2d468441-914c-11ec-aea7-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 0, '2022-02-14 20:09:01', '2022-02-19 14:55:38'),
('ee234ec3-8d8e-11ec-a6db-6c626d3a5d34', '2f54740f-8d4a-11ec-a6db-6c626d3a5d34', 0, '<p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\">Position Summary</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Company Nurse is responsible for providing basic healthcare services to the staff and providing general first aid when needed, along with assessing employee health risks and promoting employee health and wellness.</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><br style=\"box-sizing: inherit;\"></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\">Responsibilities / Duties</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Company Nurse\'s duties and responsibilities include but not limited to;</p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Provide consultation services, first aid treatments, and medications to employees.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Handle health maintenance services and prepare Annual Medical reports for submission to DOLE.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Control dispensing of vitamins and medicine supplies to employees and monitor inventory of medicines and other medical supplies.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Validate submitted Medical Certificates and RT-PCR/Antigen Test of the staff. Report to immediate superior any discrepancies found in the result.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Provide assistance to employees in availing medical services through HMO accredited hospitals, as needed.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Maintain proper health reporting and recording system, ensuring medical confidentiality of clinic and patient information as well as providing non-confidential reports to site management as required. Identify potential occupational illnesses and refer to the company health adviser.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Responsible for coordinating and facilitating Company\'s Annual Physical Examination.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Assist with Employee Relation issues such as addressing employee concerns, development, and implementation of HR policies regarding occupational health and safety.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Prepare health and safety reports including but not limited to summary of consultations and sick applications and COVID monitoring.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Organizing of company-sponsored events and activities, especially with regards to Health and Wellness.</li></ul>', NULL, '8d5efdc4-8d8b-11ec-a6db-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 2, '2022-02-14 20:09:15', '2022-02-26 13:02:35');
INSERT INTO `job_posts` (`job_post_id`, `manpower_request_id`, `is_salary_visible`, `content`, `expiration_date`, `job_category_id`, `posted_by`, `views`, `created_at`, `updated_at`) VALUES
('f6c129ed-8d8e-11ec-a6db-6c626d3a5d34', '0f372972-8d4a-11ec-a6db-6c626d3a5d34', 1, '<p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); outline: var(--artdeco-reset-base-outline-zero);\">Position Summary</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Company Nurse is responsible for providing basic healthcare services to the staff and providing general first aid when needed, along with assessing employee health risks and promoting employee health and wellness.</p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><br style=\"box-sizing: inherit;\"></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\"><span style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; outline: var(--artdeco-reset-base-outline-zero);\">Responsibilities / Duties</span></p><p style=\"box-sizing: inherit; margin: var(--artdeco-reset-base-margin-zero); padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline); --artdeco-reset-typography_getFontSize:1.6rem; --artdeco-reset-typography_getLineHeight:1.5; line-height: var(--artdeco-reset-typography_getLineHeight);\">The Company Nurse\'s duties and responsibilities include but not limited to;</p><ul style=\"box-sizing: inherit; margin-left: 16px; padding-left: 18px; border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\"><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Provide consultation services, first aid treatments, and medications to employees.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Handle health maintenance services and prepare Annual Medical reports for submission to DOLE.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Control dispensing of vitamins and medicine supplies to employees and monitor inventory of medicines and other medical supplies.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Validate submitted Medical Certificates and RT-PCR/Antigen Test of the staff. Report to immediate superior any discrepancies found in the result.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Provide assistance to employees in availing medical services through HMO accredited hospitals, as needed.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Maintain proper health reporting and recording system, ensuring medical confidentiality of clinic and patient information as well as providing non-confidential reports to site management as required. Identify potential occupational illnesses and refer to the company health adviser.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Responsible for coordinating and facilitating Company\'s Annual Physical Examination.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Assist with Employee Relation issues such as addressing employee concerns, development, and implementation of HR policies regarding occupational health and safety.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Prepare health and safety reports including but not limited to summary of consultations and sick applications and COVID monitoring.</li><li style=\"box-sizing: inherit; background-image: ; background-position-x: ; background-position-y: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; margin-left: 16px; padding: var(--artdeco-reset-base-padding-zero); border: var(--artdeco-reset-base-border-zero); vertical-align: var(--artdeco-reset-base-vertical-align-baseline);\">Organizing of company-sponsored events and activities, especially with regards to Health and Wellness.</li></ul>', NULL, '8d5efdc4-8d8b-11ec-a6db-6c626d3a5d34', '62ca1c7d-8d5d-11ec-a6db-6c626d3a5d34', 9, '2022-02-14 20:09:29', '2022-03-03 14:11:58');

-- --------------------------------------------------------

--
-- Table structure for table `manpower_requests`
--

CREATE TABLE `manpower_requests` (
  `manpower_request_id` varchar(36) NOT NULL,
  `requisition_no` varchar(255) NOT NULL,
  `requested_by` varchar(36) NOT NULL,
  `position_id` varchar(36) NOT NULL,
  `employment_type_id` varchar(255) NOT NULL,
  `request_nature` varchar(255) NOT NULL,
  `staffs_needed` int(11) NOT NULL,
  `min_monthly_salary` float DEFAULT NULL,
  `max_monthly_salary` float DEFAULT NULL,
  `content` text NOT NULL,
  `request_status` varchar(255) NOT NULL,
  `deadline` datetime DEFAULT NULL,
  `signed_by` varchar(36) DEFAULT NULL,
  `signed_at` datetime DEFAULT NULL,
  `reviewed_by` varchar(36) DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `rejected_by` varchar(36) DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `manpower_requests`
--

INSERT INTO `manpower_requests` (`manpower_request_id`, `requisition_no`, `requested_by`, `position_id`, `employment_type_id`, `request_nature`, `staffs_needed`, `min_monthly_salary`, `max_monthly_salary`, `content`, `request_status`, `deadline`, `signed_by`, `signed_at`, `reviewed_by`, `reviewed_at`, `completed_at`, `rejected_by`, `rejected_at`, `remarks`, `created_at`, `updated_at`) VALUES
('0f372972-8d4a-11ec-a6db-6c626d3a5d34', 'REQ-KZM5WKCL-UFBS7T', '974523b2-8d49-11ec-a6db-6c626d3a5d34', '0709ba31-8d49-11ec-a6db-6c626d3a5d34', 'b2ce077a-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 4, 28650, 45800, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Intensive Care Unit (ICU) Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Soham Miles,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Intensive Care Unit (ICU) Department</b></span></div><p></p>', 'Approved', NULL, 'c80dbb20-8d4a-11ec-a6db-6c626d3a5d34', '2022-02-14 12:42:49', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:25:07', NULL, NULL, NULL, NULL, '2022-02-14 11:56:16', '2022-02-14 13:25:07'),
('2d86cf8a-8ef1-11ec-8742-6c626d3a5d34', 'REQ-KZP669NF-Y7PS3A', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '995f4383-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 2, NULL, NULL, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Out-Patient Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Caleb Ray,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Out-Patient Department</b></span></div><p></p>', 'Approved', NULL, '92239c6c-8bed-11ec-88c9-6c626d3a5d34', '2022-02-19 12:49:18', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 12:50:00', NULL, NULL, NULL, NULL, '2022-02-16 14:25:04', '2022-02-19 12:50:00'),
('2f54740f-8d4a-11ec-a6db-6c626d3a5d34', 'REQ-KZM5ZM12-NLJZT2', '974523b2-8d49-11ec-a6db-6c626d3a5d34', '51d613bf-8d49-11ec-a6db-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 4, NULL, NULL, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Intensive Care Unit (ICU) Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Soham Miles,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Intensive Care Unit (ICU) Department</b></span></div><p></p>', 'Approved', NULL, 'c80dbb20-8d4a-11ec-a6db-6c626d3a5d34', '2022-02-14 12:42:44', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:24:47', NULL, NULL, NULL, NULL, '2022-02-14 11:57:10', '2022-02-14 13:24:47'),
('30f2b2b9-8d46-11ec-a6db-6c626d3a5d34', 'REQ-KZM4ZCFT-KM22ZD', 'a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', '8817f963-8be0-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 1, 25000, 58000, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>IT Management and Administration Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Nicole Austine,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>IT Management and Administration Department</b></span></div><p></p>', 'Approved', NULL, 'fade7092-8cd2-11ec-8d3b-6c626d3a5d34', '2022-02-14 13:14:49', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:26:45', NULL, NULL, NULL, NULL, '2022-02-14 11:28:35', '2022-02-14 13:26:45'),
('382795a1-8d4a-11ec-a6db-6c626d3a5d34', 'REQ-KZM60RZP-28EJ9L', '974523b2-8d49-11ec-a6db-6c626d3a5d34', '63f8a921-8d49-11ec-a6db-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Replacement', 1, NULL, NULL, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Intensive Care Unit (ICU) Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Soham Miles,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Intensive Care Unit (ICU) Department</b></span></div><p></p>', 'Approved', NULL, '92239c6c-8bed-11ec-88c9-6c626d3a5d34', '2022-02-19 12:49:01', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 12:50:05', NULL, NULL, NULL, NULL, '2022-02-14 11:57:25', '2022-02-19 12:50:05'),
('429dd76f-8d4a-11ec-a6db-6c626d3a5d34', 'REQ-KZM612PD-8EHOQS', '974523b2-8d49-11ec-a6db-6c626d3a5d34', '2c7a275d-8d49-11ec-a6db-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 5, NULL, NULL, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Intensive Care Unit (ICU) Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Soham Miles,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Intensive Care Unit (ICU) Department</b></span></div><p></p>', 'Approved', NULL, 'c80dbb20-8d4a-11ec-a6db-6c626d3a5d34', '2022-02-14 12:29:40', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:25:01', NULL, NULL, NULL, NULL, '2022-02-14 11:57:42', '2022-02-14 13:25:01'),
('50f0318f-8d46-11ec-a6db-6c626d3a5d34', 'REQ-KZM500NF-DY6M09', 'a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', '3c8e1a7b-8be0-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 1, 26000, 85000, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>IT Management and Administration Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Nicole Austine,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>IT Management and Administration Department</b></span></div><p></p>', 'Approved', '2022-05-31 12:30:00', 'fade7092-8cd2-11ec-8d3b-6c626d3a5d34', '2022-02-14 13:14:44', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:26:40', NULL, NULL, NULL, NULL, '2022-02-14 11:29:28', '2022-02-14 13:26:40'),
('6a2a8d33-8d46-11ec-a6db-6c626d3a5d34', 'REQ-KZM51EPN-CUP8EN', 'a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', '54f2385c-8be0-11ec-88c9-6c626d3a5d34', 'c8913b14-8be9-11ec-88c9-6c626d3a5d34', 'Replacement', 2, 12500, 20600, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>IT Management and Administration Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Nicole Austine,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>IT Management and Administration Department</b></span></div><p></p>', 'Approved', NULL, 'fade7092-8cd2-11ec-8d3b-6c626d3a5d34', '2022-02-14 13:14:40', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:26:36', NULL, NULL, NULL, NULL, '2022-02-14 11:30:11', '2022-02-14 13:26:36'),
('a0810804-8d47-11ec-a6db-6c626d3a5d34', 'REQ-KZM5CV90-HIPST8', 'a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', '93d489e2-8be0-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'Replacement', 1, NULL, NULL, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>IT Management and Administration Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Nicole Austine,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>IT Management and Administration Department</b></span></div><p></p>', 'Rejected for approval', NULL, 'fade7092-8cd2-11ec-8d3b-6c626d3a5d34', '2022-02-14 13:14:35', NULL, NULL, NULL, 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:26:30', 'Department Manager cannot be requested', '2022-02-14 11:38:51', '2022-02-14 13:26:30'),
('bbb9a4bf-8d48-11ec-a6db-6c626d3a5d34', 'REQ-KZM5MF3M-JY07EP', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '229c244f-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 5, 23600, 48560, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Out-Patient Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Caleb Ray,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Out-Patient Department</b></span></div><p></p>', 'Approved', '2022-03-31 00:00:00', 'c80dbb20-8d4a-11ec-a6db-6c626d3a5d34', '2022-02-14 12:42:58', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:26:11', NULL, NULL, NULL, NULL, '2022-02-14 11:46:46', '2022-02-14 13:26:11'),
('c57904d9-912b-11ec-aea7-6c626d3a5d34', 'REQ-KZT82REG-BCWTRH', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '1231b264-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 3, 15200, 35418, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Out-Patient Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Caleb Ray,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Out-Patient Department</b></span></div><p></p>', 'For signature', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-02-19 10:29:32', '2022-02-26 12:44:31'),
('d03f1dd7-912b-11ec-aea7-6c626d3a5d34', 'REQ-KZT83D2Q-JC0IYW', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '7837cc9e-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 2, NULL, NULL, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Out-Patient Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Caleb Ray,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Out-Patient Department</b></span></div><p></p>', 'Completed', NULL, '92239c6c-8bed-11ec-88c9-6c626d3a5d34', '2022-02-19 12:49:05', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-19 12:49:55', '2022-02-23 14:50:27', NULL, NULL, NULL, '2022-02-19 10:29:50', '2022-02-23 14:50:27'),
('d04b9bbd-8d48-11ec-a6db-6c626d3a5d34', 'REQ-KZM5NGX3-U25RPW', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '710b702c-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 1, 26000, 36500, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Out-Patient Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Caleb Ray,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Out-Patient Department</b></span></div><p></p>', 'Approved', NULL, 'c80dbb20-8d4a-11ec-a6db-6c626d3a5d34', '2022-02-14 12:42:54', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:25:14', NULL, NULL, NULL, NULL, '2022-02-14 11:47:21', '2022-02-14 13:25:14'),
('d5bff2bf-8d4e-11ec-a6db-6c626d3a5d34', 'REQ-KZM77AOS-3RCRTE', '974523b2-8d49-11ec-a6db-6c626d3a5d34', 'e43b841d-8d48-11ec-a6db-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 1, NULL, NULL, '<p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">Dear Recipients,</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">This is to confirm that the&nbsp;<b>Recruitment Management</b> will hereafter be the source of manpower supply to the&nbsp;<b>Intensive Care Unit (ICU) Department</b> for the requested duration. This agreement will start as this paper will be approved by the hiring manager and will terminate as the request is fulfilled. The functions to be performed by the hired company are to supply sufficient manpower to Homies until the agreement is terminated.</p><div class=\"code-block code-block-7\" style=\"box-sizing: inherit; margin: 8px auto; text-align: center; clear: both;\"><span id=\"ezoic-pub-ad-placeholder-127\" style=\"box-sizing: inherit;\"></span></div><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\">The hired company will also assist the company in the selection of staff or workers in every way. The&nbsp; <b>Recruitment Management</b> will also be given the required powers to make final selections of candidates as they deem appropriate.</p><p style=\"box-sizing: inherit; overflow-wrap: break-word; margin-right: 0px; margin-bottom: 1.6em; margin-left: 0px; padding: 0px; border: 0px;\"></p><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\">Sincerely,</span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Soham Miles,</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Department Manager</b></span></div><div style=\"text-align: left;\"><span style=\"font-size: 1rem;\"><b>Intensive Care Unit (ICU) Department</b></span></div><p></p>', 'Rejected for signing', NULL, NULL, NULL, NULL, NULL, NULL, 'c80dbb20-8d4a-11ec-a6db-6c626d3a5d34', '2022-02-14 12:31:20', 'Department Manager cannot be replaced', '2022-02-14 12:30:27', '2022-02-14 12:31:20'),
('d845b74a-8d51-11ec-a6db-6c626d3a5d34', 'REQ-KZM7YO06-WU9600', 'f5fbb7ed-8cd4-11ec-8d3b-6c626d3a5d34', 'bb021c23-8be7-11ec-88c9-6c626d3a5d34', 'ad44c6cd-8be9-11ec-88c9-6c626d3a5d34', 'New/Addition', 5, NULL, NULL, '<p>Test</p>', 'Approved', NULL, '3ffd2f46-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 12:56:40', 'a89cdb12-8d52-11ec-a6db-6c626d3a5d34', '2022-02-14 13:24:57', NULL, NULL, NULL, NULL, '2022-02-14 12:52:00', '2022-02-14 13:24:57');

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_employees`
--

CREATE TABLE `onboarding_employees` (
  `onboarding_employee_id` varchar(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `suffix_name` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `position_id` varchar(36) NOT NULL,
  `employment_start_date` date DEFAULT NULL,
  `employment_contract` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `signed_by` varchar(36) NOT NULL,
  `updated_by` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `onboarding_employees`
--

INSERT INTO `onboarding_employees` (`onboarding_employee_id`, `first_name`, `middle_name`, `last_name`, `suffix_name`, `contact_number`, `email`, `position_id`, `employment_start_date`, `employment_contract`, `status`, `signed_by`, `updated_by`, `created_at`, `updated_at`) VALUES
('673eabdf-948b-11ec-a5cb-6c626d3a5d34', 'Jessie ', '', 'Hale', '', '(466)-855-4215', 'jessie.hale@example.com', '54f2385c-8be0-11ec-88c9-6c626d3a5d34', '2022-02-24', '021080d73ee44a93af74336af2d514c2.pdf', 'Pending', 'fade7092-8cd2-11ec-8d3b-6c626d3a5d34', NULL, '2022-02-23 17:31:39', '2022-02-23 18:58:17'),
('6af89995-948b-11ec-a5cb-6c626d3a5d34', 'Ana ', '', 'Ross', '', '(713)-536-5675', 'ana.ross@example.com', '54f2385c-8be0-11ec-88c9-6c626d3a5d34', '2022-02-23', '333b1b2c7a7b4d1dac56c040cd373452.pdf', 'Onboarding', 'fade7092-8cd2-11ec-8d3b-6c626d3a5d34', NULL, '2022-02-23 17:31:45', '2022-02-23 17:33:21'),
('7e0af08a-949d-11ec-a5cb-6c626d3a5d34', 'Flenn ', '', 'Spencer', '', '(148)-729-0014', 'flenn.spencer@example.com', '3c8e1a7b-8be0-11ec-88c9-6c626d3a5d34', NULL, '987a1cd819ac4f40832364a00a817f2b.pdf', 'Pending', 'fade7092-8cd2-11ec-8d3b-6c626d3a5d34', NULL, '2022-02-23 19:41:08', '2022-02-23 19:41:08'),
('811683e1-949d-11ec-a5cb-6c626d3a5d34', 'Alicia ', '', 'Sanchez', '', '(361)-239-4848', 'alicia.sanchez@example.com', '3c8e1a7b-8be0-11ec-88c9-6c626d3a5d34', NULL, '58bb8eea9a4640bb878a72e7634a5c5b.pdf', 'Pending', 'fade7092-8cd2-11ec-8d3b-6c626d3a5d34', NULL, '2022-02-23 19:41:13', '2022-02-23 19:41:13'),
('8e30ebd6-8ee8-11ec-8742-6c626d3a5d34', 'Jam', '', 'Torres', '', '1234568790', 'jamtorres@email.com', '710b702c-8be7-11ec-88c9-6c626d3a5d34', '2022-02-16', '7319e33c8e3941a5a02ab51c7dc2c609.pdf', 'Onboarding', '92239c6c-8bed-11ec-88c9-6c626d3a5d34', NULL, '2022-02-16 13:23:21', '2022-02-16 13:46:58');

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_employee_task`
--

CREATE TABLE `onboarding_employee_task` (
  `onboarding_employee_task_id` varchar(36) NOT NULL,
  `onboarding_employee_id` varchar(36) NOT NULL,
  `onboarding_task_id` varchar(36) NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `assigned_by` varchar(36) NOT NULL,
  `status` varchar(255) NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  `completed_by` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `onboarding_employee_task`
--

INSERT INTO `onboarding_employee_task` (`onboarding_employee_task_id`, `onboarding_employee_id`, `onboarding_task_id`, `start_at`, `end_at`, `assigned_by`, `status`, `completed_at`, `completed_by`, `created_at`, `updated_at`) VALUES
('a98b01ef-9498-11ec-a5cb-6c626d3a5d34', '6af89995-948b-11ec-a5cb-6c626d3a5d34', 'a98357af-9498-11ec-a5cb-6c626d3a5d34', '2022-02-24 19:06:00', '2022-02-25 19:06:00', 'a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', 'Completed', '2022-02-23 19:13:29', 'a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', '2022-02-23 19:06:34', '2022-02-23 19:13:29'),
('db15e9e7-8eeb-11ec-8742-6c626d3a5d34', '8e30ebd6-8ee8-11ec-8742-6c626d3a5d34', '2c03ee83-8ee2-11ec-8742-6c626d3a5d34', '2022-02-17 13:46:00', '2022-02-18 13:46:00', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 'On Going', NULL, NULL, '2022-02-16 13:46:58', '2022-03-03 12:07:01'),
('db16f79c-8eeb-11ec-8742-6c626d3a5d34', '8e30ebd6-8ee8-11ec-8742-6c626d3a5d34', '3edaa7cb-8ee2-11ec-8742-6c626d3a5d34', '2022-02-17 13:46:00', '2022-02-18 13:46:00', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 'On Going', NULL, NULL, '2022-02-16 13:46:58', '2022-02-16 14:17:58'),
('db1866d0-8eeb-11ec-8742-6c626d3a5d34', '8e30ebd6-8ee8-11ec-8742-6c626d3a5d34', '5fd664e0-8ee2-11ec-8742-6c626d3a5d34', '2022-02-17 13:46:00', '2022-02-18 13:46:00', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 'Completed', '2022-02-16 14:18:04', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '2022-02-16 13:46:58', '2022-02-16 14:18:04'),
('db18e2df-8eeb-11ec-8742-6c626d3a5d34', '8e30ebd6-8ee8-11ec-8742-6c626d3a5d34', '7d37f543-8ee2-11ec-8742-6c626d3a5d34', '2022-02-17 13:46:00', '2022-02-18 13:46:00', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 'On Going', NULL, NULL, '2022-02-16 13:46:58', '2022-03-03 12:07:13'),
('db191603-8eeb-11ec-8742-6c626d3a5d34', '8e30ebd6-8ee8-11ec-8742-6c626d3a5d34', '4ebcc5d1-8ee2-11ec-8742-6c626d3a5d34', '2022-02-17 13:46:00', '2022-02-18 13:46:00', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 'Pending', NULL, NULL, '2022-02-16 13:46:58', '2022-02-16 13:46:58'),
('db1992df-8eeb-11ec-8742-6c626d3a5d34', '8e30ebd6-8ee8-11ec-8742-6c626d3a5d34', '901d96f3-8ee2-11ec-8742-6c626d3a5d34', '2022-02-17 13:46:00', '2022-02-18 13:46:00', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 'Pending', NULL, NULL, '2022-02-16 13:46:58', '2022-02-16 13:46:58');

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_tasks`
--

CREATE TABLE `onboarding_tasks` (
  `onboarding_task_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `task_type` varchar(255) NOT NULL,
  `is_general` tinyint(1) NOT NULL,
  `sub_department_id` varchar(36) NOT NULL,
  `added_by` varchar(36) NOT NULL,
  `updated_by` varchar(36) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `onboarding_tasks`
--

INSERT INTO `onboarding_tasks` (`onboarding_task_id`, `title`, `description`, `task_type`, `is_general`, `sub_department_id`, `added_by`, `updated_by`, `is_deleted`, `created_at`, `updated_at`) VALUES
('2c03ee83-8ee2-11ec-8742-6c626d3a5d34', 'Meet the employees of the team', 'Meet the employees of the team', 'For new employees', 1, '624fac3b-8bde-11ec-88c9-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 0, '2022-02-16 12:37:39', '2022-02-16 12:37:39'),
('3edaa7cb-8ee2-11ec-8742-6c626d3a5d34', 'Work for the first activities', 'Work for the first activities as a new employee', 'For new employees', 1, '624fac3b-8bde-11ec-88c9-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 0, '2022-02-16 12:38:10', '2022-02-16 12:38:10'),
('4ebcc5d1-8ee2-11ec-8742-6c626d3a5d34', 'Sign the documents and papers for management', 'Sign the documents and papers for management', 'For new employees', 1, '624fac3b-8bde-11ec-88c9-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 0, '2022-02-16 12:38:37', '2022-02-16 12:38:37'),
('5fd664e0-8ee2-11ec-8742-6c626d3a5d34', 'Welcome the new employee', 'Welcome the new employee', 'For the team', 1, '624fac3b-8bde-11ec-88c9-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 0, '2022-02-16 12:39:06', '2022-02-16 12:39:06'),
('7d37f543-8ee2-11ec-8742-6c626d3a5d34', 'Introduce the new employee to the team', 'Introduce the new employee to the team', 'For department manager', 1, '624fac3b-8bde-11ec-88c9-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 0, '2022-02-16 12:39:55', '2022-02-16 12:39:55'),
('901d96f3-8ee2-11ec-8742-6c626d3a5d34', 'Assign the first tasks and activities', 'Assign the first tasks and activities', 'For department manager', 1, '624fac3b-8bde-11ec-88c9-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', '7aaa5807-8d48-11ec-a6db-6c626d3a5d34', 0, '2022-02-16 12:40:27', '2022-02-16 12:40:27'),
('a98357af-9498-11ec-a5cb-6c626d3a5d34', 'sdf', 'sdfsdfsdfsd', 'For new employees', 0, '04dff98e-8bdf-11ec-88c9-6c626d3a5d34', 'a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', 'a61b1699-8cd5-11ec-8d3b-6c626d3a5d34', 0, '2022-02-23 19:06:34', '2022-02-23 19:06:34');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `position_id` varchar(36) NOT NULL,
  `sub_department_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`position_id`, `sub_department_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
('0709ba31-8d49-11ec-a6db-6c626d3a5d34', '4c151c72-8bde-11ec-88c9-6c626d3a5d34', 'Critical Nurse (ICU)', 'Critical Nurse (ICU)', '2022-02-14 11:48:53', '2022-02-14 11:48:53'),
('1231b264-8be7-11ec-88c9-6c626d3a5d34', '624fac3b-8bde-11ec-88c9-6c626d3a5d34', 'Outpatient Coder', 'Outpatient Coder', '2022-02-12 17:35:10', '2022-02-12 17:35:10'),
('1789d150-8be5-11ec-88c9-6c626d3a5d34', '0cb5bf67-8be5-11ec-88c9-6c626d3a5d34', 'Department Head', 'Department Head', '2022-02-12 17:21:00', '2022-02-12 17:21:00'),
('229c244f-8be7-11ec-88c9-6c626d3a5d34', '624fac3b-8bde-11ec-88c9-6c626d3a5d34', 'Nurse Practitioner', 'Nurse Practitioner', '2022-02-12 17:35:37', '2022-02-12 17:35:37'),
('2c7a275d-8d49-11ec-a6db-6c626d3a5d34', '4c151c72-8bde-11ec-88c9-6c626d3a5d34', 'ICU Administrator', 'ICU Administrator', '2022-02-14 11:49:55', '2022-02-14 11:49:55'),
('3c8e1a7b-8be0-11ec-88c9-6c626d3a5d34', '04dff98e-8bdf-11ec-88c9-6c626d3a5d34', 'Business Analyst', 'Business Analyst', '2022-02-12 16:46:14', '2022-02-12 16:46:14'),
('489d836a-8be8-11ec-88c9-6c626d3a5d34', '95f5c29a-8bde-11ec-88c9-6c626d3a5d34', 'Department Manager', 'Department Manager', '2022-02-12 17:43:50', '2022-02-12 17:43:50'),
('4e64359d-8be7-11ec-88c9-6c626d3a5d34', '624fac3b-8bde-11ec-88c9-6c626d3a5d34', 'Department Manager', 'Department Manager', '2022-02-12 17:36:51', '2022-02-12 17:36:51'),
('51d613bf-8d49-11ec-a6db-6c626d3a5d34', '4c151c72-8bde-11ec-88c9-6c626d3a5d34', 'Pediatric Nurse (ICU)', 'Pediatric Nurse (ICU)', '2022-02-14 11:50:58', '2022-02-14 11:50:58'),
('53724726-8be3-11ec-88c9-6c626d3a5d34', '37c6b2d0-8be3-11ec-88c9-6c626d3a5d34', 'Department Head', 'Department Head', '2022-02-12 17:08:21', '2022-02-12 17:08:21'),
('54f2385c-8be0-11ec-88c9-6c626d3a5d34', '04dff98e-8bdf-11ec-88c9-6c626d3a5d34', 'System Analyst', 'System Analyst', '2022-02-12 16:46:55', '2022-02-12 16:46:55'),
('63f8a921-8d49-11ec-a6db-6c626d3a5d34', '4c151c72-8bde-11ec-88c9-6c626d3a5d34', 'Coronary Care Nurse (ICU)', 'Coronary Care Nurse (ICU)', '2022-02-14 11:51:29', '2022-02-14 11:51:29'),
('710b702c-8be7-11ec-88c9-6c626d3a5d34', '624fac3b-8bde-11ec-88c9-6c626d3a5d34', 'Physical Therapist', 'Physical Therapist', '2022-02-12 17:37:49', '2022-02-12 17:37:49'),
('7837cc9e-8be7-11ec-88c9-6c626d3a5d34', '624fac3b-8bde-11ec-88c9-6c626d3a5d34', 'Physician Assistant', 'Physician Assistant', '2022-02-12 17:38:01', '2022-02-12 17:38:01'),
('8817f963-8be0-11ec-88c9-6c626d3a5d34', '04dff98e-8bdf-11ec-88c9-6c626d3a5d34', 'IT Project Manager', 'IT Project Manager', '2022-02-12 16:48:21', '2022-02-12 16:48:21'),
('93d489e2-8be0-11ec-88c9-6c626d3a5d34', '04dff98e-8bdf-11ec-88c9-6c626d3a5d34', 'Department Manager', 'Department Manager', '2022-02-12 16:48:41', '2022-02-12 16:48:41'),
('995f4383-8be7-11ec-88c9-6c626d3a5d34', '624fac3b-8bde-11ec-88c9-6c626d3a5d34', 'Dietician', 'Dietician', '2022-02-12 17:38:56', '2022-02-12 17:38:56'),
('b2b030fa-8be7-11ec-88c9-6c626d3a5d34', '95f5c29a-8bde-11ec-88c9-6c626d3a5d34', 'Hiring Manager', 'Hiring Manager', '2022-02-12 17:39:39', '2022-02-12 17:39:39'),
('bb021c23-8be7-11ec-88c9-6c626d3a5d34', '95f5c29a-8bde-11ec-88c9-6c626d3a5d34', 'Talent Recruiter', 'Talent Recruiter', '2022-02-12 17:39:53', '2022-02-12 17:39:53'),
('e43b841d-8d48-11ec-a6db-6c626d3a5d34', '4c151c72-8bde-11ec-88c9-6c626d3a5d34', 'Department Manager', 'Department Manager', '2022-02-14 11:47:54', '2022-02-14 11:47:54'),
('f771dfa5-8d51-11ec-a6db-6c626d3a5d34', 'f2a11638-8be5-11ec-88c9-6c626d3a5d34', 'Department Head', 'Department Head', '2022-02-14 12:52:52', '2022-02-14 12:52:52');

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
  `name` varchar(36) NOT NULL,
  `redirect_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `subsystem`, `name`, `redirect_url`) VALUES
('5fb7fb8a-8bea-11ec-88c9-6c626d3a5d34', 'Recruitment', 'Department Head', '/link'),
('743c3ae2-8bea-11ec-88c9-6c626d3a5d34', 'Recruitment', 'Department Manager', '/link'),
('7a3424c7-8bea-11ec-88c9-6c626d3a5d34', 'Recruitment', 'Hiring Manager', '/link'),
('84fdd034-8bea-11ec-88c9-6c626d3a5d34', 'Recruitment', 'Talent Recruiter', '/link');

-- --------------------------------------------------------

--
-- Table structure for table `sub_departments`
--

CREATE TABLE `sub_departments` (
  `sub_department_id` varchar(36) NOT NULL,
  `department_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sub_departments`
--

INSERT INTO `sub_departments` (`sub_department_id`, `department_id`, `name`, `description`, `location`, `created_at`, `updated_at`) VALUES
('04dff98e-8bdf-11ec-88c9-6c626d3a5d34', 'ffb8fd3e-8bd7-11ec-88c9-6c626d3a5d34', 'IT Management & Administration Department', 'IT Management & Administration Department', 'Punturin, Valenzuela City', '2022-02-12 16:37:31', '2022-02-12 16:37:31'),
('0cb5bf67-8be5-11ec-88c9-6c626d3a5d34', '40accb96-8bda-11ec-88c9-6c626d3a5d34', 'Hospital Core Department', 'Hospital Core Department', 'Don Fabian St., Commonwealth, Quezon City', '2022-02-12 17:20:41', '2022-02-12 17:20:41'),
('37c6b2d0-8be3-11ec-88c9-6c626d3a5d34', 'ffb8fd3e-8bd7-11ec-88c9-6c626d3a5d34', 'Information Technology (IT) Department', 'Information Technology (IT) Department', 'Punturin, Valenzuela City', '2022-02-12 17:07:35', '2022-02-12 17:07:35'),
('4c151c72-8bde-11ec-88c9-6c626d3a5d34', '40accb96-8bda-11ec-88c9-6c626d3a5d34', 'Intensive Care Unit (ICU) Department', 'Intensive Care Unit (ICU) Department', 'Don Fabian St., Commonwealth, Quezon City', '2022-02-12 16:32:21', '2022-02-12 16:32:21'),
('624fac3b-8bde-11ec-88c9-6c626d3a5d34', '40accb96-8bda-11ec-88c9-6c626d3a5d34', 'Out-Patient (OPD) Department', 'Out-Patient (OPD) Department', 'Tandang Sora, Quezon City', '2022-02-12 16:32:59', '2022-02-12 16:32:59'),
('95f5c29a-8bde-11ec-88c9-6c626d3a5d34', 'ea5d5b3b-8bd7-11ec-88c9-6c626d3a5d34', 'Recruitment Management Department', 'Recruitment Management Department', 'North Fairview, Quezon City', '2022-02-12 16:34:25', '2022-02-12 16:34:25'),
('f2a11638-8be5-11ec-88c9-6c626d3a5d34', 'ea5d5b3b-8bd7-11ec-88c9-6c626d3a5d34', 'Human Resource (HR) Department', 'Human Resource (HR) Department', 'North Fairview, Quezon City', '2022-02-12 17:27:07', '2022-02-12 17:27:07');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`) VALUES
('1fbf67ad-8cd6-11ec-8d3b-6c626d3a5d34', '16905375-8cd6-11ec-8d3b-6c626d3a5d34', '743c3ae2-8bea-11ec-88c9-6c626d3a5d34'),
('21b0fa09-8cd3-11ec-8d3b-6c626d3a5d34', '15ff06af-8cd3-11ec-8d3b-6c626d3a5d34', '5fb7fb8a-8bea-11ec-88c9-6c626d3a5d34'),
('28c42ba9-8cd5-11ec-8d3b-6c626d3a5d34', '20ddf0b0-8cd5-11ec-8d3b-6c626d3a5d34', '743c3ae2-8bea-11ec-88c9-6c626d3a5d34'),
('50080620-8d52-11ec-a6db-6c626d3a5d34', '49aaca6d-8d52-11ec-a6db-6c626d3a5d34', '5fb7fb8a-8bea-11ec-88c9-6c626d3a5d34'),
('8c28400a-8d5d-11ec-a6db-6c626d3a5d34', '7ef3790c-8d5d-11ec-a6db-6c626d3a5d34', '84fdd034-8bea-11ec-88c9-6c626d3a5d34'),
('9477874c-8d48-11ec-a6db-6c626d3a5d34', '8bcfe3b2-8d48-11ec-a6db-6c626d3a5d34', '743c3ae2-8bea-11ec-88c9-6c626d3a5d34'),
('a52c492a-8d49-11ec-a6db-6c626d3a5d34', 'a0d6df83-8d49-11ec-a6db-6c626d3a5d34', '743c3ae2-8bea-11ec-88c9-6c626d3a5d34'),
('ce0d4437-8d52-11ec-a6db-6c626d3a5d34', 'bde6f60c-8d52-11ec-a6db-6c626d3a5d34', '7a3424c7-8bea-11ec-88c9-6c626d3a5d34'),
('d3fc516e-8bf1-11ec-88c9-6c626d3a5d34', '4f665ff4-8bef-11ec-88c9-6c626d3a5d34', '5fb7fb8a-8bea-11ec-88c9-6c626d3a5d34'),
('eef137bd-8d4a-11ec-a6db-6c626d3a5d34', 'daede201-8d4a-11ec-a6db-6c626d3a5d34', '5fb7fb8a-8bea-11ec-88c9-6c626d3a5d34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicants`
--
ALTER TABLE `applicants`
  ADD PRIMARY KEY (`applicant_id`),
  ADD UNIQUE KEY `resume` (`resume`),
  ADD KEY `job_post_id` (`job_post_id`),
  ADD KEY `evaluated_by` (`evaluated_by`),
  ADD KEY `screened_by` (`screened_by`),
  ADD KEY `hired_by` (`hired_by`),
  ADD KEY `rejected_by` (`rejected_by`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `position_id` (`position_id`),
  ADD KEY `employment_type_id` (`employment_type_id`),
  ADD KEY `employees_ibfk_3` (`user_id`);

--
-- Indexes for table `employment_types`
--
ALTER TABLE `employment_types`
  ADD PRIMARY KEY (`employment_type_id`);

--
-- Indexes for table `internal_users`
--
ALTER TABLE `internal_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `interviewees`
--
ALTER TABLE `interviewees`
  ADD PRIMARY KEY (`interviewee_id`),
  ADD KEY `applicant_id` (`applicant_id`),
  ADD KEY `interview_schedule_id` (`interview_schedule_id`);

--
-- Indexes for table `interview_questions`
--
ALTER TABLE `interview_questions`
  ADD PRIMARY KEY (`interview_question_id`),
  ADD KEY `added_by` (`added_by`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `interview_schedules`
--
ALTER TABLE `interview_schedules`
  ADD PRIMARY KEY (`interview_schedule_id`),
  ADD KEY `job_post_id` (`job_post_id`),
  ADD KEY `set_by` (`set_by`);

--
-- Indexes for table `interview_scores`
--
ALTER TABLE `interview_scores`
  ADD PRIMARY KEY (`interview_score_id`),
  ADD KEY `interviewee_id` (`interviewee_id`),
  ADD KEY `interview_question_id` (`interview_question_id`),
  ADD KEY `scored_by` (`scored_by`);

--
-- Indexes for table `job_categories`
--
ALTER TABLE `job_categories`
  ADD PRIMARY KEY (`job_category_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `job_posts`
--
ALTER TABLE `job_posts`
  ADD PRIMARY KEY (`job_post_id`),
  ADD KEY `manpower_request_id` (`manpower_request_id`),
  ADD KEY `job_category_id` (`job_category_id`),
  ADD KEY `posted_by` (`posted_by`);

--
-- Indexes for table `manpower_requests`
--
ALTER TABLE `manpower_requests`
  ADD PRIMARY KEY (`manpower_request_id`),
  ADD UNIQUE KEY `requisition_no` (`requisition_no`),
  ADD KEY `requested_by` (`requested_by`),
  ADD KEY `position_id` (`position_id`),
  ADD KEY `employment_type_id` (`employment_type_id`),
  ADD KEY `signed_by` (`signed_by`),
  ADD KEY `reviewed_by` (`reviewed_by`),
  ADD KEY `rejected_by` (`rejected_by`);

--
-- Indexes for table `onboarding_employees`
--
ALTER TABLE `onboarding_employees`
  ADD PRIMARY KEY (`onboarding_employee_id`),
  ADD UNIQUE KEY `employment_contract` (`employment_contract`),
  ADD KEY `position_id` (`position_id`),
  ADD KEY `signed_by` (`signed_by`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `onboarding_employee_task`
--
ALTER TABLE `onboarding_employee_task`
  ADD PRIMARY KEY (`onboarding_employee_task_id`),
  ADD KEY `onboarding_employee_id` (`onboarding_employee_id`),
  ADD KEY `onboarding_task_id` (`onboarding_task_id`),
  ADD KEY `assigned_by` (`assigned_by`),
  ADD KEY `completed_by` (`completed_by`);

--
-- Indexes for table `onboarding_tasks`
--
ALTER TABLE `onboarding_tasks`
  ADD PRIMARY KEY (`onboarding_task_id`),
  ADD KEY `sub_department_id` (`sub_department_id`),
  ADD KEY `added_by` (`added_by`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`position_id`),
  ADD KEY `sub_department_id` (`sub_department_id`);

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
-- Indexes for table `sub_departments`
--
ALTER TABLE `sub_departments`
  ADD PRIMARY KEY (`sub_department_id`),
  ADD KEY `department_id` (`department_id`);

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
-- Constraints for table `applicants`
--
ALTER TABLE `applicants`
  ADD CONSTRAINT `applicants_ibfk_1` FOREIGN KEY (`job_post_id`) REFERENCES `job_posts` (`job_post_id`),
  ADD CONSTRAINT `applicants_ibfk_2` FOREIGN KEY (`evaluated_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `applicants_ibfk_3` FOREIGN KEY (`screened_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `applicants_ibfk_4` FOREIGN KEY (`hired_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `applicants_ibfk_5` FOREIGN KEY (`rejected_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`),
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`employment_type_id`) REFERENCES `employment_types` (`employment_type_id`),
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `internal_users` (`id`);

--
-- Constraints for table `interviewees`
--
ALTER TABLE `interviewees`
  ADD CONSTRAINT `interviewees_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`applicant_id`),
  ADD CONSTRAINT `interviewees_ibfk_2` FOREIGN KEY (`interview_schedule_id`) REFERENCES `interview_schedules` (`interview_schedule_id`);

--
-- Constraints for table `interview_questions`
--
ALTER TABLE `interview_questions`
  ADD CONSTRAINT `interview_questions_ibfk_1` FOREIGN KEY (`added_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `interview_questions_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `interview_schedules`
--
ALTER TABLE `interview_schedules`
  ADD CONSTRAINT `interview_schedules_ibfk_1` FOREIGN KEY (`job_post_id`) REFERENCES `job_posts` (`job_post_id`),
  ADD CONSTRAINT `interview_schedules_ibfk_2` FOREIGN KEY (`set_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `interview_scores`
--
ALTER TABLE `interview_scores`
  ADD CONSTRAINT `interview_scores_ibfk_1` FOREIGN KEY (`interviewee_id`) REFERENCES `interviewees` (`interviewee_id`),
  ADD CONSTRAINT `interview_scores_ibfk_2` FOREIGN KEY (`interview_question_id`) REFERENCES `interview_questions` (`interview_question_id`),
  ADD CONSTRAINT `interview_scores_ibfk_3` FOREIGN KEY (`scored_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `job_categories`
--
ALTER TABLE `job_categories`
  ADD CONSTRAINT `job_categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `job_posts`
--
ALTER TABLE `job_posts`
  ADD CONSTRAINT `job_posts_ibfk_1` FOREIGN KEY (`manpower_request_id`) REFERENCES `manpower_requests` (`manpower_request_id`),
  ADD CONSTRAINT `job_posts_ibfk_2` FOREIGN KEY (`job_category_id`) REFERENCES `job_categories` (`job_category_id`),
  ADD CONSTRAINT `job_posts_ibfk_3` FOREIGN KEY (`posted_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `manpower_requests`
--
ALTER TABLE `manpower_requests`
  ADD CONSTRAINT `manpower_requests_ibfk_1` FOREIGN KEY (`requested_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `manpower_requests_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`),
  ADD CONSTRAINT `manpower_requests_ibfk_3` FOREIGN KEY (`employment_type_id`) REFERENCES `employment_types` (`employment_type_id`),
  ADD CONSTRAINT `manpower_requests_ibfk_4` FOREIGN KEY (`signed_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `manpower_requests_ibfk_5` FOREIGN KEY (`reviewed_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `manpower_requests_ibfk_6` FOREIGN KEY (`rejected_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `onboarding_employees`
--
ALTER TABLE `onboarding_employees`
  ADD CONSTRAINT `onboarding_employees_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`),
  ADD CONSTRAINT `onboarding_employees_ibfk_2` FOREIGN KEY (`signed_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `onboarding_employees_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `onboarding_employee_task`
--
ALTER TABLE `onboarding_employee_task`
  ADD CONSTRAINT `onboarding_employee_task_ibfk_1` FOREIGN KEY (`onboarding_employee_id`) REFERENCES `onboarding_employees` (`onboarding_employee_id`),
  ADD CONSTRAINT `onboarding_employee_task_ibfk_2` FOREIGN KEY (`onboarding_task_id`) REFERENCES `onboarding_tasks` (`onboarding_task_id`),
  ADD CONSTRAINT `onboarding_employee_task_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `onboarding_employee_task_ibfk_4` FOREIGN KEY (`completed_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `onboarding_tasks`
--
ALTER TABLE `onboarding_tasks`
  ADD CONSTRAINT `onboarding_tasks_ibfk_1` FOREIGN KEY (`sub_department_id`) REFERENCES `sub_departments` (`sub_department_id`),
  ADD CONSTRAINT `onboarding_tasks_ibfk_2` FOREIGN KEY (`added_by`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `onboarding_tasks_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `positions`
--
ALTER TABLE `positions`
  ADD CONSTRAINT `positions_ibfk_1` FOREIGN KEY (`sub_department_id`) REFERENCES `sub_departments` (`sub_department_id`);

--
-- Constraints for table `public_profiles`
--
ALTER TABLE `public_profiles`
  ADD CONSTRAINT `public_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `public_users` (`id`);

--
-- Constraints for table `sub_departments`
--
ALTER TABLE `sub_departments`
  ADD CONSTRAINT `sub_departments_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`);

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
