
-- 行业分类表
CREATE TABLE IF NOT EXISTS Industry_Categories (
    category_id VARCHAR(10) PRIMARY KEY,
    primary_category VARCHAR(100) NOT NULL,
    secondary_category VARCHAR(100),
    tertiary_category VARCHAR(100),
    level INT NOT NULL,
    parent_id VARCHAR(10),
    sort_order INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES Industry_Categories(category_id)
);

-- 服务表
CREATE TABLE IF NOT EXISTS Services (
    service_id VARCHAR(15) PRIMARY KEY,
    category_id VARCHAR(10) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Industry_Categories(category_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_category_hierarchy ON Industry_Categories (level, parent_id);
CREATE INDEX IF NOT EXISTS idx_category_sort ON Industry_Categories (level, sort_order);
CREATE INDEX IF NOT EXISTS idx_category_status ON Industry_Categories (status);
CREATE INDEX IF NOT EXISTS idx_service_category ON Services (category_id);
CREATE INDEX IF NOT EXISTS idx_service_sort ON Services (category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_service_status ON Services (status);

-- 插入行业分类数据
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05', 'Agriculture Forestry and Fishing', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03', 'Agriculture Forestry and Fishing', 'Crop Production', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.03', 'Agriculture Forestry and Fishing', 'Crop Production', 
            'Grain Growing', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.03', 'Agriculture Forestry and Fishing', 'Crop Production', 
            'Vegetable Growing', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.06', 'Agriculture Forestry and Fishing', 'Crop Production', 
            'Fruit and Tree Nut Growing', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.04', 'Agriculture Forestry and Fishing', 'Crop Production', 
            'Sugar Cane Growing', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03', 'Agriculture Forestry and Fishing', 'Livestock Production', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.04', 'Agriculture Forestry and Fishing', 'Livestock Production', 
            'Dairy Cattle Farming', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.04', 'Agriculture Forestry and Fishing', 'Livestock Production', 
            'Beef Cattle Farming', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.05', 'Agriculture Forestry and Fishing', 'Livestock Production', 
            'Sheep and Wool Production', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.03', 'Agriculture Forestry and Fishing', 'Livestock Production', 
            'Poultry Farming', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.02', 'Agriculture Forestry and Fishing', 'Forestry', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.02.03', 'Agriculture Forestry and Fishing', 'Forestry', 
            'Forestry Growing', 3, 
            'A05.02', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.02.02', 'Agriculture Forestry and Fishing', 'Forestry', 
            'Logging', 3, 
            'A05.02', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.02', 'Agriculture Forestry and Fishing', 'Fishing', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.02.02', 'Agriculture Forestry and Fishing', 'Fishing', 
            'Aquaculture', 3, 
            'A05.02', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.02.03', 'Agriculture Forestry and Fishing', 'Fishing', 
            'Commercial Fishing', 3, 
            'A05.02', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.04', 'Agriculture Forestry and Fishing', 'Agricultural Support Services', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.04.04', 'Agriculture Forestry and Fishing', 'Agricultural Support Services', 
            'Agricultural Support Services', 3, 
            'A05.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02', 'Mining', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.03', 'Mining', 'Coal Mining', 
            NULL, 2, 
            'A02', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.03.03', 'Mining', 'Coal Mining', 
            'Coal Mining', 3, 
            'A02.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.05', 'Mining', 'Oil and Gas Extraction', 
            NULL, 2, 
            'A02', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.05.05', 'Mining', 'Oil and Gas Extraction', 
            'Oil and Gas Extraction', 3, 
            'A02.05', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04', 'Mining', 'Metal Ore Mining', 
            NULL, 2, 
            'A02', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.04', 'Mining', 'Metal Ore Mining', 
            'Iron Ore Mining', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.03', 'Mining', 'Metal Ore Mining', 
            'Bauxite Mining', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.03', 'Mining', 'Metal Ore Mining', 
            'Copper Mining', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.03', 'Mining', 'Metal Ore Mining', 
            'Gold Mining', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04', 'Mining', 'Non-Metallic Mineral Mining', 
            NULL, 2, 
            'A02', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.03', 'Mining', 'Non-Metallic Mineral Mining', 
            'Stone Mining', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.05', 'Mining', 'Non-Metallic Mineral Mining', 
            'Sand and Gravel Mining', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.06', 'Mining', 'Exploration and Mining Support Services', 
            NULL, 2, 
            'A02', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.06.02', 'Mining', 'Exploration and Mining Support Services', 
            'Exploration', 3, 
            'A02.06', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.06.04', 'Mining', 'Exploration and Mining Support Services', 
            'Mining Support Services', 3, 
            'A02.06', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02', 'Manufacturing', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04', 'Manufacturing', 'Food Product Manufacturing', 
            NULL, 2, 
            'A02', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.03', 'Manufacturing', 'Food Product Manufacturing', 
            'Meat Processing', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.04', 'Manufacturing', 'Food Product Manufacturing', 
            'Dairy Product Manufacturing', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.05', 'Manufacturing', 'Food Product Manufacturing', 
            'Fruit and Vegetable Processing', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.04', 'Manufacturing', 'Food Product Manufacturing', 
            'Bakery Product Manufacturing', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04', 'Manufacturing', 'Transport Equipment Manufacturing', 
            NULL, 2, 
            'A02', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.04', 'Manufacturing', 'Transport Equipment Manufacturing', 
            'Motor Vehicle Manufacturing', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A02.04.02', 'Manufacturing', 'Transport Equipment Manufacturing', 
            'Shipbuilding', 3, 
            'A02.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05', 'Information Media and Telecommunications', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03', 'Information Media and Telecommunications', 'Software Development', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.03', 'Information Media and Telecommunications', 'Software Development', 
            'Web Development', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.03', 'Information Media and Telecommunications', 'Software Development', 
            'CRM Development', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.03', 'Information Media and Telecommunications', 'Software Development', 
            'ERP Development', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03', 'Information Media and Telecommunications', 'Digital Marketing', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.04', 'Information Media and Telecommunications', 'Digital Marketing', 
            'Search Engine Optimization', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.04', 'Information Media and Telecommunications', 'Digital Marketing', 
            'Social Media Marketing', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05', 'Financial and Insurance Services', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.02', 'Financial and Insurance Services', 'Banking', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.02.03', 'Financial and Insurance Services', 'Banking', 
            'Commercial Banking', 3, 
            'A05.02', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.05', 'Financial and Insurance Services', 'Insurance and Superannuation Funds', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.05.03', 'Financial and Insurance Services', 'Insurance and Superannuation Funds', 
            'Health Insurance', 3, 
            'A05.05', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A07', 'Rental Hiring and Real Estate Services', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A07.03', 'Rental Hiring and Real Estate Services', 'Property Operators', 
            NULL, 2, 
            'A07', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A07.03.04', 'Rental Hiring and Real Estate Services', 'Property Operators', 
            'Residential Property Operators', 3, 
            'A07.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A07.04', 'Rental Hiring and Real Estate Services', 'Real Estate Services', 
            NULL, 2, 
            'A07', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A07.04.04', 'Rental Hiring and Real Estate Services', 'Real Estate Services', 
            'Real Estate Services', 3, 
            'A07.04', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A06', 'Professional Scientific and Technical Services', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A06.03', 'Professional Scientific and Technical Services', 'Professional Services', 
            NULL, 2, 
            'A06', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A06.03.03', 'Professional Scientific and Technical Services', 'Professional Services', 
            'Legal Services', 3, 
            'A06.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A06.03.03', 'Professional Scientific and Technical Services', 'Professional Services', 
            'Accounting Services', 3, 
            'A06.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05', 'Administrative and Support Services', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03', 'Administrative and Support Services', 'Administrative Services', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.03', 'Administrative and Support Services', 'Administrative Services', 
            'Employment Services', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05', 'Public Administration and Safety', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03', 'Public Administration and Safety', 'Public Administration', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.03.04', 'Public Administration and Safety', 'Public Administration', 
            'Central Government Administration', 3, 
            'A05.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A04', 'Education and Training', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A04.03', 'Education and Training', 'Tertiary Education', 
            NULL, 2, 
            'A04', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A04.03.03', 'Education and Training', 'Tertiary Education', 
            'Higher Education', 3, 
            'A04.03', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A06', 'Health Care and Social Assistance', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A06.07', 'Health Care and Social Assistance', 'Medical and Other Health Care Services', 
            NULL, 2, 
            'A06', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A06.07.03', 'Health Care and Social Assistance', 'Medical and Other Health Care Services', 
            'Medical Services', 3, 
            'A06.07', 30);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05', 'Arts and Recreation Services', NULL, 
            NULL, 1, 
            NULL, 10);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.05', 'Arts and Recreation Services', 'Sports and Recreation Activities', 
            NULL, 2, 
            'A05', 20);
