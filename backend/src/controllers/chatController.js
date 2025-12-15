import { PrismaClient } from '../generated/prisma/index.js';
import mlService from "../services/mlService.js";

const prisma = new PrismaClient();

/**
 * Mengirim pesan ke chatbot dengan context
 * POST /chatbot/message
 * Body: { conversation_id?: uuid, message: string, context?: object }
 */
const sendMessage = async (req, res) => {
    try {
        const { conversation_id, message, context } = req.body;
        const userId = req.user.id;

        // Validasi input
        if (!message || message.trim() === '') {
            return res.status(400).json({
                message: 'Pesan tidak boleh kosong'
            });
        }

        let conversationId = conversation_id;

        // Jika conversation_id tidak diberikan, buat percakapan baru
        if (!conversationId) {
            const newConversation = await prisma.cHAT_CONVERSATIONS.create({
                data: {
                    user_id: userId,
                    conversations_type: 'maintenance_support',
                    status: 'active',
                    conversations_title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                    started_at: new Date()
                }
            });
            conversationId = newConversation.id;
        }

        // Menyimpan pesan user
        const userMessage = await prisma.cHAT_MESSAGES.create({
            data: {
                conversation_id: conversationId,
                user_id: userId,
                sender_type: 'user',
                message_content: message,
                sent_at: new Date()
            }
        });

        // Membuat enhanced question dengan context
        let enhancedQuestion = message;
        let contextData = null;

        if (context) {
            // Context untuk machine
            if (context.machine_serial) {
                const machine = await prisma.mACHINES.findUnique({
                    where: { serial: context.machine_serial },
                    include: {
                        product_type: true,
                        sensor_readings: {
                            orderBy: { reading_timestamp: 'desc' },
                            take: 1
                        }
                    }
                });

                if (machine) {
                    enhancedQuestion = `${message}\n\nContext: Mesin ${machine.serial} (${machine.product_type.type_name}), lokasi ${machine.location}, status ${machine.status}.`;

                    if (machine.sensor_readings.length > 0) {
                        const latest = machine.sensor_readings[0];
                        enhancedQuestion += ` Data sensor terbaru - Suhu Udara: ${latest.air_temperature_k}K, Suhu Proses: ${latest.process_temperature_k}K, RPM: ${latest.rotational_speed_rpm}, Torsi: ${latest.torque_nm}Nm, Tool Wear: ${latest.tool_wear_min}min.`;
                    }

                    contextData = {
                        machine_serial: context.machine_serial,
                        context_type: 'machine'
                    };
                }
            }

            // Context untuk alert
            if (context.alert_id) {
                const alert = await prisma.aLERTS.findUnique({
                    where: { id: context.alert_id },
                    include: {
                        prediction: {
                            include: {
                                failure_type: true
                            }
                        }
                    }
                });

                if (alert) {
                    enhancedQuestion += `\n\nAlert Context: ${alert.title} - ${alert.alert_desc}, Priority: ${alert.priority}, Status: ${alert.status}.`;

                    contextData = {
                        alert_id: context.alert_id,
                        context_type: 'alert'
                    };
                }
            }

            // Context untuk prediction
            if (context.prediction_id) {
                contextData = {
                    prediction_id: BigInt(context.prediction_id),
                    context_type: 'prediction'
                };
            }
        }

        // Mengirim ke chatbot ML service
        const chatbotResponse = await mlService.askChatbot(enhancedQuestion);

        // ✅ FIX: Check error dari mlService dengan benar
        if (!chatbotResponse.success) {
            // Service error (network, timeout, etc)
            return res.status(503).json({
                message: 'Layanan chatbot tidak tersedia',
                error: chatbotResponse.error
            });
        }

        // ✅ FIX: Validasi response structure
        const responseData = chatbotResponse.data;
        
        if (!responseData || typeof responseData !== 'object') {
            return res.status(500).json({
                message: 'Response chatbot tidak valid'
            });
        }

        // Parse response dari chatbot
        let messageContent = '';
        let metadata = responseData;

        // ✅ FIX: Handle semua kemungkinan response structure
        if (responseData.response) {
            // Response untuk pertanyaan umum
            messageContent = responseData.response;
        } else if (responseData.status_mesin) {
            // Response untuk status mesin
            messageContent = `Status mesin: ${responseData.status_mesin}`;

            if (responseData.jenis_kegagalan && responseData.jenis_kegagalan !== null) {
                messageContent += `\nJenis kegagalan yang terdeteksi: ${responseData.jenis_kegagalan}`;
            } else {
                messageContent += `\nTidak ada jenis kegagalan yang terdeteksi. Mesin dalam kondisi normal.`;
            }
        } else if (responseData.status === 'success' && !responseData.response && !responseData.status_mesin) {
            // ✅ FIX: Handle case dimana hanya ada {status: 'success'} tanpa data lain
            messageContent = 'Permintaan berhasil diproses, namun tidak ada informasi tambahan yang tersedia.';
        } else {
            messageContent = 'Maaf, saya tidak dapat memberikan jawaban saat ini.';
        }

        // Menyimpan response AI
        const aiMessage = await prisma.cHAT_MESSAGES.create({
            data: {
                conversation_id: conversationId,
                user_id: userId,
                sender_type: 'ai',
                message_content: messageContent,
                ai_response_metadata: metadata,
                sent_at: new Date()
            }
        });

        // Update conversation last_message_at
        await prisma.cHAT_CONVERSATIONS.update({
            where: { id: conversationId },
            data: { last_message_at: new Date() }
        });

        // Menyimpan context jika ada
        if (contextData) {
            await prisma.cHAT_MESSAGE_CONTEXT.create({
                data: {
                    messages_id: aiMessage.id,
                    ...contextData,
                    created_at: new Date()
                }
            });
        }

        return res.status(200).json({
            data: {
                conversation_id: conversationId,
                user_message: {
                    id: userMessage.id.toString(),
                    content: userMessage.message_content,
                    sent_at: userMessage.sent_at
                },
                ai_message: {
                    id: aiMessage.id.toString(),
                    content: aiMessage.message_content,
                    metadata: metadata,
                    sent_at: aiMessage.sent_at
                }
            }
        });
    } catch (error) {
        console.error('Chatbot Error:', error);
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

/**
 * Mendapatkan history conversation
 * GET /chatbot/conversations/:id/messages
 */
const getConversationMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        // Verifikasi conversation milik user
        const conversation = await prisma.cHAT_CONVERSATIONS.findUnique({
            where: { id }
        });

        if (!conversation) {
            return res.status(404).json({
                message: 'Percakapan tidak ditemukan'
            });
        }

        if (conversation.user_id !== req.user.id) {
            return res.status(403).json({
                message: 'Akses ditolak ke percakapan ini'
            });
        }

        const messages = await prisma.cHAT_MESSAGES.findMany({
            where: { conversation_id: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        user_email: true
                    }
                },
                context: {
                    include: {
                        machine: true,
                        alert: true,
                        prediction: true
                    }
                }
            },
            orderBy: { sent_at: 'asc' },
            skip: parseInt(offset),
            take: parseInt(limit)
        });

        const total = await prisma.cHAT_MESSAGES.count({
            where: { conversation_id: id }
        });

        // Convert BigInt to String
        const serializedMessages = messages.map(msg => {
            const serialized = {
                ...msg,
                id: msg.id.toString()
            };

            // context bisa berupa array atau single object
            if (msg.context && Array.isArray(msg.context) && msg.context.length > 0) {
                serialized.context = msg.context.map(ctx => ({
                    ...ctx,
                    messages_id: ctx.messages_id ? ctx.messages_id.toString() : null,
                    prediction_id: ctx.prediction_id ? ctx.prediction_id.toString() : null
                }));
            } else if (msg.context && !Array.isArray(msg.context)) {
                serialized.context = {
                    ...msg.context,
                    messages_id: msg.context.messages_id ? msg.context.messages_id.toString() : null,
                    prediction_id: msg.context.prediction_id ? msg.context.prediction_id.toString() : null
                };
            }
            return serialized;
        });

        res.status(200).json({
            data: serializedMessages,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                has_more: total > parseInt(offset) + parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get Conversation Messages Error:', error);
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

/**
 * Mendapatkan semua conversation user
 * GET /chatbot/conversations
 */
const getUserConversations = async (req, res) => {
    try {
        const { status, limit = 20, offset = 0 } = req.query;
        const userId = req.user.id;

        const where = { user_id: userId };
        if (status) where.status = status;

        const conversations = await prisma.cHAT_CONVERSATIONS.findMany({
            where,
            include: {
                messages: {
                    orderBy: { sent_at: 'desc' },
                    take: 1
                },
                _count: {
                    select: { messages: true }
                }
            },
            orderBy: { last_message_at: 'desc' },
            skip: parseInt(offset),
            take: parseInt(limit)
        });

        const total = await prisma.cHAT_CONVERSATIONS.count({ where });

        // Convert BigInt to String
        const serializedConversations = conversations.map(conv => ({
            ...conv,
            messages: conv.messages.map(msg => ({
                ...msg,
                id: msg.id.toString()
            }))
        }));

        res.status(200).json({
            data: serializedConversations,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                has_more: total > parseInt(offset) + parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get User Conversations Error:', error);
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

/**
 * Membuat conversation baru
 * POST /chatbot/conversations
 */
const createConversation = async (req, res) => {
    try {
        const { title, type = 'maintenance_support' } = req.body;
        const userId = req.user.id;

        const conversation = await prisma.cHAT_CONVERSATIONS.create({
            data: {
                user_id: userId,
                conversations_type: type,
                status: 'active',
                conversations_title: title || 'Percakapan Baru',
                started_at: new Date()
            }
        });

        return res.status(201).json({
            data: conversation
        });
    } catch (error) {
        console.error('Create Conversation Error:', error);
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

export default {
    sendMessage,
    getConversationMessages,
    getUserConversations,
    createConversation
};