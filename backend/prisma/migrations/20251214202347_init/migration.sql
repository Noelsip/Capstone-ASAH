/*
  Warnings:

  - A unique constraint covering the columns `[alert_id]` on the table `alert_acknowledgements` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "alert_acknowledgements_alert_id_key" ON "alert_acknowledgements"("alert_id");
