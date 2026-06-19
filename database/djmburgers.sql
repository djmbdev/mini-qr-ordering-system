-- =========================================================
-- 1. CREATE THE TABLES FIRST (Structural Setup)
-- =========================================================

-- Enable UUID extension if not active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Product Table
CREATE TABLE IF NOT EXISTS "public"."Product" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create Order Table
CREATE TABLE IF NOT EXISTS "public"."Order" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "orderNumber" SERIAL UNIQUE NOT NULL,
    "totalAmount" DECIMAL(10, 2) NOT NULL,
    "status" TEXT DEFAULT 'pending' NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create OrderItem Table
CREATE TABLE IF NOT EXISTS "public"."OrderItem" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "orderId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id")
);


-- =========================================================
-- 2. INSERT THE DATA ROWS SECOND (Data Population)
-- =========================================================

INSERT INTO "public"."Product" ("id", "name", "description", "price", "imageUrl", "category", "createdAt") VALUES 
('1617d6f1-2ba5-44ef-9591-cd3f57464106', 'Sparkling Lemonade', 'Citrus refreshment with bubbles.', '75.00', '/images/drinks/sparkling-lemonade.png', 'drinks', '2026-06-18 15:47:54.977'), 
('223292f9-7732-4a2c-b4d0-2559eb1948d7', 'Crispy Chicken Burger', 'Golden fried chicken breast with chipotle mayo and crispy slaw.', '150.00', '/images/burgers/crispy-chicken-burger.png', 'burgers', '2026-06-18 15:47:54.977'), 
('2a8b9f79-aec7-41d3-9f22-3ed3d70398c5', 'Classic Burger', 'Juicy patty with cheddar, lettuce, tomato, and house sauce.', '120.00', '/images/burgers/classic-burger.png', 'burgers', '2026-06-18 15:47:54.977'), 
('64dbbc47-061a-4764-a0e2-807ab6fee98b', 'Mushroom Swiss Burger', 'Caramelized mushrooms and Swiss cheese on a toasted bun.', '145.00', '/images/burgers/mushroom-swiss-burger.png', 'burgers', '2026-06-18 15:47:54.977'), 
('6e7f8209-a7f1-40ca-9e55-507f1e60e636', 'Mango Shake', 'Creamy blended mango with vanilla ice cream.', '95.00', '/images/drinks/mango-shake.png', 'drinks', '2026-06-18 15:47:54.977'), 
('acbfbefd-f789-4398-874d-1b057f27c763', 'Iced Tea', 'Fresh brewed and lightly sweetened.', '60.00', '/images/drinks/iced-tea.png', 'drinks', '2026-06-18 15:47:54.977'), 
('c3346e4d-3e55-4a6d-9ba9-074691442280', 'Soda', 'Refreshing classic cola served chilled.', '50.00', '/images/drinks/soda.png', 'drinks', '2026-06-18 15:47:54.977'), 
('e1e08daa-b131-4bc7-8185-579fea5cf86a', 'Spicy BBQ Burger', 'Smoky bacon, onion rings, and spicy BBQ sauce.', '135.00', '/images/burgers/spicy-bbq-burger.png', 'burgers', '2026-06-18 15:47:54.977');

