import {NextResponse} from 'next/server'

const systemPrompt = 'You are an AI-powered customer support assistant for NeuroAI, a platform dedicated to providing AI-driven support for students interested in the field of computational neuroscience field.'
/*
Embedding is what the user puts in'
1 hour: 45 minutes
must be implemented in javascript
most of code is same
js version of some code
to insert into pinecone script allows, but take the query and convert into bedding.
show response to user in front end.
look at docs for pinecone and langchain, same idea. just syntax
langchain pinecone website shows basically exact code.
https://js.langchain.com/v0.2/docs/integrations/vectorstores/pinecone/

/*

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
            input : {
                text: query
            },
            retrieveAndGenerateConfiguration: {
                type: 'KNOWLEDGE_BASE',
                knowledgeBaseConfiguration: {
                    knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
                    modelArn: process.env.MODEL_ARN
                }
            }
        };

        const command = new retrieveAndGenerateCommand(params);
        const response = await bedrock.Client.send(command);
        return response.output.text;
    } catch(error) {
        console.error('Error:', error);
        return null;
    }
}

export async function POST(req){    //frontend
    const messages = await req.json();
    const user_message = messages[messages.length - 1].content;
    const prompt = `Human: ${user_message}\nAssistant:`; 
    console.log(await getContext(prompt));
    return new NextResponse(resp)
/*
    const stream = new ReadableStream({ //start streaming it
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]?.delta?.content
                    if (content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(error){
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream) //return stream
*/
    }