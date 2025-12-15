# Predictive Maintenance API - Testing Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Testing Workflow](#testing-workflow)
4. [Endpoint Details](#endpoint-details)
5. [Common Issues](#common-issues)

---

## 🚀 Quick Start

### 1. Import Postman Collection

1. Buka Postman
2. Click **Import** button
3. Pilih file: `Predictive_Maintenance_API.postman_collection.json`
4. Collection akan muncul di sidebar

### 2. Setup Environment Variables

Collection sudah include 2 variables:
- `base_url`: `http://localhost:3000` (default)
- `auth_token`: (akan terisi otomatis setelah login)

**Untuk edit variables:**
1. Click pada collection name
2. Tab **Variables**
3. Edit value sesuai kebutuhan

### 3. Start Server

```bash
# Start database
docker-compose up -d

# Run server
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

---

## 🔐 Authentication

### Step 1: Login

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important:** Token akan otomatis tersimpan ke environment variable `auth_token` via test script.

### Step 2: Use Token

Semua protected endpoints memerlukan header:
```
Authorization: Bearer {{auth_token}}
```

Token sudah diatur otomatis di semua request yang memerlukan authentication.

---

## 🧪 Testing Workflow

### Workflow 1: Basic Sensor Data Collection

```
1. Login (GET token)
   ↓
2. Get All Machines (verify machine exists)
   ↓
3. Create Sensor Data (save sensor reading)
   ↓
4. Get Latest Sensor (verify data saved)
```

**Testing Steps:**

1. **Login**
   - Endpoint: `POST /auth/login`
   - Verify: Token received and saved

2. **Get All Machines**
   - Endpoint: `GET /machines`
   - Verify: Machines list returned
   - Copy a `serial` for next steps (e.g., "M001-A")

3. **Create Sensor Data**
   - Endpoint: `POST /sensor-data`
   - Body:
   ```json
   {
     "machine_serial": "M001-A",
     "air_temperature_k": 298.1,
     "process_temperature_k": 308.6,
     "rotational_speed_rpm": 1551,
     "torque_nm": 42.8,
     "tool_wear_min": 0
   }
   ```
   - Verify: Status 201, data returned

4. **Get Latest Sensor**
   - Endpoint: `GET /sensor-data/latest?machine_serial=M001-A`
   - Verify: Data matches what you just created

---

### Workflow 2: ML Prediction Analysis

```
1. Login
   ↓
2. Analyze Maintenance (with sensor data)
   ↓
3. Get Latest Prediction
   ↓
4. Check if Alert Created (if prediction=1)
```

**Testing Steps:**

1. **Login**
   - Get authentication token

2. **Analyze Maintenance**
   - Endpoint: `POST /predictions/analize`
   - Body:
   ```json
   {
     "machine_serial": "M001-A",
     "sensor_data": {
       "air_temperature_k": 298.1,
       "process_temperature_k": 308.6,
       "rotational_speed_rpm": 1551,
       "torque_nm": 42.8,
       "tool_wear_min": 0
     }
   }
   ```
   - Verify:
     - Sensor data saved to database
     - ML prediction returned
     - Machine status updated
     - Alert created (if target=1)

3. **Get Latest Prediction**
   - Endpoint: `GET /predictions/latest?machine_serial=M001-A`
   - Verify: Prediction matches analysis result

---

### Workflow 3: AI Chatbot Interaction

```
1. Login
   ↓
2. Send Message (general question)
   ↓
3. Send Message with Machine Context
   ↓
4. Get Conversations List
   ↓
5. Get Conversation Messages
```

**Testing Steps:**

1. **Send General Message**
   - Endpoint: `POST /chat/message`
   - Body:
   ```json
   {
     "message": "Halo, apa kabar?"
   }
   ```
   - Verify:
     - New conversation created
     - AI response returned
     - Copy `conversation_id` from response

2. **Send Message with Context**
   - Endpoint: `POST /chat/message`
   - Body:
   ```json
   {
     "conversation_id": "uuid-from-previous-step",
     "message": "Bagaimana status mesin M001-A?",
     "context": {
       "machine_serial": "M001-A"
     }
   }
   ```
   - Verify:
     - AI response includes machine context
     - Message saved to same conversation

3. **Get Conversations**
   - Endpoint: `GET /chat/conversations`
   - Verify: Your conversations listed

4. **Get Messages**
   - Endpoint: `GET /chat/conversations/{id}/messages`
   - Verify: All messages in conversation returned

---

## 📚 Endpoint Details

### Authentication Endpoints

#### POST /auth/login
Mendapatkan JWT token untuk authentication.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login berhasil",
  "token": "jwt_token_string"
}
```

**Errors:**
- 400: Email atau password kosong
- 401: Password salah
- 404: User tidak ditemukan

---

#### GET /auth/profile
Mendapatkan profile user yang sedang login.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "string",
  "is_active": true,
  "last_login": "datetime"
}
```

---

### Machine Endpoints

#### GET /machines
Mendapatkan list semua mesin.

**Query Parameters:**
- `status`: active|inactive|maintenance|warning (optional)
- `location`: string (optional)
- `type`: L|M|H (optional)

**Response (200):**
```json
{
  "data": [
    {
      "serial": "M001-A",
      "product_id": "M14868",
      "name": "CNC Machine A",
      "type": "Medium",
      "location": "Plant 1",
      "status": "active",
      "latest_sensor": {
        "timestamp": "datetime",
        "temperature": 308.6,
        "rpm": 1551
      },
      "stats": {
        "total_sensor_readings": 100,
        "total_alerts": 5
      }
    }
  ]
}
```

---

#### GET /machines/:serial
Mendapatkan detail mesin.

**Response (200):**
```json
{
  "data": {
    "serial": "M001-A",
    "name": "CNC Machine A",
    "type": {...},
    "status": "active",
    "recent_sensors": [...],
    "recent_alerts": [...],
    "recent_maintenance": [...]
  }
}
```

---

#### PATCH /machines/:serial/status
Update status mesin.

**Request:**
```json
{
  "status": "maintenance"
}
```

**Response (200):**
```json
{
  "message": "Status mesin berhasil diupdate",
  "data": {
    "serial": "M001-A",
    "name": "CNC Machine A",
    "status": "maintenance"
  }
}
```

---

### Sensor Data Endpoints

#### POST /sensor-data
Menyimpan data sensor baru.

**Request:**
```json
{
  "machine_serial": "M001-A",
  "air_temperature_k": 298.1,
  "process_temperature_k": 308.6,
  "rotational_speed_rpm": 1551,
  "torque_nm": 42.8,
  "tool_wear_min": 0
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Data sensor berhasil disimpan",
  "data": {
    "id": "1",
    "machine_serial": "M001-A",
    "timestamp": "datetime",
    "air_temperature": 298.1,
    "process_temperature": 308.6,
    "rpm": 1551,
    "torque": 42.8,
    "tool_wear": 0
  }
}
```

---

#### POST /sensor-data/batch
Batch insert sensor data.

**Request:**
```json
{
  "readings": [
    {
      "machine_serial": "M001-A",
      "air_temperature_k": 298.1,
      "process_temperature_k": 308.6,
      "rotational_speed_rpm": 1551,
      "torque_nm": 42.8,
      "tool_wear_min": 0
    },
    {
      "machine_serial": "M001-A",
      "air_temperature_k": 298.2,
      "process_temperature_k": 308.7,
      "rotational_speed_rpm": 1408,
      "torque_nm": 46.3,
      "tool_wear_min": 3
    }
  ]
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "2 data sensor berhasil disimpan",
  "data": {
    "count": 2
  }
}
```

---

#### GET /sensor-data/latest
Mendapatkan sensor data terbaru.

**Query Parameters:**
- `machine_serial`: string (optional)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "1",
    "machine": {...},
    "timestamp": "datetime",
    "air_temperature": 298.1,
    "process_temperature": 308.6,
    "rotational_speed": 1551,
    "torque": 42.8,
    "tool_wear": 0
  }
}
```

---

#### GET /sensor-data
Mendapatkan history sensor data.

**Query Parameters:**
- `machine_serial`: string (optional)
- `limit`: number (default: 100)
- `offset`: number (default: 0)
- `start_date`: ISO date string (optional)
- `end_date`: ISO date string (optional)

**Response (200):**
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 100,
    "offset": 0,
    "has_more": true
  }
}
```

---

### Prediction Endpoints

#### POST /predictions/analize
Menganalisis maintenance dengan ML model.

**Request (dengan sensor data baru):**
```json
{
  "machine_serial": "M001-A",
  "sensor_data": {
    "air_temperature_k": 298.1,
    "process_temperature_k": 308.6,
    "rotational_speed_rpm": 1551,
    "torque_nm": 42.8,
    "tool_wear_min": 0
  }
}
```

**Request (gunakan sensor terbaru):**
```json
{
  "machine_serial": "M001-A"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Analisis prediksi berhasil",
  "data": {
    "machine": {
      "serial": "M001-A",
      "name": "CNC Machine A",
      "type": "Medium",
      "location": "Plant 1",
      "status": "normal"
    },
    "sensor_reading": {
      "id": "1",
      "timestamp": "datetime",
      "air_temperature": 298.1,
      "process_temperature": 308.6,
      "rpm": 1551,
      "torque": 42.8,
      "tool_wear": 0
    },
    "prediction": {
      "id": "1",
      "needs_maintenance": false,
      "failure_type": null,
      "confidence": 0.95,
      "severity": "low",
      "predicted_at": "datetime"
    },
    "alert": null,
    "ml_response": {
      "prediction": 0,
      "confidence": 0.95,
      "failure_type": null
    }
  }
}
```

---

#### GET /predictions
Mendapatkan semua prediksi.

**Query Parameters:**
- `machine_serial`: string (optional)
- `severity`: low|medium|high (optional)
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response (200):**
```json
{
  "status": "success",
  "data": [...],
  "pagination": {...}
}
```

---

#### GET /predictions/latest
Mendapatkan prediksi terbaru.

**Query Parameters:**
- `machine_serial`: string (optional)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "1",
    "target": 0,
    "failure_type": null,
    "confidance_score": 0.95,
    "severity": "low",
    "predicted_at": "datetime",
    "sensor_reading": {...},
    "alert": null
  }
}
```

