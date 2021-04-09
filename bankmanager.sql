-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2021 at 07:30 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bankmanager`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int(50) NOT NULL,
  `type` varchar(100) NOT NULL,
  `amount` int(255) NOT NULL,
  `date` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `status` varchar(100) NOT NULL,
  `password` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `type`, `amount`, `date`, `status`, `password`) VALUES
(1, 'Current', 52000, '2021-04-09 08:23:24.000000', 'Active', 1234),
(2, 'Current', 20000, '2021-04-09 04:54:28.000000', 'Active', 1234),
(3, 'Current', 35000, '2021-04-08 23:55:18.000000', 'Active', 1234),
(4, 'Saving', 45000, '2021-04-09 01:56:15.000000', 'Disabled', 1234),
(5, 'Joint', 100000, '2021-04-09 04:56:44.000000', 'Active', 1234);

-- --------------------------------------------------------

--
-- Table structure for table `card`
--

CREATE TABLE `card` (
  `id` varchar(100) NOT NULL,
  `account_id` int(50) NOT NULL,
  `user_id` int(50) NOT NULL,
  `created` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `expiry` date NOT NULL,
  `pin` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `card`
--

INSERT INTO `card` (`id`, `account_id`, `user_id`, `created`, `expiry`, `pin`) VALUES
('123456', 1, 1, '2021-04-23 02:00:29.000000', '2025-04-17', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `Address` varchar(500) NOT NULL,
  `Phone_Number` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `Address`, `Phone_Number`) VALUES
(1, 'Haziq Mumtaz', 'mumtaz.haziq@gmail.com', '598  Brighton Circle Road, MA, USA', '+17202892633'),
(2, 'Shahrukh', 'shahrukh@pookidevs.com', '4005  Reel Avenue, NM, USA', '+17202892634'),
(3, 'Sami', 'sami@gmail.com', '1122  Parrish Avenue', '+17202892635'),
(4, 'Yasir', 'yasir@pookidevs.com', '2177  Jody Road', '+17202892636');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int(50) NOT NULL,
  `account_id` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `account_id`) VALUES
(1, 1),
(3, 2),
(2, 4),
(4, 3),
(1, 5),
(3, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `account_id` (`account_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `card_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`),
  ADD CONSTRAINT `card_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `user_account`
--
ALTER TABLE `user_account`
  ADD CONSTRAINT `user_account_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_account_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
