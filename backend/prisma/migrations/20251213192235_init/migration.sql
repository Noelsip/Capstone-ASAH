-- CreateIndex
CREATE INDEX "idx_sensor_timestamp_desc" ON "sensor_readings"("reading_timestamp" DESC);

-- RenameIndex
ALTER INDEX "sensor_readings_machine_serial_idx" RENAME TO "idx_sensor_machine";

-- RenameIndex
ALTER INDEX "sensor_readings_machine_serial_reading_timestamp_idx" RENAME TO "idx_sensor_machine_timestamp";

-- RenameIndex
ALTER INDEX "sensor_readings_reading_timestamp_idx" RENAME TO "idx_sensor_timestamp";