---

### Chatbot Endpoints

#### POST /chat/message
Mengirim pesan ke chatbot.

**Request (conversation baru):**
```json
{
  "message": "Halo, apa kabar?"
}
```

**Request (conversation existing):**
```json
{
  "conversation_id": "uuid",
  "message": "Bagaimana status mesin M001-A?"
}
```

**Request (dengan context):**
```json
{
  "message": "Apa yang harus saya lakukan?",
  "context": {
    "machine_serial": "M001-A",
    "alert_id": "ALT-1234567890-M001"
  }
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "conversation_id": "uuid",
    "user_message": {
      "id": "uuid",
      "content": "Halo, apa kabar?",
      "sent_at": "datetime"
    },
    "ai_message": {
      "id": "uuid",
      "content": "Halo! Saya baik-baik saja...",
      "metadata": {...},
      "sent_at": "datetime"
    }
  }
}
```

---

#### GET /chat/conversations
Mendapatkan semua conversation user.

**Query Parameters:**
- `status`: active|archived (optional)
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "conversations_title": "New Conversation",
      "conversations_type": "maintenance_support",
      "status": "active",
      "started_at": "datetime",
      "last_message_at": "datetime",
      "messages": [...],
      "_count": {
        "messages": 5
      }
    }
  ],
  "pagination": {...}
}
```

---

#### POST /chat/conversations
Membuat conversation baru.

**Request:**
```json
{
  "title": "Troubleshooting Machine M001-A",
  "type": "maintenance_support"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "conversations_title": "Troubleshooting Machine M001-A",
    "conversations_type": "maintenance_support",
    "status": "active",
    "started_at": "datetime"
  }
}
```

---

#### GET /chat/conversations/:id/messages
Mendapatkan messages dari conversation.

**Query Parameters:**
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_type": "user",
      "message_content": "Halo",
      "sent_at": "datetime",
      "user": {...},
      "context": null
    },
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_type": "ai",
      "message_content": "Halo! Ada yang bisa saya bantu?",
      "sent_at": "datetime",
      "user": null,
      "context": null
    }
  ],
  "pagination": {...}
}
```

