/* -------------------------------------------------------------
   SWITCH TO THE ACTIVE DATABASE
   (Only needed when running multiple DBs on the same server)
-------------------------------------------------------------- */
USE project_manager;

/* =================================================================
   SEED DATA SECTION
   This data is inserted for testing and demonstration purposes only.
   In the live system, passwords will be hashed automatically.
================================================================= */

/* -------------------------------------------------------------
   Insert sample users
   NOTE: The password "PLAINTEXT_TEMP" is placeholder test data.
         In production, it must always be a bcrypt hash.
-------------------------------------------------------------- */
INSERT INTO users (username, password, email)
VALUES
  ('testuser', 'PLAINTEXT_TEMP', 'testuser@example.com'),
  ('alice', 'PLAINTEXT_TEMP', 'alice@example.com');

/* -------------------------------------------------------------
   Insert sample projects linked to users
   uid 1 → testuser
   uid 2 → alice
-------------------------------------------------------------- */
INSERT INTO projects (title, start_date, end_date, short_description, phase, uid)
VALUES
  ('Inventory System', '2024-01-10', '2024-04-15',
   'Build inventory management system.', 'development', 1),

  ('Marketing Website', '2024-02-01', NULL,
   'Landing page for new product.', 'design', 1),

  ('Mobile App', '2024-03-01', NULL,
   'Prototype mobile application.', 'testing', 2);