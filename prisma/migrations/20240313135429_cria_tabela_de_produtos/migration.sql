-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
