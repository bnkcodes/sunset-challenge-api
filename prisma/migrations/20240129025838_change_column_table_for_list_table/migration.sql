/*
  Warnings:

  - You are about to drop the column `column_id` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `columns` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `list_id` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "columns" DROP CONSTRAINT "columns_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_column_id_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "column_id",
ADD COLUMN     "list_id" UUID NOT NULL;

-- DropTable
DROP TABLE "columns";

-- CreateTable
CREATE TABLE "lists" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
