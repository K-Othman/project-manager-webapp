-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 11, 2025 at 12:41 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `pid` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `short_description` varchar(255) NOT NULL,
  `phase` enum('design','development','testing','deployment','complete') NOT NULL DEFAULT 'design',
  `uid` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`pid`, `title`, `start_date`, `end_date`, `short_description`, `phase`, `uid`, `created_at`) VALUES
(4, 'New Awesome Project', '2024-05-01', '2024-06-01', 'A demo project update created via API.', 'design', 3, '2025-12-02 23:10:48'),
(7, 'Shopping App', '2025-12-30', NULL, 'Shopping App', 'development', 5, '2025-12-08 21:05:52'),
(8, 'Bakery', '2026-01-01', NULL, 'A new bakery project starting with the new year', 'development', 6, '2025-12-09 21:31:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `username`, `password`, `email`, `created_at`) VALUES
(3, 'karim', '$2b$10$Hf98JrpRVQwD3vpdcgP1POS/I7.5KNZ8N9uwHc6xN5DLjwqgMrgBe', 'karim@example.com', '2025-12-02 22:28:40'),
(4, 'kareem', '$2b$10$B3yOdqBWUzCOyX0i8F1t1eB2iZtiy3Q6rV8QCOEST82fXbuoGa6hy', 'karim@gmail.com', '2025-12-08 20:56:30'),
(5, 'Memo', '$2b$10$qMaP.XUzEgYLDbLGtVM4FOnz2KnpE3yuB4XkzoJo0fbWrOFzYiyH.', 'memo@gmail.com', '2025-12-08 21:05:18'),
(6, 'John', '$2b$10$IIFhAPSUaKuAI0lmueix..IkbHXxsuJl6TGXGbie15snSzbmQwN7a', 'john@gmail.com', '2025-12-09 21:30:20'),
(7, 'Alex', '$2b$10$r3pzTzV3836qcC69QcHBlehXgHvAF70wkICkArAVms5OFr79.aHem', 'alex@gmail.com', '2025-12-10 00:16:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `fk_projects_user` (`uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `fk_projects_user` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
