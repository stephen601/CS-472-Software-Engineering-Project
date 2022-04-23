-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Apr 23, 2022 at 08:52 PM
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`ShowID`, `ShowName`, `ShowDate`, `ShowTime`, `ShowPrice`) VALUES
(32, 'newName', '2022-04-25', '16:25:00', 0),
(33, 'testShow', '2022-04-21', '15:25:00', 0);

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
  `Receipt ID` int(11) NOT NULL,
  `ShowName` char(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ShowDate` date NOT NULL,
  `ShowTime` time NOT NULL,
  `SeatNumber` int(11) NOT NULL,
  `FinalPrice` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(32, 0, 5, 0),
(32, 1, 5, 22),
(32, 2, 5, 22),
(32, 3, 5, 22),
(32, 4, 5, 0),
(32, 5, 5, 0),
(32, 6, 5, 0),
(32, 7, 5, 0),
(32, 8, 5, 0),
(32, 9, 5, 0),
(32, 10, 5, 0),
(32, 11, 5, 0),
(32, 12, 5, 0),
(32, 13, 5, 0),
(32, 14, 5, 0),
(32, 15, 5, 0),
(32, 16, 5, 0),
(32, 17, 5, 0),
(32, 18, 5, 0),
(32, 19, 5, 0),
(32, 20, 5, 0),
(32, 21, 5, 0),
(32, 22, 5, 0),
(32, 23, 5, 0),
(32, 24, 5, 0),
(32, 25, 5, 0),
(32, 26, 5, 0),
(32, 27, 5, 0),
(32, 28, 5, 26),
(32, 29, 5, 0),
(32, 30, 5, 26),
(32, 31, 5, 0),
(32, 32, 5, 0),
(32, 33, 5, 0),
(32, 34, 5, 0),
(32, 35, 5, 0),
(32, 36, 5, 0),
(32, 37, 5, 0),
(32, 38, 5, 0),
(32, 39, 5, 0),
(32, 40, 5, 26),
(32, 41, 5, 0),
(32, 42, 5, 0),
(32, 43, 5, 0),
(32, 44, 5, 0),
(32, 45, 5, 0),
(32, 46, 5, 0),
(32, 47, 5, 0),
(32, 48, 5, 0),
(32, 49, 5, 0),
(32, 50, 5, 0),
(32, 51, 5, 0),
(32, 52, 5, 0),
(32, 53, 5, 0),
(32, 54, 5, 0),
(32, 55, 5, 0),
(32, 56, 5, 0),
(32, 57, 5, 0),
(32, 58, 5, 0),
(32, 59, 5, 0),
(32, 60, 5, 0),
(32, 61, 5, 0),
(32, 62, 5, 0),
(32, 63, 5, 0),
(32, 64, 5, 0),
(32, 65, 5, 0),
(32, 66, 5, 0),
(32, 67, 5, 0),
(32, 68, 5, 0),
(32, 69, 5, 0),
(32, 70, 5, 0),
(32, 71, 5, 0),
(32, 72, 5, 0),
(32, 73, 5, 0),
(32, 74, 5, 0),
(32, 75, 5, 0),
(32, 76, 5, 0),
(32, 77, 5, 0),
(32, 78, 5, 0),
(32, 79, 5, 0),
(32, 80, 5, 0),
(32, 81, 5, 0),
(32, 82, 5, 0),
(32, 83, 5, 0),
(32, 84, 5, 0),
(32, 85, 5, 0),
(32, 86, 5, 0),
(32, 87, 5, 0),
(32, 88, 5, 0),
(32, 89, 5, 0),
(32, 90, 5, 0),
(32, 91, 5, 0),
(32, 92, 5, 0),
(32, 93, 5, 0),
(32, 94, 5, 0),
(32, 95, 5, 0),
(33, 0, 5, 0),
(33, 1, 5, 0),
(33, 2, 5, 0),
(33, 3, 5, 0),
(33, 4, 5, 22),
(33, 5, 5, 22),
(33, 6, 5, 22),
(33, 7, 5, 0),
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
(33, 19, 5, 0),
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
(33, 38, 5, 0),
(33, 39, 5, 0),
(33, 40, 5, 0),
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
(33, 51, 5, 0),
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
(33, 62, 5, 0),
(33, 63, 5, 0),
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
(33, 95, 5, 0);

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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`ID`, `Username`, `Password`, `IsAdmin`, `Dob`, `Phone`, `Address`, `Email`) VALUES
(26, 'Jeru', 'testPass', 0, '1994-03-29', '15552350', '123 Place', 'myName@site.com'),
(27, 'UserName2', 'Password', 0, '1991-03-24', '21312412', 'Address', 'Email');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
