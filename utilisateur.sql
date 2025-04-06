-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2025 at 11:15 PM
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
  `role` enum('admin','driver','passenger') NOT NULL DEFAULT 'passenger'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `prenom`, `password`, `email`, `ville`, `adresse`, `cin`, `num_telephone`, `date_naissance`, `sexe`, `age`, `role`) VALUES
(13, 'DRIOUICH', 'OUSSAMA', '$2b$10$/gfQNcQ7jnr0MTh0QH6VJOdGvJ/S.ejvnd.jOLCFll2Zk.HjlkDwe', 'admin@a.a', 'Agadir', 'gjjh', 'JsKs45Z076', '0658347462', '2025-04-21', 'Male', 16, 'admin'),
(17, 'taloui', 'ali', '$2b$10$s/HQnNcCQvghznwTimjfdehb9H.F3a7bM0yYsfTGO55iUwECxC7Y6', 'passenger@a.a', 'Agadir', 'gjjh', 'JsKs45', '0658347462', '2025-06-17', 'Male', 30, 'passenger'),
(19, 'said', 'romat', '$2b$10$RLtNeWKG4IfEiPURNdcnL.EwjA1aJmoXiHBrRknH0c6PPlWw6DXS.', 'driver@a.a', 'Agadir', 'gjjh', 'JszKs45', '0658347462', '2024-12-30', 'Male', 0, 'driver');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
