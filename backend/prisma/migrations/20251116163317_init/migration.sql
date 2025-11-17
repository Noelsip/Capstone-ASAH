-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "role_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "user_pass" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" SERIAL NOT NULL,
    "type_code" CHAR(1) NOT NULL,
    "type_name" VARCHAR(50) NOT NULL,
    "type_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines" (
    "serial" VARCHAR(100) NOT NULL,
    "product_id" VARCHAR(100) NOT NULL,
    "product_type_id" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "location" VARCHAR(255),
    "run_time_seconds" INTEGER,
    "last_maintenance" TIMESTAMP(3),
    "next_maintenance" TIMESTAMP(3),
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("serial")
);

-- CreateTable
CREATE TABLE "failure_types" (
    "serial" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "failure_desc" TEXT,
    "category" VARCHAR(100),
    "recommended_action" TEXT,

    CONSTRAINT "failure_types_pkey" PRIMARY KEY ("serial")
);

-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" BIGSERIAL NOT NULL,
    "machine_serial" TEXT NOT NULL,
    "reading_timestamp" TIMESTAMP(3) NOT NULL,
    "air_temperature_k" DOUBLE PRECISION,
    "process_temperature_k" DOUBLE PRECISION,
    "rotational_speed_rpm" INTEGER,
    "torque_nm" DOUBLE PRECISION,
    "tool_wear_min" INTEGER,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inference_jobs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "file_path" VARCHAR(1024),
    "model_version" VARCHAR(100),
    "status" VARCHAR(50) NOT NULL,
    "total_records" INTEGER,
    "processed_records" INTEGER,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inference_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" BIGSERIAL NOT NULL,
    "sensor_id" BIGINT,
    "inference_jobs_id" BIGINT,
    "target" INTEGER NOT NULL,
    "failure_type_serial" VARCHAR(100),
    "confidance_score" DOUBLE PRECISION,
    "severity" VARCHAR(50),
    "model_output" JSONB,
    "predicted_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" VARCHAR(50) NOT NULL,
    "prediction_id" BIGINT,
    "machine_serial" VARCHAR(100),
    "status" VARCHAR(50) NOT NULL,
    "priority" VARCHAR(5),
    "severity" VARCHAR(50),
    "title" VARCHAR(255),
    "alert_desc" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_acknowledgements" (
    "id" BIGSERIAL NOT NULL,
    "alert_id" VARCHAR(50) NOT NULL,
    "acknowledged_by" UUID NOT NULL,
    "acknowledged_note" TEXT,
    "acknowledged_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_acknowledgements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_assignments" (
    "id" BIGSERIAL NOT NULL,
    "alert_id" VARCHAR(50) NOT NULL,
    "assigned_to" UUID NOT NULL,
    "assigned_by" UUID NOT NULL,
    "assigned_note" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_resolutions" (
    "id" BIGSERIAL NOT NULL,
    "alert_id" VARCHAR(50) NOT NULL,
    "resolved_by" UUID NOT NULL,
    "resolution_notes" TEXT,
    "resolution_type" VARCHAR(100),
    "resolved_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_resolutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_history" (
    "id" BIGSERIAL NOT NULL,
    "alert_id" VARCHAR(50) NOT NULL,
    "user_id" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "old_status" VARCHAR(50),
    "new_status" VARCHAR(50),
    "comment" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_logs" (
    "id" BIGSERIAL NOT NULL,
    "machine_serial" VARCHAR(100) NOT NULL,
    "performed_by" UUID NOT NULL,
    "maintenance_type" VARCHAR(100) NOT NULL,
    "maintenance_notes" TEXT,
    "actions_taken" TEXT,
    "parts_replaced" TEXT,
    "duration_hours" DOUBLE PRECISION,
    "status" VARCHAR(50) NOT NULL,
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_conversations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "conversations_type" VARCHAR(50),
    "status" VARCHAR(20),
    "conversations_title" VARCHAR(255),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" BIGSERIAL NOT NULL,
    "conversation_id" UUID NOT NULL,
    "user_id" UUID,
    "sender_type" VARCHAR(20) NOT NULL,
    "message_content" TEXT NOT NULL,
    "ai_response_metadata" JSONB,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_message_context" (
    "id" BIGSERIAL NOT NULL,
    "messages_id" BIGINT NOT NULL,
    "context_type" VARCHAR(50) NOT NULL,
    "alert_id" VARCHAR(50),
    "machine_serial" VARCHAR(100),
    "prediction_id" BIGINT,
    "maintenance_log_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_message_context_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "product_types_type_code_key" ON "product_types"("type_code");

-- CreateIndex
CREATE UNIQUE INDEX "machines_product_id_key" ON "machines"("product_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_machine_serial_fkey" FOREIGN KEY ("machine_serial") REFERENCES "machines"("serial") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inference_jobs" ADD CONSTRAINT "inference_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "sensor_readings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_inference_jobs_id_fkey" FOREIGN KEY ("inference_jobs_id") REFERENCES "inference_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_failure_type_serial_fkey" FOREIGN KEY ("failure_type_serial") REFERENCES "failure_types"("serial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_prediction_id_fkey" FOREIGN KEY ("prediction_id") REFERENCES "predictions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_machine_serial_fkey" FOREIGN KEY ("machine_serial") REFERENCES "machines"("serial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_acknowledgements" ADD CONSTRAINT "alert_acknowledgements_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_acknowledgements" ADD CONSTRAINT "alert_acknowledgements_acknowledged_by_fkey" FOREIGN KEY ("acknowledged_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_assignments" ADD CONSTRAINT "alert_assignments_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_assignments" ADD CONSTRAINT "alert_assignments_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_assignments" ADD CONSTRAINT "alert_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_resolutions" ADD CONSTRAINT "alert_resolutions_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_resolutions" ADD CONSTRAINT "alert_resolutions_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_machine_serial_fkey" FOREIGN KEY ("machine_serial") REFERENCES "machines"("serial") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message_context" ADD CONSTRAINT "chat_message_context_messages_id_fkey" FOREIGN KEY ("messages_id") REFERENCES "chat_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message_context" ADD CONSTRAINT "chat_message_context_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message_context" ADD CONSTRAINT "chat_message_context_machine_serial_fkey" FOREIGN KEY ("machine_serial") REFERENCES "machines"("serial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message_context" ADD CONSTRAINT "chat_message_context_prediction_id_fkey" FOREIGN KEY ("prediction_id") REFERENCES "predictions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message_context" ADD CONSTRAINT "chat_message_context_maintenance_log_id_fkey" FOREIGN KEY ("maintenance_log_id") REFERENCES "maintenance_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