INSERT INTO "public"."Order" ("id", "totalAmount", "status", "createdAt", "updatedAt", "orderNumber") VALUES 
('03a158e2-bab3-4cfb-af39-d2a8451c7a3c', '150.00', 'pending', '2026-06-19 13:41:05.521', '2026-06-19 13:41:05.521', 21), 
('27ca2d16-0e34-4d6a-a468-4fc786cc5202', '150.00', 'pending', '2026-06-19 13:41:13.876', '2026-06-19 13:41:13.876', 22), 
('2af4c0cb-70c2-4b9a-809a-65d0d24d778b', '150.00', 'pending', '2026-06-19 13:41:20.005', '2026-06-19 13:41:20.005', 23), 
('3829f9e7-d2ff-4c1c-8e9b-8629c9b6d206', '60.00', 'completed', '2026-06-19 15:40:32.82', '2026-06-19 15:42:07.027', 30), 
('3ee8c38c-83e8-4f69-890d-5161d0b572b8', '150.00', 'pending', '2026-06-19 13:40:17.754', '2026-06-19 13:40:17.754', 20), 
('462b7f6b-4cd5-49b8-81d0-f2064871f4c6', '150.00', 'pending', '2026-06-19 13:41:25.456', '2026-06-19 13:41:25.456', 24), 
('66e1fd33-cc95-4acf-b570-60d8a2876e75', '180.00', 'pending', '2026-06-19 13:41:42.952', '2026-06-19 13:41:42.952', 25), 
('8a50d896-a542-4b88-b2d5-0213a9a9f333', '60.00', 'completed', '2026-06-19 13:41:48.057', '2026-06-19 15:13:28.281', 26), 
('9135af21-9c79-43ee-b2a2-e83745b6506f', '135.00', 'pending', '2026-06-19 13:40:06.458', '2026-06-19 13:40:06.458', 19), 
('a2803a51-c447-4413-b8a8-0ce6d05ec5aa', '135.00', 'pending', '2026-06-19 13:40:01.455', '2026-06-19 13:40:01.455', 18);

INSERT INTO "public"."OrderItem" ("id", "orderId", "productId", "quantity", "price") VALUES 
('181a2790-cdca-4697-80b2-583e6613cb5e', '27ca2d16-0e34-4d6a-a468-4fc786cc5202', '223292f9-7732-4a2c-b4d0-2559eb1948d7', 1, '150.00'), 
('418cb41c-bc42-4944-b3de-7d07451529fc', '3829f9e7-d2ff-4c1c-8e9b-8629c9b6d206', 'acbfbefd-f789-4398-874d-1b057f27c763', 1, '60.00'), 
('5b053191-a785-48ec-8149-ef84fe0f67c3', '03a158e2-bab3-4cfb-af39-d2a8451c7a3c', '223292f9-7732-4a2c-b4d0-2559eb1948d7', 1, '150.00'), 
('6277e6b5-25ab-4e1c-8b3d-474b2b872060', '8a50d896-a542-4b88-b2d5-0213a9a9f333', 'acbfbefd-f789-4398-874d-1b057f27c763', 1, '60.00'), 
('6749d489-f7fc-4d8a-a80e-55762892f6ae', 'a2803a51-c447-4413-b8a8-0ce6d05ec5aa', 'e1e08daa-b131-4bc7-8185-579fea5cf86a', 1, '135.00'), 
('90f31df2-7560-43a5-b6f9-6373b99fc06a', '2af4c0cb-70c2-4b9a-809a-65d0d24d778b', '223292f9-7732-4a2c-b4d0-2559eb1948d7', 1, '150.00'), 
('9a9b59c3-8a21-47d6-8e4a-831dcf8ffb57', '66e1fd33-cc95-4acf-b570-60d8a2876e75', '2a8b9f79-aec7-41d3-9f22-3ed3d70398c5', 1, '120.00'), 
('a32c258f-8a39-4d36-97d3-addf5f59b7ac', '66e1fd33-cc95-4acf-b570-60d8a2876e75', 'acbfbefd-f789-4398-874d-1b057f27c763', 1, '60.00'), 
('db1d63aa-c230-4fef-b5cf-4a47ba015842', '462b7f6b-4cd5-49b8-81d0-f2064871f4c6', '223292f9-7732-4a2c-b4d0-2559eb1948d7', 1, '150.00'), 
('ee377e73-944d-4f59-a638-34e517f03c31', '9135af21-9c79-43ee-b2a2-e83745b6506f', 'e1e08daa-b131-4bc7-8185-579fea5cf86a', 1, '135.00'), 
('f1319a1c-691b-4d1e-a80d-3537b51a7d64', '3ee8c38c-83e8-4f69-890d-5161d0b572b8', '223292f9-7732-4a2c-b4d0-2559eb1948d7', 1, '150.00');
