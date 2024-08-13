import {NextResponse} from 'next/server'
import { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } from '@aws-sdk/client-bedrock-agent-runtime';

const systemPrompt = 'You are an AI-powered customer support assistant for NeuroAI, a platform dedicated to providing AI-driven support for students interested in the field of computational neuroscience field.'

const bedrockAgentRuntimeclient = new BedrockAgentRuntimeClient({ region: 'us-east-1' });

/*
1. NeuroAI offers AI-powered interviews for neuroscience students.
2. Our platform helps candidates practice and prepare for real neuroscience-related interviews.
3. We cover a wide range of topics, including cognitive science, neuroimaging, and computational neuroscience.
4. Users can access our services through our website or mobile app.
5. If asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.
6. Always maintain user privacy and do not share personal information.
7. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.

Your goal is to privde accurate information, assist with common inquiries, and ensure a positive experience for all NeuroAI users.
*/

async function getContext(query) {
    try {
        const params = {
            input: {
                text: query,
            },
            retrieveAndGenerateConfiguration: {
                type: 'KNOWLEDGE_BASE',
                knowledgeBaseConfiguration: {
                    knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
                    modelArn: process.env.MODEL_ARN,
                },
            },
        };

        const command = new RetrieveAndGenerateCommand(params);
        const response = await bedrockAgentRuntimeclient.send(command);
        return response.output.text;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// API route to handle POST requests
export async function POST(req) {
    try {
        const messages = await req.json();
        const user_message = messages[messages.length - 1].content;
        const prompt = `Human: ${user_message}\nAssistant:`;

        const resp = await getContext(prompt);

        return NextResponse.json({ message: resp });
    } catch (error) {
        console.error('Error handling request:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}