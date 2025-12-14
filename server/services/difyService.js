export async function sendToDify({ message, userId, conversationId = '' }) {
    const response = await fetch(`${process.env.DIFY_API_URL}/chat-messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: {},
            query: message,
            response_mode: 'blocking',
            conversation_id: conversationId,
            user: userId
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Dify API error: ${err}`);
    }

    return response.json();
}
