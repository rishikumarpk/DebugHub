import { generateChallenge } from './src/services/llm.service';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log('Testing LLM Generation...');
    try {
        const result = await generateChallenge('python', 'DEBUGGING', 'EASY');
        console.log('Generated Successfully:');
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Failed:', e);
    }
}

test();
