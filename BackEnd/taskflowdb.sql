-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2026 at 12:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskflowdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('todo','doing','done') DEFAULT 'todo',
  `created_by` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `created_by`, `assigned_to`, `created_at`, `updated_at`) VALUES
(1, 'Test Drag & Drop', 'Verify status update on task dragging between To Do, Doing, Done', '', 1, NULL, '2026-09-04 15:38:54', '2026-09-04 15:41:36'),
(3, 'Setup Project Stack', 'Install Next.js, Node.js and MySQL database', '', 1, 1, '2026-09-04 15:38:54', '2026-09-04 15:41:35'),
(10, 'Task 1', NULL, 'done', 18, NULL, '2026-09-05 09:13:34', '2026-09-05 09:13:56'),
(11, 'task 2', NULL, 'todo', 18, NULL, '2026-09-05 09:13:40', '2026-09-05 09:13:40'),
(12, 'Task 3', NULL, 'doing', 18, NULL, '2026-09-05 09:13:47', '2026-09-05 09:13:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'System Admin', 'admin@tf.com', '$2b$10$wTIn6lS5G44/eF4t4eGq/e0U/.w/yT6zU5m.Hq5p8a2jM4y.uW3uK', 'admin', '2026-09-04 15:38:54'),
(10, 'Nethmi', 'admin@nethmi.com', '$2b$10$JHCXjMdET61oM02v34HNr.GrRXUy4MkSFR26eb06SbGRn5P2Xfk4G', 'user', '2026-09-05 07:16:59'),
(11, 'Maleesha', 'admin@maleesha.com', '$2b$10$n9.YK8JDXntyTQlSWJOhQOHy4Io3Mf1CfnmfPwmachOcaWI81XvfC', 'user', '2026-09-05 07:26:05'),
(12, 'abc', 'abc@com', '$2b$10$ue8QCF5/W9uQ7IUgSl/AX.tYP8DTzM1qaR9esQm8vinJZn1tnbYuC', 'user', '2026-09-05 07:33:04'),
(13, 'cde', 'cde@com', '$2b$10$.2UVTYku0EX02jeZNKTsYOrcVi19YnIm/CrXF4Z1ze2xDSCudzCIK', 'user', '2026-09-05 07:36:27'),
(14, 'chethi', 'chethi@com', '$2b$10$3mZ0/R2HqujJjG5Venf3oexDpRJrw72LzO8o1ltj/azABBpmzYeja', 'admin', '2026-09-05 07:46:19'),
(16, 'Pabod', 'pabod@com', '$2b$10$IHkSuK7Ma2xJIH9u8T2eOeITRVwX3MufGyZsGvtewAP0DlIe4figG', 'admin', '2026-09-05 07:47:15'),
(17, 'Nethmi Mlaeesha', 'nethmimaleesha@gmail.com', '$2b$10$/Ib7md/1NncUYoO5iRnnjeBz7qnxqI5.fJyKv94vgyGvaJ3D1zbEW', 'user', '2026-09-05 07:52:59'),
(18, 'Chethisha Pabod HR', 'admin@hr.com', '$2b$10$GOIRn3jnq1aApQfqoLOqjueGLaFKqQ0Qk39m3F/9kbT6DEwoVAB1S', 'admin', '2026-09-05 08:10:38'),
(19, 'System Admin', 'admin@lesstaxi.com', '$2b$10$zmNmdCLw8jjExEZEgCCLSOcWaweoknJuIg0WV671D6QYEcvMnaKOe', 'admin', '2026-09-05 10:05:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
