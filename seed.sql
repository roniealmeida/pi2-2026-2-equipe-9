
INSERT INTO "Users" (id, name, phone, password_hash, is_admin, status, created_at, updated_at) VALUES
(1, 'Admin Principal', '88999990001', 'admin123', TRUE, 1, NOW(), NOW()),
(2, 'Admin Suporte', '88999990002', 'admin456', TRUE, 1, NOW(), NOW()),
(3, 'João da Silva', '88991112233', 'senha123', FALSE, 1, NOW(), NOW()),
(4, 'Maria Oliveira', '88992223344', 'senha567', FALSE, 1, NOW(), NOW()),
(5, 'Francisco Santos', '88993334455', 'pin43210', FALSE, 1, NOW(), NOW()),
(6, 'Antônio Pereira', '88994445566', 'senha987', FALSE, 1, NOW(), NOW()),
(7, 'Ana Costa', '88995556677', 'pin11111', FALSE, 1, NOW(), NOW()),
(8, 'Carlos Souza', '88996667788', 'senha222', FALSE, 1, NOW(), NOW()),
(9, 'Francisca Lima', '88997778899', 'pin33333', FALSE, 1, NOW(), NOW()),
(10, 'José Rodrigues', '88998889900', 'senha444', FALSE, 0, NOW(), NOW()),
(11, 'Raimundo Nonato', '88991234567', 'senha555', FALSE, 1, NOW(), NOW()),
(12, 'Lúcia Alves', '88998765432', 'pin66666', FALSE, 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


INSERT INTO "Farms" (id, user_id, name, state, municipality, location, created_at) VALUES
(1, 3, 'Fazenda Boa Vista', 'CE', 'Crateús', 'Ibiapaba', NOW()),
(2, 4, 'Sítio Recanto', 'CE', 'Crateús', 'Realezo', NOW()),
(3, 5, 'Fazenda Esperança', 'CE', 'Crateús', 'Poti', NOW()),
(4, 6, 'Fazenda São José', 'CE', 'Crateús', 'Montenebo', NOW()),
(5, 7, 'Sítio das Flores', 'CE', 'Tamboril', 'Distrito Sede', NOW()),
(6, 8, 'Fazenda Sol Nascente', 'CE', 'Novo Oriente', 'Aroeiras', NOW()),
(7, 9, 'Fazenda Progresso', 'CE', 'Independência', 'Santa Rita', NOW()),
(8, 10, 'Sítio Barreiros', 'CE', 'Crateús', 'Santo Antônio', NOW()),
(9, 11, 'Fazenda Vitória', 'CE', 'Ipaporanga', 'Agrovila', NOW()),
(10, 12, 'Sítio Olho D Water', 'CE', 'Crateús', 'Curral Velho', NOW())
ON CONFLICT (id) DO NOTHING;


INSERT INTO "SearchRequests" (id, user_id, status, image, request_date) VALUES
(1, 3, 1, 'uploads/img_001.jpg', '2026-07-02 08:30:00-03'),
(2, 3, 1, 'uploads/img_002.jpg', '2026-07-15 10:15:00-03'),
(3, 4, 1, 'uploads/img_003.png', '2026-07-20 11:00:00-03'),
(4, 5, 0, 'uploads/img_004.jpg', '2026-08-05 14:20:00-03'),
(5, 6, 1, 'uploads/img_005.jpg', '2026-08-12 09:45:00-03'),
(6, 7, 1, 'uploads/img_006.png', '2026-08-25 16:10:00-03'),
(7, 8, 1, 'uploads/img_007.jpg', '2026-09-01 07:50:00-03'),
(8, 9, 0, 'uploads/img_008.png', '2026-09-10 13:05:00-03'),
(9, 11, 1, 'uploads/img_009.jpg', '2026-09-22 08:00:00-03'),
(10, 12, 1, 'uploads/img_010.jpg', '2026-10-01 09:12:00-03')
ON CONFLICT (id) DO NOTHING;


INSERT INTO "PlantAnalysisResults" (id, search_request_id, confidence_score, common_name, scientific_name, susceptible_animal_species, human_risks, common_symptoms, recommended_actions, description, created_at) VALUES
(1, 1, 0.95, 'Maniçoba', 'Manihot glaziovii', 'Bovinos e Caprinos', 'Intoxicação por Ácido Cianídrico', 'Timpanismo, asfixia, salivação excessiva', 'Isolar a área e administrar antídoto sob prescrição', 'Resultado gerado por IA é uma orientação preliminar. Consulte um Médico Veterinário.', NOW()),
(2, 2, 0.92, 'Timbó / Pela-bucho', 'Mascagnia rigida', 'Bovinos, Caprinos e Ovinos', 'Parada cardíaca e distúrbios nervosos', 'Morte súbita após esforço físico, ataxia, abortos em gestantes', 'Evitar movimentação do lote e retirar animais do local', 'Resultado gerado por IA é uma orientação preliminar. Consulte um Médico Veterinário.', NOW()),
(3, 3, 0.88, 'Jurema-preta', 'Mimosa tenuiflora', 'Ruminantes (Bovinos, Caprinos e Ovinos)', 'Toxidez reprodutiva e digestiva', 'Má-formação fetal (teratogenia), abortos, problemas digestivos', 'Suplementar dieta para evitar consumo excessivo de vagens', 'Resultado gerado por IA é uma orientação preliminar. Consulte um Médico Veterinário.', NOW()),
(4, 5, 0.90, 'Corredeira / Erva-canudo', 'Ipomoea asarifolia', 'Bovinos, Caprinos e Ovinos', 'Neurotoxidade severa', 'Tremores, apatia, emagrecimento, incoordenação motora', 'Isolar animais infectados e fornecer água limpa e pastejo seguro', 'Resultado gerado por IA é uma orientação preliminar. Consulte um Médico Veterinário.', NOW()),
(5, 6, 0.97, 'Mamona', 'Ricinus communis', 'Todas as espécies', 'Alta toxicidade pela Ricina', 'Dores abdominais, diarreia severa, prostração', 'Remover restos da planta e reidratar o animal imediatamente', 'Resultado gerado por IA é uma orientação preliminar. Consulte um Médico Veterinário.', NOW()),
(6, 7, 0.85, 'Pau-branco', 'Aspidosperma pyrifolium', 'Bovinos e Caprinos', 'Princípios tóxicos reprodutivos', 'Abortos em rebanhos, fraqueza geral', 'Evitar pastejo em áreas com brotação recente da planta', 'Resultado gerado por IA é uma orientação preliminar. Consulte um Médico Veterinário.', NOW()),
(7, 9, 0.93, 'Espirradeira', 'Nerium oleander', 'Bovinos, Equinos e Pets', 'Parada cardiorrespiratória', 'Arritmia cardíaca, vômitos, tremores', 'Tratamento sintomático imediato por Veterinário', 'Resultado gerado por IA é uma orientação preliminar. Consulte um Médico Veterinário.', NOW()),
(8, 10, 0.91, 'Erva-de-Rato', 'Psychotria colorata', 'Bovinos', 'Toxidez aguda', 'Tremores musculares, queda abrupta', 'Manter o animal em local coberto, fresco e calmo', 'Resultado gerado por IA é uma orientação preliminar. Consulte um Médico Veterinário.', NOW())
ON CONFLICT (id) DO NOTHING;


INSERT INTO "SearchErrorLogs" (id, search_request_id, status_code, error_type, error_description, error_response, request_date) VALUES
(1, 4, 500, 1, 'Erro na inferência do modelo', 'resposta_invalida', '2026-08-05 14:20:05-03'),
(2, 8, 504, 2, 'Timeout na chamada da API', 'timeout', '2026-09-10 13:05:10-03')
ON CONFLICT (id) DO NOTHING;