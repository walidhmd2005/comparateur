USE comparateur_energie;

-- Admin user (password: Admin1234!)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@comparateur.fr', '$2a$12$placeholderHashReplaceWithRealBcryptHash', 'admin');

-- Electricity offers
INSERT INTO offers (provider_name, offer_name, energy_type, subscription_price, price_per_kwh, green_energy, contract_duration) VALUES
('EDF',        'Tarif Bleu',         'electricity', 132.00, 0.2516, 0, NULL),
('Engie',      'Elec Essentiel',     'electricity', 120.00, 0.2480, 0, 12),
('TotalEnergi','Elec Verte',         'electricity', 144.00, 0.2395, 1, 12),
('Vattenfall', 'Elec Nature',        'electricity', 138.00, 0.2420, 1, 24),
('OHM Énergie','Zen Elec',           'electricity', 108.00, 0.2550, 0, NULL),
('Bulb',       'Bulb Electricity',   'electricity', 126.00, 0.2460, 1, NULL),
('Energie2040','Eco Elec',           'electricity', 115.00, 0.2510, 1, 12);

-- Gas offers
INSERT INTO offers (provider_name, offer_name, energy_type, subscription_price, price_per_kwh, green_energy, contract_duration) VALUES
('EDF',        'Tarif Bleu Gaz',     'gas', 204.00, 0.1021, 0, NULL),
('Engie',      'Gaz Essentiel',      'gas', 192.00, 0.1005, 0, 12),
('TotalEnergi','Gaz Eco',            'gas', 216.00, 0.0990, 0, 12),
('Vattenfall', 'Gaz Nature',         'gas', 210.00, 0.1015, 1, 24),
('OHM Énergie','Zen Gaz',            'gas', 180.00, 0.1035, 0, NULL),
('Enerco',     'Gaz Fixe',           'gas', 198.00, 0.0980, 0, 24);
