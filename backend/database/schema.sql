CREATE DATABASE IF NOT EXISTS comparateur_energie
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE comparateur_energie;

CREATE TABLE IF NOT EXISTS users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(255)  NOT NULL UNIQUE,
  password     VARCHAR(255)  NOT NULL,
  role         ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS offers (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider_name      VARCHAR(100)   NOT NULL,
  offer_name         VARCHAR(150)   NOT NULL,
  energy_type        ENUM('electricity', 'gas') NOT NULL,
  subscription_price DECIMAL(10, 2) NOT NULL COMMENT 'Annual subscription (€/year)',
  price_per_kwh      DECIMAL(10, 6) NOT NULL COMMENT 'Price per kWh (€/kWh)',
  green_energy       TINYINT(1)     NOT NULL DEFAULT 0,
  contract_duration  INT UNSIGNED            DEFAULT NULL COMMENT 'Duration in months, NULL = no commitment',
  created_at         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_energy_type (energy_type),
  INDEX idx_price (price_per_kwh)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS simulations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED DEFAULT NULL,
  consumption_kwh DECIMAL(10, 2) NOT NULL,
  energy_type     ENUM('electricity', 'gas') NOT NULL,
  results         JSON          NOT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;
