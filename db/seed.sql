
USE project_manager;


INSERT INTO users (username, password, email)
VALUES
  ('testuser', 'PLAINTEXT_TEMP', 'testuser@example.com'),
  ('alice', 'PLAINTEXT_TEMP', 'alice@example.com');


INSERT INTO projects (title, start_date, end_date, short_description, phase, uid)
VALUES
  ('Inventory System', '2024-01-10', '2024-04-15', 'Build inventory management system.', 'development', 1),
  ('Marketing Website', '2024-02-01', NULL, 'Landing page for new product.', 'design', 1),
  ('Mobile App', '2024-03-01', NULL, 'Prototype mobile application.', 'testing', 2);