INSERT INTO Industry_Categories 
            (category_id, primary_category, secondary_category, tertiary_category, level, parent_id, sort_order)
        VALUES 
            ('A05.05.06', 'Arts and Recreation Services', 'Sports and Recreation Activities', 
            'Sports and Physical Recreation Activities', 3, 
            'A05.05', 30);

-- 插入服务数据
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.009', 'A05.03.03', 'Soil Testing', 'Analysis of soil composition to optimize crop yields and health.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.294', 'A05.03.03', 'Precision Seeding', 'GPS-guided planting services to maximize field utilization and crop spacing.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.350', 'A05.03.03', 'Irrigation Systems', 'Installation and maintenance of water delivery systems for crop fields.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.915', 'A05.03.03', 'Crop Monitoring', 'Regular assessment of crop health using ground surveys and aerial imagery.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.956', 'A05.03.03', 'Harvest Contracting', 'Specialized machinery and labor services for efficient crop harvesting.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.663', 'A05.03.03', 'Greenhouse Construction', 'Building and fitting of controlled environment growing structures.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.779', 'A05.03.03', 'Hydroponic Systems', 'Soilless growing systems for intensive vegetable production.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.770', 'A05.03.03', 'Pest Management', 'Integrated pest control services to protect vegetable crops.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.489', 'A05.03.03', 'Post-Harvest Processing', 'Cleaning, sorting, and packaging of harvested vegetables.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.045', 'A05.03.03', 'Cold Chain Logistics', 'Temperature-controlled transport and storage for fresh produce.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.06.645', 'A05.03.06', 'Orchard Establishment', 'Planning and planting of new fruit tree and nut tree orchards.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.06.195', 'A05.03.06', 'Pruning Services', 'Strategic tree cutting to enhance fruit quality and yields.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.06.761', 'A05.03.06', 'Pollination Services', 'Managed bee colonies for effective fruit tree pollination.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.06.682', 'A05.03.06', 'Frost Protection', 'Systems to prevent cold damage to sensitive fruit crops.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.06.906', 'A05.03.06', 'Fruit Grading', 'Sizing and quality assessment of harvested fruit products.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.215', 'A05.03.04', 'Planting Services', 'Mechanized insertion of sugar cane cuttings into prepared fields.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.487', 'A05.03.04', 'Field Maintenance', 'Weed control, fertilization, and row maintenance for cane crops.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.445', 'A05.03.04', 'Irrigation Management', 'Water delivery systems specialized for sugar cane production.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.802', 'A05.03.04', 'Harvesting', 'Mechanical cutting, collection, and transport of mature cane.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.521', 'A05.03.04', 'Mill Coordination', 'Logistics planning for timely processing of harvested cane.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.696', 'A05.03.04', 'Dairy Herd Management', 'Comprehensive care and oversight of milk-producing cattle.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.997', 'A05.03.04', 'Milking Systems', 'Installation and maintenance of automated milking equipment.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.731', 'A05.03.04', 'Feed Formulation', 'Custom nutrition planning for optimal milk production and animal health.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.501', 'A05.03.04', 'Reproductive Services', 'Breeding programs, artificial insemination, and genetic improvement.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.193', 'A05.03.04', 'Milk Quality Testing', 'Analysis of milk composition and safety parameters.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.742', 'A05.03.04', 'Breeding Stock Selection', 'Identification of superior genetics for herd improvement.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.113', 'A05.03.04', 'Pasture Management', 'Development and maintenance of grazing lands for cattle.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.254', 'A05.03.04', 'Feedlot Operations', 'Intensive finishing of cattle using specialized feeding programs.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.344', 'A05.03.04', 'Animal Health Programs', 'Preventative medicine and health monitoring for cattle herds.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.326', 'A05.03.04', 'Livestock Transport', 'Specialized movement of animals between properties and to markets.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.05.168', 'A05.03.05', 'Flock Management', 'Comprehensive oversight of sheep breeding and health.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.05.168', 'A05.03.05', 'Shearing Services', 'Professional removal and handling of wool fleeces.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.05.889', 'A05.03.05', 'Wool Classing', 'Grading and categorization of wool by quality characteristics.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.05.688', 'A05.03.05', 'Lamb Production', 'Specialized breeding and raising of sheep for meat markets.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.05.106', 'A05.03.05', 'Predator Control', 'Protection of flocks from wild dogs and other threats.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.177', 'A05.03.03', 'Hatchery Operations', 'Egg incubation and chick production facilities.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.064', 'A05.03.03', 'Broiler Growing', 'Raising chickens specifically for meat production.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.984', 'A05.03.03', 'Layer Management', 'Care of egg-producing hens in various housing systems.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.650', 'A05.03.03', 'Poultry Health Services', 'Disease prevention and treatment for chicken flocks.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.392', 'A05.03.03', 'Processing Plant Operations', 'Slaughter and preparation of poultry products for market.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.585', 'A05.02.03', 'Plantation Establishment', 'Planning and planting of commercial timber plantations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.021', 'A05.02.03', 'Silviculture', 'Cultivation and management practices for optimal forest growth.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.188', 'A05.02.03', 'Forest Health Monitoring', 'Assessment and treatment of pests and diseases in timber stands.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.468', 'A05.02.03', 'Fire Management', 'Prevention and control of bushfires in forestry operations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.417', 'A05.02.03', 'Forest Certification', 'Documentation and verification of sustainable forestry practices.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.605', 'A05.02.02', 'Timber Harvesting', 'Cutting and collection of mature trees for processing.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.284', 'A05.02.02', 'Log Haulage', 'Transport of cut timber from forest to processing facilities.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.857', 'A05.02.02', 'Forest Road Construction', 'Building access routes for forestry equipment and log removal.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.066', 'A05.02.02', 'Post-Harvest Rehabilitation', 'Restoration of logged areas to promote forest regeneration.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.130', 'A05.02.02', 'Specialty Timber Recovery', 'Salvage of high-value timber species and unique wood products.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.405', 'A05.02.02', 'Fish Farm Design', 'Engineering of tank or pond systems for fish cultivation.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.781', 'A05.02.02', 'Water Quality Management', 'Monitoring and maintaining optimal aquatic environments for cultivated species.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.517', 'A05.02.02', 'Breeding Programs', 'Selective breeding for improved growth rates and disease resistance.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.861', 'A05.02.02', 'Feed Supply', 'Specialized nutrition for different growth stages of aquatic species.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.02.246', 'A05.02.02', 'Disease Prevention', 'Health monitoring and treatment programs for farmed aquatic species.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.348', 'A05.02.03', 'Fleet Management', 'Coordination and maintenance of fishing vessels and equipment.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.609', 'A05.02.03', 'Catch Processing', 'At-sea handling and preservation of harvested seafood.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.844', 'A05.02.03', 'Fishery Navigation', 'Specialized mapping and location services for optimal fishing grounds.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.585', 'A05.02.03', 'Quota Management', 'Compliance and documentation services for fishery allocation systems.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.106', 'A05.02.03', 'Sustainable Certification', 'Documentation of environmentally responsible fishing practices.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.04.04.373', 'A05.04.04', 'Drone Surveying', 'Aerial mapping and monitoring of agricultural lands using unmanned aircraft.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.04.04.002', 'A05.04.04', 'Soil Amendment', 'Application of materials to improve soil structure and fertility.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.04.04.062', 'A05.04.04', 'Equipment Leasing', 'Short-term rental of specialized agricultural machinery.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.04.04.935', 'A05.04.04', 'Weather Monitoring', 'Local climate data collection for farm decision support.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.04.04.815', 'A05.04.04', 'Contract Labor', 'Seasonal workforce provision for planting and harvesting operations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.03.03.169', 'A02.03.03', 'Exploration Drilling', 'Test boring to identify coal seam locations and characteristics.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.03.03.955', 'A02.03.03', 'Mine Planning', 'Engineering design of efficient and safe coal extraction operations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.03.03.407', 'A02.03.03', 'Overburden Removal', 'Stripping away rock and soil to access underlying coal deposits.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.03.03.228', 'A02.03.03', 'Coal Washing', 'Processing raw coal to remove impurities and improve quality.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.03.03.538', 'A02.03.03', 'Mine Rehabilitation', 'Restoration of mined areas to stable and productive landforms.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.05.05.845', 'A02.05.05', 'Seismic Surveying', 'Subsurface mapping to identify potential hydrocarbon deposits.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.05.05.276', 'A02.05.05', 'Well Drilling', 'Boring and completion of production wells for oil and gas.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.05.05.528', 'A02.05.05', 'Well Stimulation', 'Techniques to enhance flow from reservoir to wellbore.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.05.05.249', 'A02.05.05', 'Production Testing', 'Analysis of well output volume and composition.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.05.05.269', 'A02.05.05', 'Enhanced Recovery', 'Secondary and tertiary methods to extract additional hydrocarbons.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.924', 'A02.04.04', 'Deposit Modeling', '3D visualization of ore bodies for extraction planning.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.163', 'A02.04.04', 'Drilling and Blasting', 'Controlled explosives use to fragment ore for collection.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.031', 'A02.04.04', 'Crushing and Screening', 'Size reduction and separation of mined material.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.123', 'A02.04.04', 'Beneficiation', 'Concentration processes to increase the iron content of ore.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.700', 'A02.04.04', 'Tailings Management', 'Handling and storage of processing waste products.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.683', 'A02.04.03', 'Surface Mining', 'Removal of overburden and extraction of near-surface bauxite deposits.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.628', 'A02.04.03', 'Material Handling', 'Systems for moving extracted ore to processing facilities.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.142', 'A02.04.03', 'Quality Control', 'Testing of ore grade and contaminant levels.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.865', 'A02.04.03', 'Land Rehabilitation', 'Restoration of mined areas to stable and productive condition.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.425', 'A02.04.03', 'Logistics Coordination', 'Planning for efficient transport of ore to refineries.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.017', 'A02.04.03', 'Underground Development', 'Creation of tunnels and shafts for access to deep ore bodies.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.742', 'A02.04.03', 'Ventilation Systems', 'Air circulation infrastructure for underground mine safety.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.347', 'A02.04.03', 'Ore Sorting', 'Separation of copper-bearing materials from waste rock.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.567', 'A02.04.03', 'Flotation Processing', 'Concentration of copper minerals through chemical separation.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.777', 'A02.04.03', 'Smelter Coordination', 'Planning for processing of concentrated ore into refined copper.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.269', 'A02.04.03', 'Alluvial Mining', 'Extraction of gold from stream and river sediments.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.597', 'A02.04.03', 'Hard Rock Mining', 'Extraction of gold from solid rock formations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.895', 'A02.04.03', 'Crushing and Grinding', 'Size reduction of ore for efficient gold recovery.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.377', 'A02.04.03', 'Cyanidation', 'Chemical process to dissolve and recover gold from ore.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.185', 'A02.04.03', 'Dore Production', 'Creation of semi-pure gold bars for further refining.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.288', 'A02.04.03', 'Quarry Planning', 'Design of efficient and safe stone extraction operations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.169', 'A02.04.03', 'Dimensional Stone Cutting', 'Precision extraction of blocks for architectural use.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.927', 'A02.04.03', 'Aggregate Production', 'Crushing and grading of stone for construction materials.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.677', 'A02.04.03', 'Blasting Services', 'Controlled explosives use for stone extraction.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.129', 'A02.04.03', 'Quality Testing', 'Assessment of stone properties for different applications.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.812', 'A02.04.05', 'Dredging Operations', 'Extraction of materials from underwater deposits.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.384', 'A02.04.05', 'Washing and Classification', 'Cleaning and sizing of extracted materials.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.994', 'A02.04.05', 'Materials Testing', 'Analysis of physical properties for specific applications.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.955', 'A02.04.05', 'Site Rehabilitation', 'Restoration of mined areas to stable environmental condition.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.247', 'A02.04.05', 'Transportation Logistics', 'Planning efficient movement of bulk materials to markets.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.02.430', 'A02.06.02', 'Geophysical Surveys', 'Remote sensing of subsurface geological structures.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.02.108', 'A02.06.02', 'Geological Mapping', 'Field documentation of surface rock formations and characteristics.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.02.558', 'A02.06.02', 'Core Drilling', 'Collection of cylindrical rock samples for analysis.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.02.458', 'A02.06.02', 'Geochemical Analysis', 'Chemical testing of soil and rock samples for mineral indicators.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.02.253', 'A02.06.02', 'Resource Estimation', 'Calculation of potential mineral quantities and values.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.04.472', 'A02.06.04', 'Equipment Maintenance', 'Servicing and repair of specialized mining machinery.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.04.695', 'A02.06.04', 'Site Security', 'Protection of mining operations and equipment.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.04.150', 'A02.06.04', 'Environmental Monitoring', 'Tracking of mining impacts on surrounding ecosystems.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.04.347', 'A02.06.04', 'Camp Management', 'Accommodation and services for remote mining operations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.06.04.721', 'A02.06.04', 'Safety Training', 'Education programs for hazard recognition and prevention.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.879', 'A02.04.03', 'Slaughtering Services', 'Humane animal processing following regulatory standards.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.585', 'A02.04.03', 'Carcass Breaking', 'Systematic division of animal carcasses into commercial cuts.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.570', 'A02.04.03', 'Value-Added Processing', 'Creating ready-to-cook or specialized meat products.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.586', 'A02.04.03', 'Cold Storage', 'Temperature-controlled preservation of meat products.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.03.013', 'A02.04.03', 'Quality Assurance', 'Verification of product safety and consistency standards.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.091', 'A02.04.04', 'Milk Pasteurization', 'Heat treatment of raw milk to eliminate pathogens.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.854', 'A02.04.04', 'Cheese Production', 'Transformation of milk into various cheese varieties.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.419', 'A02.04.04', 'Butter Manufacturing', 'Processing of cream into butter products.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.197', 'A02.04.04', 'Yogurt Processing', 'Fermentation of milk into cultured dairy products.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.482', 'A02.04.04', 'Ice Cream Production', 'Freezing of flavored dairy mixtures into frozen desserts.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.867', 'A02.04.05', 'Freezing Operations', 'Rapid cooling of produce for long-term preservation.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.130', 'A02.04.05', 'Canning', 'Heat sterilization and sealing of produce in containers.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.949', 'A02.04.05', 'Juice Extraction', 'Separation of liquid components from fruits and vegetables.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.890', 'A02.04.05', 'Dehydration', 'Moisture removal for preservation and product concentration.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.05.664', 'A02.04.05', 'Pre-cut Processing', 'Preparation of ready-to-use fresh produce items.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.006', 'A02.04.04', 'Commercial Bread Production', 'High-volume manufacturing of standard bread products.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.450', 'A02.04.04', 'Pastry Making', 'Creation of sweet baked goods using specialized techniques.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.496', 'A02.04.04', 'Frozen Dough Production', 'Manufacturing of pre-prepared dough for later baking.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.258', 'A02.04.04', 'Gluten-Free Processing', 'Production of baked goods for special dietary needs.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.084', 'A02.04.04', 'Packaging Systems', 'Protection and presentation of baked products for retail.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.605', 'A02.04.04', 'Body Fabrication', 'Creation of vehicle structural components and exterior panels.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.320', 'A02.04.04', 'Powertrain Assembly', 'Integration of engines transmissions and drive systems.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.090', 'A02.04.04', 'Interior Fitting', 'Installation of cabin components and comfort features.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.240', 'A02.04.04', 'Electronics Integration', 'Implementation of vehicle control and entertainment systems.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.04.748', 'A02.04.04', 'Paint and Finish', 'Application of protective and decorative coatings.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.02.423', 'A02.04.02', 'Hull Construction', 'Fabrication of vessel main structure and exterior shell.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.02.624', 'A02.04.02', 'Marine Systems Installation', 'Integration of propulsion navigation and operational components.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.02.108', 'A02.04.02', 'Interior Outfitting', 'Installation of accommodation and working spaces within vessels.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.02.801', 'A02.04.02', 'Marine Electronics', 'Implementation of communication and control systems for vessels.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A02.04.02.672', 'A02.04.02', 'Sea Trials', 'Testing of completed vessels under operational conditions.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.117', 'A05.03.03', 'Website Design', 'Creation of visual and functional elements of websites.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.795', 'A05.03.03', 'E-commerce Implementation', 'Building of online sales capabilities for businesses.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.893', 'A05.03.03', 'Content Management Systems', 'Implementation of tools for website content updates.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.360', 'A05.03.03', 'Web Application Development', 'Creation of browser-based software solutions.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.422', 'A05.03.03', 'Mobile Responsiveness', 'Adaptation of web content for various device sizes.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.403', 'A05.03.03', 'Customer Database Design', 'Creation of structured information systems for client data.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.851', 'A05.03.03', 'Sales Pipeline Management', 'Tools for tracking prospect progression to customers.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.965', 'A05.03.03', 'Marketing Automation', 'Integration of targeted communication based on customer behavior.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.614', 'A05.03.03', 'Customer Service Modules', 'Systems for tracking and resolving client issues.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.708', 'A05.03.03', 'Analytics Implementation', 'Data collection and visualization of customer interactions.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.467', 'A05.03.03', 'Business Process Mapping', 'Documentation of operational workflows for system design.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.558', 'A05.03.03', 'Module Customization', 'Adaptation of software components to specific business needs.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.785', 'A05.03.03', 'Database Integration', 'Unification of disparate data sources into a central system.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.772', 'A05.03.03', 'User Training', 'Education of staff on effective use of ERP systems.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.217', 'A05.03.03', 'System Migration', 'Transfer of business data to new ERP platforms.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.963', 'A05.03.04', 'Keyword Research', 'Identification of valuable search terms for business visibility.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.762', 'A05.03.04', 'On-Page Optimization', 'Adjustment of website elements to improve search rankings.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.904', 'A05.03.04', 'Link Building', 'Development of inbound links to enhance site authority.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.656', 'A05.03.04', 'Content Strategy', 'Planning of website material to attract search traffic.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.203', 'A05.03.04', 'Technical SEO', 'Resolution of website issues affecting search performance.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.459', 'A05.03.04', 'Platform Management', 'Creation and oversight of business social media accounts.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.815', 'A05.03.04', 'Content Creation', 'Development of engaging posts for social audiences.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.391', 'A05.03.04', 'Community Engagement', 'Interaction with followers to build brand relationships.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.015', 'A05.03.04', 'Paid Social Campaigns', 'Targeted advertising on social media platforms.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.948', 'A05.03.04', 'Influencer Partnerships', 'Collaboration with popular social media personalities.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.698', 'A05.02.03', 'Business Lending', 'Provision of loans and credit facilities to companies.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.382', 'A05.02.03', 'Transaction Processing', 'Management of business payment flows and collections.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.368', 'A05.02.03', 'Cash Management', 'Optimization of business liquidity and working capital.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.830', 'A05.02.03', 'Trade Finance', 'Facilitation of international trade through financial instruments.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.02.03.120', 'A05.02.03', 'Foreign Exchange', 'Currency conversion and risk management services.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.03.273', 'A05.05.03', 'Claims Processing', 'Assessment and payment of member medical expenses.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.03.192', 'A05.05.03', 'Provider Network Management', 'Development of healthcare service relationships.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.03.424', 'A05.05.03', 'Member Services', 'Support and information for insurance policyholders.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.03.459', 'A05.05.03', 'Health Programs', 'Preventative care initiatives to reduce claims costs.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.03.957', 'A05.05.03', 'Benefit Design', 'Creation of insurance coverage structures and limits.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.03.04.749', 'A07.03.04', 'Tenant Screening', 'Evaluation of potential renters for property suitability.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.03.04.342', 'A07.03.04', 'Rent Collection', 'Management of regular payment processing from tenants.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.03.04.374', 'A07.03.04', 'Maintenance Coordination', 'Arrangement of repairs and upkeep for rental properties.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.03.04.695', 'A07.03.04', 'Lease Administration', 'Creation and management of rental agreements.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.03.04.629', 'A07.03.04', 'Vacancy Marketing', 'Promotion of available rental units to potential tenants.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.04.04.143', 'A07.04.04', 'Property Listing', 'Marketing of properties for sale to potential buyers.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.04.04.154', 'A07.04.04', 'Buyer Representation', 'Guidance for property purchasers in the acquisition process.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.04.04.053', 'A07.04.04', 'Property Valuation', 'Assessment of real estate market value for various purposes.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.04.04.826', 'A07.04.04', 'Settlement Coordination', 'Management of property transfer documentation and processes.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A07.04.04.077', 'A07.04.04', 'Investment Advisory', 'Guidance on real estate acquisition for investment purposes.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.365', 'A06.03.03', 'Corporate Law', 'Legal advice and documentation for business entities.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.049', 'A06.03.03', 'Property Law', 'Guidance on real estate transactions and disputes.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.389', 'A06.03.03', 'Family Law', 'Representation in divorce and custody matters.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.911', 'A06.03.03', 'Litigation', 'Advocacy in court proceedings and dispute resolution.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.511', 'A06.03.03', 'Intellectual Property', 'Protection of patents trademarks and copyrights.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.126', 'A06.03.03', 'Financial Statement Preparation', 'Creation of business performance reports.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.344', 'A06.03.03', 'Tax Compliance', 'Preparation and lodgment of required tax documents.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.890', 'A06.03.03', 'Bookkeeping', 'Recording of financial transactions and reconciliations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.519', 'A06.03.03', 'Business Advisory', 'Guidance on improving financial performance.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.03.03.696', 'A06.03.03', 'Audit Services', 'Independent verification of financial information.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.687', 'A05.03.03', 'Permanent Recruitment', 'Identification of candidates for ongoing employment positions.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.398', 'A05.03.03', 'Temporary Staffing', 'Provision of short-term workers for business needs.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.274', 'A05.03.03', 'Executive Search', 'Specialized recruitment of senior leadership positions.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.257', 'A05.03.03', 'HR Consulting', 'Guidance on workforce management best practices.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.03.251', 'A05.03.03', 'Outplacement Services', 'Support for transitioning employees leaving organizations.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.939', 'A05.03.04', 'Policy Development', 'Creation of government frameworks for public issues.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.414', 'A05.03.04', 'Program Management', 'Oversight of government initiatives and services.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.799', 'A05.03.04', 'Regulatory Enforcement', 'Implementation of legislative requirements and standards.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.441', 'A05.03.04', 'Public Consultation', 'Engagement with citizens on government decisions.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.03.04.861', 'A05.03.04', 'International Relations', 'Management of diplomatic and trade relationships.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A04.03.03.255', 'A04.03.03', 'Undergraduate Programs', 'Bachelor degree courses in various academic disciplines.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A04.03.03.178', 'A04.03.03', 'Postgraduate Teaching', 'Masters and doctoral level academic instruction.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A04.03.03.014', 'A04.03.03', 'Research Supervision', 'Guidance of student investigative projects and theses.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A04.03.03.810', 'A04.03.03', 'Academic Publishing', 'Production of scholarly articles and educational materials.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A04.03.03.751', 'A04.03.03', 'Industry Partnerships', 'Collaboration between universities and businesses.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.07.03.750', 'A06.07.03', 'General Practice', 'Primary healthcare consultations and treatments.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.07.03.641', 'A06.07.03', 'Specialist Consultations', 'Expert medical care in specific fields of medicine.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.07.03.571', 'A06.07.03', 'Diagnostic Testing', 'Procedures to identify medical conditions.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.07.03.621', 'A06.07.03', 'Preventative Care', 'Health maintenance and disease prevention services.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A06.07.03.516', 'A06.07.03', 'Telehealth', 'Remote medical consultations via technology.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.06.648', 'A05.05.06', 'Facility Management', 'Operation of venues for sporting activities.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.06.837', 'A05.05.06', 'Program Development', 'Creation of structured physical activity offerings.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.06.094', 'A05.05.06', 'Coaching Services', 'Skill development and performance enhancement for athletes.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.06.882', 'A05.05.06', 'Event Management', 'Organization and execution of sporting competitions.', 0);
INSERT INTO Services 
            (service_id, category_id, service_name, service_description, sort_order)
        VALUES 
            ('A05.05.06.728', 'A05.05.06', 'Equipment Supply', 'Provision of specialized gear for sport participants.', 0);
