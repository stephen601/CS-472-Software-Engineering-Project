-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: May 11, 2022 at 12:12 AM
-- Server version: 10.6.5-MariaDB
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `customereventinfo`
--

DROP TABLE IF EXISTS `customereventinfo`;
CREATE TABLE IF NOT EXISTS `customereventinfo` (
  `CustomerEventID` int(11) NOT NULL,
  `Customer ID` int(11) NOT NULL,
  `Event ID` int(11) NOT NULL,
  `SeatID` int(11) NOT NULL,
  `Receipt ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_profile`
--

DROP TABLE IF EXISTS `customer_profile`;
CREATE TABLE IF NOT EXISTS `customer_profile` (
  `ID` int(11) NOT NULL,
  `Age` int(11) NOT NULL,
  `Phone` char(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Address` char(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` char(150) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_profile`
--

INSERT INTO `customer_profile` (`ID`, `Age`, `Phone`, `Address`, `Email`) VALUES
(1, 30, '5755555555', 'main st.', 'j.d@email.com');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
CREATE TABLE IF NOT EXISTS `event` (
  `ShowID` int(11) NOT NULL AUTO_INCREMENT,
  `ShowName` char(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ShowDate` date NOT NULL,
  `ShowTime` time NOT NULL,
  `ShowPrice` double NOT NULL,
  PRIMARY KEY (`ShowID`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`ShowID`, `ShowName`, `ShowDate`, `ShowTime`, `ShowPrice`) VALUES
(33, 'testShow', '2022-04-21', '15:25:00', 0),
(35, 'Hamlet', '2022-05-11', '17:30:00', 0),
(36, 'Death of the Salesman', '2022-05-12', '19:00:00', 0),
(37, 'Our Town', '2022-05-20', '09:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `payment_info`
--

DROP TABLE IF EXISTS `payment_info`;
CREATE TABLE IF NOT EXISTS `payment_info` (
  `ID` int(11) NOT NULL,
  `Name` char(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Possibly many to many',
  `CardNumber` int(11) NOT NULL,
  `CardType` char(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ZipCode` int(12) NOT NULL,
  `SecurityCode` int(5) NOT NULL,
  `Pin` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

DROP TABLE IF EXISTS `receipt`;
CREATE TABLE IF NOT EXISTS `receipt` (
  `ReceiptID` int(11) NOT NULL AUTO_INCREMENT,
  `DateTime` datetime NOT NULL,
  `UserID` int(11) NOT NULL,
  `Purchase` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FinalPrice` double NOT NULL,
  PRIMARY KEY (`ReceiptID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `receipt`
--

INSERT INTO `receipt` (`ReceiptID`, `DateTime`, `UserID`, `Purchase`, `FinalPrice`) VALUES
(11, '2022-04-26 01:36:44', 26, '33-38-33-39-33-40-33-51-33-63-33-62', 0),
(17, '2022-05-09 00:51:57', 26, '35-94-35-93-35-92', 30),
(18, '2022-05-09 00:54:16', 26, '35-8-35-6-35-5-35-7-35-9-35-10-35-26-35-27-35-28-35-29', 50),
(19, '2022-05-09 00:55:06', 26, '37-93-37-81-37-80-37-92-37-91-37-79-37-25-37-26-37-27-37-28-37-85-37-84', 250),
(21, '2022-05-09 01:12:25', 30, '35-85-35-86-37-94-37-95', 40);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
CREATE TABLE IF NOT EXISTS `reports` (
  `Ticket#` int(11) NOT NULL,
  `Date` date NOT NULL,
  `TicketsSold` int(11) NOT NULL,
  `ShowPrice` double NOT NULL,
  `SeatPrice` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`Ticket#`, `Date`, `TicketsSold`, `ShowPrice`, `SeatPrice`) VALUES
(1, '2022-03-16', 1, 9.99, 5);

-- --------------------------------------------------------

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
CREATE TABLE IF NOT EXISTS `seats` (
  `ShowID` int(11) NOT NULL,
  `SeatID` int(11) NOT NULL,
  `SeatPrice` double NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seats`
--

INSERT INTO `seats` (`ShowID`, `SeatID`, `SeatPrice`, `UserID`) VALUES
(33, 0, 5, 0),
(33, 1, 5, 0),
(33, 2, 5, 0),
(33, 3, 5, 0),
(33, 4, 5, 22),
(33, 5, 5, 22),
(33, 6, 5, 22),
(33, 7, 5, 26),
(33, 8, 5, 0),
(33, 9, 5, 0),
(33, 10, 5, 0),
(33, 11, 5, 0),
(33, 12, 5, 0),
(33, 13, 5, 0),
(33, 14, 5, 0),
(33, 15, 5, 0),
(33, 16, 5, 0),
(33, 17, 5, 0),
(33, 18, 5, 0),
(33, 19, 5, 26),
(33, 20, 5, 0),
(33, 21, 5, 0),
(33, 22, 5, 0),
(33, 23, 5, 0),
(33, 24, 5, 0),
(33, 25, 5, 0),
(33, 26, 5, 0),
(33, 27, 5, 0),
(33, 28, 5, 0),
(33, 29, 5, 0),
(33, 30, 5, 0),
(33, 31, 5, 0),
(33, 32, 5, 0),
(33, 33, 5, 0),
(33, 34, 5, 0),
(33, 35, 5, 0),
(33, 36, 5, 0),
(33, 37, 5, 0),
(33, 38, 5, 26),
(33, 39, 5, 26),
(33, 40, 5, 26),
(33, 41, 5, 0),
(33, 42, 5, 26),
(33, 43, 5, 0),
(33, 44, 5, 0),
(33, 45, 5, 0),
(33, 46, 5, 0),
(33, 47, 5, 0),
(33, 48, 5, 0),
(33, 49, 5, 0),
(33, 50, 5, 0),
(33, 51, 5, 26),
(33, 52, 5, 0),
(33, 53, 5, 0),
(33, 54, 5, 26),
(33, 55, 5, 0),
(33, 56, 5, 0),
(33, 57, 5, 0),
(33, 58, 5, 0),
(33, 59, 5, 0),
(33, 60, 5, 0),
(33, 61, 5, 0),
(33, 62, 5, 26),
(33, 63, 5, 26),
(33, 64, 5, 0),
(33, 65, 5, 0),
(33, 66, 5, 26),
(33, 67, 5, 0),
(33, 68, 5, 0),
(33, 69, 5, 0),
(33, 70, 5, 0),
(33, 71, 5, 0),
(33, 72, 5, 0),
(33, 73, 5, 0),
(33, 74, 5, 0),
(33, 75, 5, 0),
(33, 76, 5, 0),
(33, 77, 5, 0),
(33, 78, 5, 0),
(33, 79, 5, 0),
(33, 80, 5, 0),
(33, 81, 5, 0),
(33, 82, 5, 0),
(33, 83, 5, 0),
(33, 84, 5, 0),
(33, 85, 5, 0),
(33, 86, 5, 0),
(33, 87, 5, 0),
(33, 88, 5, 0),
(33, 89, 5, 0),
(33, 90, 5, 0),
(33, 91, 5, 0),
(33, 92, 5, 0),
(33, 93, 5, 0),
(33, 94, 5, 0),
(33, 95, 5, 0),
(35, 0, 20, 0),
(35, 1, 5, 0),
(35, 2, 5, 0),
(35, 3, 5, 0),
(35, 4, 5, 0),
(35, 5, 5, 26),
(35, 6, 5, 26),
(35, 7, 5, 26),
(35, 8, 5, 26),
(35, 9, 5, 26),
(35, 10, 5, 26),
(35, 11, 20, 0),
(35, 12, 20, 0),
(35, 13, 5, 0),
(35, 14, 5, 0),
(35, 15, 5, 0),
(35, 16, 5, 0),
(35, 17, 5, 0),
(35, 18, 5, 0),
(35, 19, 5, 0),
(35, 20, 5, 0),
(35, 21, 5, 0),
(35, 22, 5, 0),
(35, 23, 20, 0),
(35, 24, 20, 0),
(35, 25, 5, 0),
(35, 26, 5, 26),
(35, 27, 5, 26),
(35, 28, 5, 26),
(35, 29, 5, 26),
(35, 30, 5, 0),
(35, 31, 5, 0),
(35, 32, 5, 0),
(35, 33, 5, 0),
(35, 34, 5, 0),
(35, 35, 20, 0),
(35, 36, 20, 0),
(35, 37, 5, 0),
(35, 38, 5, 0),
(35, 39, 5, 0),
(35, 40, 5, 0),
(35, 41, 5, 0),
(35, 42, 5, 0),
(35, 43, 5, 0),
(35, 44, 5, 0),
(35, 45, 5, 0),
(35, 46, 5, 0),
(35, 47, 20, 0),
(35, 48, 20, 0),
(35, 49, 5, 0),
(35, 50, 5, 0),
(35, 51, 5, 0),
(35, 52, 5, 0),
(35, 53, 5, 0),
(35, 54, 5, 0),
(35, 55, 5, 0),
(35, 56, 5, 0),
(35, 57, 5, 0),
(35, 58, 5, 0),
(35, 59, 20, 0),
(35, 60, 20, 0),
(35, 61, 5, 0),
(35, 62, 5, 0),
(35, 63, 5, 0),
(35, 64, 5, 0),
(35, 65, 5, 0),
(35, 66, 5, 0),
(35, 67, 5, 0),
(35, 68, 5, 0),
(35, 69, 5, 0),
(35, 70, 5, 0),
(35, 71, 20, 0),
(35, 72, 20, 0),
(35, 73, 5, 0),
(35, 74, 5, 0),
(35, 75, 5, 0),
(35, 76, 5, 0),
(35, 77, 5, 0),
(35, 78, 5, 0),
(35, 79, 5, 0),
(35, 80, 5, 0),
(35, 81, 5, 0),
(35, 82, 5, 0),
(35, 83, 20, 0),
(35, 84, 10, 0),
(35, 85, 10, 30),
(35, 86, 10, 30),
(35, 87, 10, 0),
(35, 88, 10, 0),
(35, 89, 10, 0),
(35, 90, 10, 0),
(35, 91, 10, 0),
(35, 92, 10, 26),
(35, 93, 10, 26),
(35, 94, 10, 26),
(35, 95, 10, 0),
(36, 0, 20, 0),
(36, 1, 5, 0),
(36, 2, 5, 0),
(36, 3, 5, 0),
(36, 4, 5, 0),
(36, 5, 5, 0),
(36, 6, 5, 0),
(36, 7, 5, 0),
(36, 8, 5, 0),
(36, 9, 5, 0),
(36, 10, 5, 0),
(36, 11, 20, 0),
(36, 12, 20, 0),
(36, 13, 5, 0),
(36, 14, 5, 0),
(36, 15, 5, 0),
(36, 16, 5, 0),
(36, 17, 20, 0),
(36, 18, 5, 0),
(36, 19, 5, 0),
(36, 20, 5, 0),
(36, 21, 5, 0),
(36, 22, 5, 0),
(36, 23, 20, 0),
(36, 24, 20, 0),
(36, 25, 5, 0),
(36, 26, 5, 0),
(36, 27, 5, 0),
(36, 28, 5, 0),
(36, 29, 20, 0),
(36, 30, 5, 0),
(36, 31, 5, 0),
(36, 32, 5, 0),
(36, 33, 5, 0),
(36, 34, 5, 0),
(36, 35, 20, 0),
(36, 36, 20, 0),
(36, 37, 5, 0),
(36, 38, 5, 0),
(36, 39, 5, 0),
(36, 40, 5, 0),
(36, 41, 20, 0),
(36, 42, 5, 0),
(36, 43, 5, 0),
(36, 44, 5, 0),
(36, 45, 5, 0),
(36, 46, 5, 0),
(36, 47, 20, 0),
(36, 48, 20, 0),
(36, 49, 5, 0),
(36, 50, 5, 0),
(36, 51, 5, 0),
(36, 52, 5, 0),
(36, 53, 5, 0),
(36, 54, 5, 0),
(36, 55, 5, 0),
(36, 56, 5, 0),
(36, 57, 5, 0),
(36, 58, 5, 0),
(36, 59, 20, 0),
(36, 60, 20, 0),
(36, 61, 5, 0),
(36, 62, 5, 0),
(36, 63, 5, 0),
(36, 64, 5, 0),
(36, 65, 5, 0),
(36, 66, 5, 0),
(36, 67, 5, 0),
(36, 68, 5, 0),
(36, 69, 5, 0),
(36, 70, 5, 0),
(36, 71, 20, 0),
(36, 72, 20, 0),
(36, 73, 5, 0),
(36, 74, 5, 0),
(36, 75, 5, 0),
(36, 76, 5, 0),
(36, 77, 5, 0),
(36, 78, 5, 0),
(36, 79, 5, 0),
(36, 80, 5, 0),
(36, 81, 5, 0),
(36, 82, 5, 0),
(36, 83, 20, 0),
(36, 84, 10, 0),
(36, 85, 10, 0),
(36, 86, 10, 0),
(36, 87, 10, 0),
(36, 88, 10, 0),
(36, 89, 10, 0),
(36, 90, 10, 0),
(36, 91, 10, 0),
(36, 92, 10, 0),
(36, 93, 10, 0),
(36, 94, 10, 0),
(36, 95, 10, 0),
(37, 0, 5, 0),
(37, 1, 5, 0),
(37, 2, 5, 0),
(37, 3, 5, 0),
(37, 4, 5, 0),
(37, 5, 5, 0),
(37, 6, 5, 0),
(37, 7, 5, 0),
(37, 8, 5, 0),
(37, 9, 5, 0),
(37, 10, 5, 0),
(37, 11, 5, 0),
(37, 12, 5, 0),
(37, 13, 5, 0),
(37, 14, 5, 0),
(37, 15, 5, 0),
(37, 16, 5, 0),
(37, 17, 5, 0),
(37, 18, 5, 0),
(37, 19, 5, 0),
(37, 20, 5, 0),
(37, 21, 5, 0),
(37, 22, 5, 0),
(37, 23, 5, 0),
(37, 24, 5, 0),
(37, 25, 5, 26),
(37, 26, 5, 26),
(37, 27, 5, 26),
(37, 28, 5, 26),
(37, 29, 5, 0),
(37, 30, 5, 0),
(37, 31, 5, 0),
(37, 32, 5, 0),
(37, 33, 5, 0),
(37, 34, 5, 0),
(37, 35, 5, 0),
(37, 36, 5, 0),
(37, 37, 5, 0),
(37, 38, 5, 0),
(37, 39, 5, 0),
(37, 40, 5, 0),
(37, 41, 5, 0),
(37, 42, 5, 0),
(37, 43, 5, 0),
(37, 44, 5, 0),
(37, 45, 5, 0),
(37, 46, 5, 0),
(37, 47, 5, 0),
(37, 48, 10, 0),
(37, 49, 10, 0),
(37, 50, 35, 0),
(37, 51, 35, 0),
(37, 52, 35, 0),
(37, 53, 35, 0),
(37, 54, 35, 0),
(37, 55, 35, 0),
(37, 56, 35, 0),
(37, 57, 35, 0),
(37, 58, 10, 0),
(37, 59, 10, 0),
(37, 60, 10, 0),
(37, 61, 10, 0),
(37, 62, 35, 0),
(37, 63, 35, 0),
(37, 64, 35, 0),
(37, 65, 35, 0),
(37, 66, 35, 0),
(37, 67, 35, 0),
(37, 68, 35, 0),
(37, 69, 35, 0),
(37, 70, 10, 0),
(37, 71, 10, 0),
(37, 72, 10, 0),
(37, 73, 10, 0),
(37, 74, 35, 0),
(37, 75, 35, 0),
(37, 76, 35, 0),
(37, 77, 35, 0),
(37, 78, 35, 0),
(37, 79, 35, 26),
(37, 80, 35, 26),
(37, 81, 35, 26),
(37, 82, 10, 0),
(37, 83, 10, 0),
(37, 84, 10, 26),
(37, 85, 10, 26),
(37, 86, 35, 0),
(37, 87, 35, 0),
(37, 88, 35, 0),
(37, 89, 35, 0),
(37, 90, 35, 0),
(37, 91, 35, 26),
(37, 92, 35, 26),
(37, 93, 35, 26),
(37, 94, 10, 30),
(37, 95, 10, 30);

-- --------------------------------------------------------

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
CREATE TABLE IF NOT EXISTS `user_profile` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` char(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsAdmin` tinyint(4) NOT NULL,
  `Dob` date NOT NULL,
  `Phone` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Address` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`ID`, `Username`, `Password`, `IsAdmin`, `Dob`, `Phone`, `Address`, `Email`) VALUES
(26, 'admin', 'testPass', 1, '1994-03-29', '15552350', '123 Place', 'myName@site.com'),
(27, 'testUser', 'testPass', 0, '1991-03-24', '21312412', 'Address', 'Email');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
