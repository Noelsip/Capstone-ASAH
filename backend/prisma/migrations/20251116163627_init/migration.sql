-- CreateIndex
CREATE INDEX "alert_acknowledgements_alert_id_idx" ON "alert_acknowledgements"("alert_id");

-- CreateIndex
CREATE INDEX "alert_acknowledgements_acknowledged_by_idx" ON "alert_acknowledgements"("acknowledged_by");

-- CreateIndex
CREATE INDEX "alert_acknowledgements_acknowledged_at_idx" ON "alert_acknowledgements"("acknowledged_at");

-- CreateIndex
CREATE INDEX "alert_assignments_alert_id_idx" ON "alert_assignments"("alert_id");

-- CreateIndex
CREATE INDEX "alert_assignments_assigned_to_idx" ON "alert_assignments"("assigned_to");

-- CreateIndex
CREATE INDEX "alert_assignments_assigned_by_idx" ON "alert_assignments"("assigned_by");

-- CreateIndex
CREATE INDEX "alert_assignments_assigned_at_idx" ON "alert_assignments"("assigned_at");

-- CreateIndex
CREATE INDEX "alert_history_alert_id_idx" ON "alert_history"("alert_id");

-- CreateIndex
CREATE INDEX "alert_history_user_id_idx" ON "alert_history"("user_id");

-- CreateIndex
CREATE INDEX "alert_history_action_idx" ON "alert_history"("action");

-- CreateIndex
CREATE INDEX "alert_history_created_at_idx" ON "alert_history"("created_at");

-- CreateIndex
CREATE INDEX "alert_resolutions_alert_id_idx" ON "alert_resolutions"("alert_id");

-- CreateIndex
CREATE INDEX "alert_resolutions_resolved_by_idx" ON "alert_resolutions"("resolved_by");

-- CreateIndex
CREATE INDEX "alert_resolutions_resolution_type_idx" ON "alert_resolutions"("resolution_type");

-- CreateIndex
CREATE INDEX "alert_resolutions_resolved_at_idx" ON "alert_resolutions"("resolved_at");

-- CreateIndex
CREATE INDEX "alerts_prediction_id_idx" ON "alerts"("prediction_id");

-- CreateIndex
CREATE INDEX "alerts_machine_serial_idx" ON "alerts"("machine_serial");

-- CreateIndex
CREATE INDEX "alerts_status_idx" ON "alerts"("status");

-- CreateIndex
CREATE INDEX "alerts_priority_idx" ON "alerts"("priority");

-- CreateIndex
CREATE INDEX "alerts_severity_idx" ON "alerts"("severity");

-- CreateIndex
CREATE INDEX "alerts_created_by_idx" ON "alerts"("created_by");

-- CreateIndex
CREATE INDEX "alerts_created_at_idx" ON "alerts"("created_at");

-- CreateIndex
CREATE INDEX "alerts_status_priority_idx" ON "alerts"("status", "priority");

-- CreateIndex
CREATE INDEX "chat_conversations_user_id_idx" ON "chat_conversations"("user_id");

-- CreateIndex
CREATE INDEX "chat_conversations_status_idx" ON "chat_conversations"("status");

-- CreateIndex
CREATE INDEX "chat_conversations_started_at_idx" ON "chat_conversations"("started_at");

-- CreateIndex
CREATE INDEX "chat_conversations_last_message_at_idx" ON "chat_conversations"("last_message_at");

-- CreateIndex
CREATE INDEX "chat_message_context_messages_id_idx" ON "chat_message_context"("messages_id");

-- CreateIndex
CREATE INDEX "chat_message_context_context_type_idx" ON "chat_message_context"("context_type");

-- CreateIndex
CREATE INDEX "chat_message_context_alert_id_idx" ON "chat_message_context"("alert_id");

-- CreateIndex
CREATE INDEX "chat_message_context_machine_serial_idx" ON "chat_message_context"("machine_serial");

-- CreateIndex
CREATE INDEX "chat_message_context_prediction_id_idx" ON "chat_message_context"("prediction_id");

-- CreateIndex
CREATE INDEX "chat_message_context_maintenance_log_id_idx" ON "chat_message_context"("maintenance_log_id");

-- CreateIndex
CREATE INDEX "chat_messages_conversation_id_idx" ON "chat_messages"("conversation_id");

-- CreateIndex
CREATE INDEX "chat_messages_user_id_idx" ON "chat_messages"("user_id");

-- CreateIndex
CREATE INDEX "chat_messages_sender_type_idx" ON "chat_messages"("sender_type");

-- CreateIndex
CREATE INDEX "chat_messages_sent_at_idx" ON "chat_messages"("sent_at");

-- CreateIndex
CREATE INDEX "failure_types_category_idx" ON "failure_types"("category");

-- CreateIndex
CREATE INDEX "inference_jobs_user_id_idx" ON "inference_jobs"("user_id");

-- CreateIndex
CREATE INDEX "inference_jobs_status_idx" ON "inference_jobs"("status");

-- CreateIndex
CREATE INDEX "inference_jobs_created_at_idx" ON "inference_jobs"("created_at");

-- CreateIndex
CREATE INDEX "machines_product_type_id_idx" ON "machines"("product_type_id");

-- CreateIndex
CREATE INDEX "machines_status_idx" ON "machines"("status");

-- CreateIndex
CREATE INDEX "machines_location_idx" ON "machines"("location");

-- CreateIndex
CREATE INDEX "machines_next_maintenance_idx" ON "machines"("next_maintenance");

-- CreateIndex
CREATE INDEX "maintenance_logs_machine_serial_idx" ON "maintenance_logs"("machine_serial");

-- CreateIndex
CREATE INDEX "maintenance_logs_performed_by_idx" ON "maintenance_logs"("performed_by");

-- CreateIndex
CREATE INDEX "maintenance_logs_maintenance_type_idx" ON "maintenance_logs"("maintenance_type");

-- CreateIndex
CREATE INDEX "maintenance_logs_status_idx" ON "maintenance_logs"("status");

-- CreateIndex
CREATE INDEX "maintenance_logs_scheduled_at_idx" ON "maintenance_logs"("scheduled_at");

-- CreateIndex
CREATE INDEX "maintenance_logs_completed_at_idx" ON "maintenance_logs"("completed_at");

-- CreateIndex
CREATE INDEX "predictions_sensor_id_idx" ON "predictions"("sensor_id");

-- CreateIndex
CREATE INDEX "predictions_inference_jobs_id_idx" ON "predictions"("inference_jobs_id");

-- CreateIndex
CREATE INDEX "predictions_failure_type_serial_idx" ON "predictions"("failure_type_serial");

-- CreateIndex
CREATE INDEX "predictions_severity_idx" ON "predictions"("severity");

-- CreateIndex
CREATE INDEX "predictions_predicted_at_idx" ON "predictions"("predicted_at");

-- CreateIndex
CREATE INDEX "predictions_target_idx" ON "predictions"("target");

-- CreateIndex
CREATE INDEX "roles_role_name_idx" ON "roles"("role_name");

-- CreateIndex
CREATE INDEX "sensor_readings_machine_serial_idx" ON "sensor_readings"("machine_serial");

-- CreateIndex
CREATE INDEX "sensor_readings_reading_timestamp_idx" ON "sensor_readings"("reading_timestamp");

-- CreateIndex
CREATE INDEX "sensor_readings_machine_serial_reading_timestamp_idx" ON "sensor_readings"("machine_serial", "reading_timestamp");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");
