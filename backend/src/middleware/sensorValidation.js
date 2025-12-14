/**
 * Middleware validasi sensor data
 * Berdasarkan range dataset AI Predictive Maintenance:
 * - Air Temperature: 295-305 K (typical range, allow ±5K tolerance)
 * - Process Temperature: 305-315 K (typical range, allow ±5K tolerance)
 * - Rotational Speed: 1168-2886 RPM (dataset range)
 * - Torque: 3.8-76.6 Nm (dataset range)
 * - Tool Wear: 0-253 min (dataset range, allow up to 300)
 */
export const validateSensorData = (req, res, next) => {
  const {
    machine_serial,
    air_temperature_k,
    process_temperature_k,
    rotational_speed_rpm,
    torque_nm,
    tool_wear_min
  } = req.body;

  const errors = [];

  // Validasi machine_serial (required)
  if (!machine_serial || typeof machine_serial !== 'string' || machine_serial.trim() === '') {
    errors.push('machine_serial adalah field wajib dan harus string tidak kosong');
  }

  // Validasi Air Temperature (optional tapi jika ada harus valid)
  if (air_temperature_k !== null && air_temperature_k !== undefined) {
    const temp = parseFloat(air_temperature_k);
    if (isNaN(temp)) {
      errors.push('air_temperature_k harus berupa angka');
    } else if (temp < 290 || temp > 310) {
      errors.push('air_temperature_k harus antara 290-310 K (±5K dari range normal 295-305K)');
    }
  }

  // Validasi Process Temperature (optional)
  if (process_temperature_k !== null && process_temperature_k !== undefined) {
    const temp = parseFloat(process_temperature_k);
    if (isNaN(temp)) {
      errors.push('process_temperature_k harus berupa angka');
    } else if (temp < 300 || temp > 320) {
      errors.push('process_temperature_k harus antara 300-320 K (±5K dari range normal 305-315K)');
    }
  }

  // Validasi Rotational Speed (optional)
  if (rotational_speed_rpm !== null && rotational_speed_rpm !== undefined) {
    const rpm = parseFloat(rotational_speed_rpm);
    if (isNaN(rpm)) {
      errors.push('rotational_speed_rpm harus berupa angka');
    } else if (rpm < 1000 || rpm > 3000) {
      errors.push('rotational_speed_rpm harus antara 1000-3000 RPM');
    }
  }

  // Validasi Torque (optional)
  if (torque_nm !== null && torque_nm !== undefined) {
    const torque = parseFloat(torque_nm);
    if (isNaN(torque)) {
      errors.push('torque_nm harus berupa angka');
    } else if (torque < 0 || torque > 100) {
      errors.push('torque_nm harus antara 0-100 Nm');
    }
  }

  // Validasi Tool Wear (optional)
  if (tool_wear_min !== null && tool_wear_min !== undefined) {
    const toolWear = parseFloat(tool_wear_min);
    if (isNaN(toolWear)) {
      errors.push('tool_wear_min harus berupa angka');
    } else if (toolWear < 0 || toolWear > 300) {
      errors.push('tool_wear_min harus antara 0-300 menit');
    }
  }

  // Jika ada error, return 400
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Data sensor tidak valid',
      errors: errors
    });
  }

  // Jika valid, lanjut ke controller
  next();
};

/**
 * Validasi batch sensor data
 */
export const validateBatchSensorData = (req, res, next) => {
  const { readings } = req.body;

  if (!Array.isArray(readings)) {
    return res.status(400).json({
      status: 'error',
      message: 'readings harus berupa array'
    });
  }

  if (readings.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'readings tidak boleh kosong'
    });
  }

  if (readings.length > 100) {
    return res.status(400).json({
      status: 'error',
      message: 'Maksimal 100 readings per batch request'
    });
  }

  // Validasi setiap reading
  const errors = [];
  readings.forEach((reading, index) => {
    if (!reading.machine_serial) {
      errors.push(`readings[${index}]: machine_serial diperlukan`);
    }
    // Bisa tambah validasi lainnya per reading jika perlu
  });

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Batch data tidak valid',
      errors: errors
    });
  }

  next();
};

export default {
  validateSensorData,
  validateBatchSensorData
};