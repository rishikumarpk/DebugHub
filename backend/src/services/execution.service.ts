import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function executeCode(language: string, code: string, challenge?: any) {
    if (challenge?.type === 'CODE_REVIEW') {
        const solved = code.trim() === challenge.correctCode.trim();
        return {
            stdout: solved ? "Code Review Passed" : "Issues still present in code.",
            stderr: '',
            exitCode: solved ? 0 : 1
        };
    }

    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const fileName = crypto.randomUUID();

    let execCmd = '';
    let filePath = '';

    const executeWait = (cmd: string): Promise<{ stdout: string, stderr: string, exitCode: number }> => {
        return new Promise((resolve) => {
            exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
                resolve({
                    stdout: stdout || '',
                    stderr: stderr || '',
                    exitCode: error ? (error.code || 1) : 0
                });
            });
        });
    };

    try {
        switch (language.toLowerCase()) {
            case 'javascript':
            case 'nodejs':
                filePath = path.join(tempDir, `${fileName}.js`);
                fs.writeFileSync(filePath, code);
                execCmd = `node ${filePath}`;
                break;
            case 'python':
                filePath = path.join(tempDir, `${fileName}.py`);
                fs.writeFileSync(filePath, code);
                execCmd = `python ${filePath}`;
                break;
            case 'cpp':
            case 'c':
                filePath = path.join(tempDir, `${fileName}.cpp`);
                const outPath = path.join(tempDir, `${fileName}.exe`);
                fs.writeFileSync(filePath, code);
                // Windows g++
                execCmd = `g++ ${filePath} -o ${outPath} && ${outPath}`;
                break;
            case 'java':
                // Write to Main.java for simplicity then run
                const javaDir = path.join(tempDir, fileName);
                fs.mkdirSync(javaDir);
                filePath = path.join(javaDir, 'Main.java');
                fs.writeFileSync(filePath, code);
                execCmd = `javac ${filePath} && java -cp ${javaDir} Main`;
                break;
            default:
                return { stdout: '', stderr: `Unsupported language locally: ${language}`, exitCode: 1 };
        }

        const result = await executeWait(execCmd);
        return result;
    } finally {
        // Cleanup best effort
        try { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { }
    }
}