---

## ⚠️ Common Issues

### 1. 401 Unauthorized

**Problem:** Token expired atau invalid

**Solution:**
1. Re-login menggunakan `/auth/login`
2. Verify token tersimpan di environment variable
3. Check Authorization header format: `Bearer {token}`

---

### 2. 404 Machine Not Found

**Problem:** Machine serial tidak ada di database

**Solution:**
1. Get list machines: `GET /machines`
2. Use existing machine serial dari response
3. Atau create machine via database seed/migration

---

### 3. 503 ML Service Unavailable

**Problem:** ML API tidak bisa diakses

**Solution:**
1. Check `.env` file:
   - `ML_PREDICT_URL` correct?
   - `ML_CHATBOT_URL` correct?
2. Test ML endpoints directly (curl/browser)
3. Check network/firewall settings
4. Verify ML services are running

---

### 4. 400 Invalid Request

**Problem:** Request body tidak sesuai format

**Solution:**
1. Check Content-Type header: `application/json`
2. Verify JSON format valid (no trailing comma)
3. Check required fields present
4. Verify data types match (number vs string)

---

### 5. Connection Refused

**Problem:** Server tidak running atau port salah

**Solution:**
1. Start server: `npm run dev`
2. Check server logs for errors
3. Verify port 3000 available
4. Check `base_url` in Postman variables

