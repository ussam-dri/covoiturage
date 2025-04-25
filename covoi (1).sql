-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2025 at 05:32 AM
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
-- Database: `covoi`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id_trajet` int(11) NOT NULL,
  `id_passenger` int(11) NOT NULL,
  `id_booking` int(11) NOT NULL,
  `status` int(3) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id_trajet`, `id_passenger`, `id_booking`, `status`) VALUES
(11, 20, 42, 0),
(12, 20, 46, 0),
(11, 25, 48, 0),
(13, 20, 52, 0),
(10, 20, 54, 0),
(16, 20, 55, 0),
(14, 25, 58, 0),
(15, 25, 59, 0),
(18, 25, 65, 0);

-- --------------------------------------------------------

--
-- Table structure for table `driverprofile`
--

CREATE TABLE `driverprofile` (
  `id` int(11) NOT NULL,
  `id_driver` int(11) NOT NULL,
  `id_passenger` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `driverprofile`
--

INSERT INTO `driverprofile` (`id`, `id_driver`, `id_passenger`, `rating`, `message`, `created_at`) VALUES
(1, 19, 20, 5, 'hi', '2025-04-18 00:31:43'),
(2, 19, 20, 1, NULL, '2025-04-18 00:47:36'),
(3, 19, 20, 5, NULL, '2025-04-18 01:36:03'),
(4, 19, 20, 5, '1', '2025-04-18 01:36:49'),
(5, 19, 20, 5, NULL, '2025-04-18 01:37:34'),
(6, 19, 20, 5, NULL, '2025-04-18 01:37:47'),
(7, 19, 20, 5, NULL, '2025-04-18 01:37:49'),
(9, 19, 25, 2, 'testtt', '2025-04-18 02:43:48');

-- --------------------------------------------------------

--
-- Table structure for table `trajet`
--

CREATE TABLE `trajet` (
  `id_trajet` int(11) NOT NULL,
  `date_depart` date NOT NULL,
  `date_arrivee` date NOT NULL,
  `heure_depart` time NOT NULL,
  `heure_arrivee` time NOT NULL,
  `ville_depart` varchar(100) NOT NULL,
  `ville_arriver` varchar(100) NOT NULL,
  `prix` double NOT NULL,
  `nbr_places` int(11) NOT NULL,
  `fumer` tinyint(1) NOT NULL,
  `animaux` tinyint(1) NOT NULL,
  `musique` tinyint(1) NOT NULL,
  `marque` varchar(255) DEFAULT NULL,
  `matricule` varchar(255) DEFAULT NULL,
  `id_driver` int(11) DEFAULT NULL,
  `status` int(3) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trajet`
--

INSERT INTO `trajet` (`id_trajet`, `date_depart`, `date_arrivee`, `heure_depart`, `heure_arrivee`, `ville_depart`, `ville_arriver`, `prix`, `nbr_places`, `fumer`, `animaux`, `musique`, `marque`, `matricule`, `id_driver`, `status`) VALUES
(10, '2025-04-06', '2025-04-07', '16:09:00', '16:10:00', 'agadir', 'fes', 122, 8, 0, 0, 0, 'dacia', 'A-12281-33', 19, 1),
(16, '2025-03-30', '2025-04-03', '23:24:00', '13:22:00', 'paris', 'marrakech', 12, 7, 1, 1, 0, 'alpha romeo', 'A-12281-33', 26, 1),
(18, '2025-03-31', '2025-04-13', '00:40:00', '00:39:00', 'algeria', 'aga', 2020, 5, 0, 0, 0, 'skoda', 'A-12281-33', 26, 0);

-- --------------------------------------------------------

--
-- Table structure for table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `num_telephone` varchar(255) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `sexe` varchar(10) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `role` enum('admin','driver','passenger') NOT NULL DEFAULT 'passenger',
  `rating` int(4) DEFAULT 1,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `prenom`, `password`, `email`, `ville`, `adresse`, `cin`, `num_telephone`, `date_naissance`, `sexe`, `age`, `role`, `rating`, `reset_token`, `reset_token_expiry`) VALUES
(13, 'DRIOUICH', 'OUSSAMA', '$2b$10$/gfQNcQ7jnr0MTh0QH6VJOdGvJ/S.ejvnd.jOLCFll2Zk.HjlkDwe', 'admin@a.a', 'Agadir', 'gjjh', 'JsKs45Z076', '0658347462', '2025-04-21', 'Male', 16, 'admin', 1, NULL, NULL),
(19, 'said1', 'romat', '$2b$10$RLtNeWKG4IfEiPURNdcnL.EwjA1aJmoXiHBrRknH0c6PPlWw6DXS.', 'driver@a.a', 'Agadir', 'gjjh', 'JszKs45', '0658347462', '2024-12-29', 'Male', 0, 'driver', 4, NULL, NULL),
(20, 's', 's', '$2b$10$YCm1zLWRIi6avCPCqkPEY.3bnpcS9unKvB95gGf/Mr3ymb37mhol6', 'emulator4acc@gmail.com', 'ss', 's', 's', '222', '2025-04-28', 'Male', -1, 'passenger', 1, NULL, NULL),
(21, 'CV', 'Download', '$2b$10$KUQisnB2AJKYSLy/poOPAOe9/DVBt2BF4bp75ijg5XMUSs/dB4wGy', 'emulator4acc@gmail.coma', 'c', 'c', 'c', 'c', '2025-04-15', 'Male', -1, 'passenger', 1, NULL, NULL),
(25, 'moamhed', 'oubyt', '$2b$10$BKtS0O5AKlrJkKugahL9/elSn1KFR.xVtTSOgj3qZYegwKkTCK85S', 'oussama119driouich@gmail.com', 'ss', 's', 'azzzzq', 'ss', '2020-05-11', 'Male', 4, 'passenger', 1, '6ae1e847bebb83cdd08c2535bdc82086c82f1e93', '2025-04-18 05:31:11'),
(26, 'sadid', 'oubyta', '$2b$10$1IOvvOHN4Nc0Szg4vwFz0eFKu05IHvyUHZmvIgH5.2ifTJ8Mz5dsC', 'driver2@a.a', 'ss', 's', 'aq', '1212121', '2025-04-22', 'Male', -1, 'driver', 1, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id_booking`),
  ADD UNIQUE KEY `unique_booking` (`id_trajet`,`id_passenger`);

--
-- Indexes for table `driverprofile`
--
ALTER TABLE `driverprofile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_driver` (`id_driver`),
  ADD KEY `id_passenger` (`id_passenger`);

--
-- Indexes for table `trajet`
--
ALTER TABLE `trajet`
  ADD PRIMARY KEY (`id_trajet`),
  ADD KEY `fk_driver` (`id_driver`);

--
-- Indexes for table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cin` (`cin`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id_booking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `driverprofile`
--
ALTER TABLE `driverprofile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `trajet`
--
ALTER TABLE `trajet`
  MODIFY `id_trajet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `driverprofile`
--
ALTER TABLE `driverprofile`
  ADD CONSTRAINT `driverprofile_ibfk_1` FOREIGN KEY (`id_driver`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `driverprofile_ibfk_2` FOREIGN KEY (`id_passenger`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `trajet`
--
ALTER TABLE `trajet`
  ADD CONSTRAINT `fk_driver` FOREIGN KEY (`id_driver`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