---

## 📝 Testing Checklist

### ✅ Authentication
- [ ] Login dengan credentials valid
- [ ] Token tersimpan di environment
- [ ] Get profile dengan token valid
- [ ] Test dengan token invalid (should return 401)

### ✅ Machines
- [ ] Get all machines
- [ ] Filter by status
- [ ] Get machine detail by serial
- [ ] Update machine status

### ✅ Sensor Data
- [ ] Create single sensor data
- [ ] Batch create sensor data
- [ ] Get latest sensor
- [ ] Get sensor history with pagination
- [ ] Filter by date range

### ✅ Predictions
- [ ] Analyze dengan sensor data baru
- [ ] Analyze dengan sensor existing
- [ ] Verify prediction saved
- [ ] Check alert created (jika target=1)
- [ ] Get all predictions
- [ ] Get latest prediction

### ✅ Chatbot
- [ ] Send message (new conversation)
- [ ] Send message (existing conversation)
- [ ] Send with machine context
- [ ] Send with alert context
- [ ] Get conversations list
- [ ] Get conversation messages
- [ ] Create conversation manually

### ✅ Error Handling
- [ ] Test all endpoints without token (should return 401)
- [ ] Test dengan invalid machine serial (should return 404)
- [ ] Test dengan invalid request body (should return 400)
- [ ] Test pagination limits

---

## 🎯 Next Steps

1. **Run Full Test Suite**
   - Import collection
   - Run all requests in order
   - Verify responses

2. **Custom Testing**
   - Modify request bodies
   - Test edge cases
   - Test error scenarios

3. **Integration Testing**
   - Test complete workflows
   - Verify data consistency
   - Check ML service responses

4. **Performance Testing**
   - Test with large datasets
   - Batch operations
   - Concurrent requests

---

## 📞 Support

Jika mengalami issues:
1. Check server logs: `npm run dev`
2. Check database: `npm run prisma:studio`
3. Verify environment variables in `.env`
4. Check Docker containers: `docker ps`

---

**Happy Testing! 🚀**
