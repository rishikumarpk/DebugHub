export type SimulationRole = 'COMMANDER' | 'ENGINEER' | 'DBA' | 'COMMS';

export interface IncidentMetrics {
    burnRatePerSec: number;
    latencyMs: number;
    errorRate: number;
}

export type ActionSeverity = 'SAFE' | 'RISKY' | 'BLUNDER';

export interface IncidentAction {
    id: string;
    label: string;
    nextStateId: string;
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
    requiresInput?: string; // Correct answer user must type
    inputPrompt?: string; // What they see placeholder (e.g., "Enter faulty flag name:")
    severity?: ActionSeverity;
    blastDescription?: string;
    userMessageOnError?: string;
}

export interface IncidentAlert {
    id: string;
    message: string;
    type: 'slack' | 'pagerduty' | 'system';
    triggerAfterSeconds: number; // Ticks after entering this state
}

export interface IncidentState {
    id: string;
    description: string;
    metrics: IncidentMetrics;
    codeSnippet?: string;
    configSnippet?: string;
    logs?: string[];
    alerts?: IncidentAlert[];
    availableActionIds: string[];
    isTerminal?: boolean; // If true, triggers postmortem
    visualMode?: 'normal' | 'warning' | 'crash';
    progressIndicator?: 'WARMER' | 'COLDER' | 'NEUTRAL';
    hint?: string;
    autoTransition?: {
        stateId: string;
        durationSeconds: number;
    };
}

export interface PostmortemData {
    realRootCause: string;
    lessonsLearned: string;
    historicalTimeline: string[];
}

export interface IncidentScenario {
    id: string;
    title: string;
    company: string;
    date: string;
    impactSummary: string;
    difficulty: "EASY" | "MEDIUM" | "HARD" | "NIGHTMARE";
    tags: string[];
    thresholdLoss: number; // Max revenue loss before forced game over
    initialStateId: string;
    states: Record<string, IncidentState>;
    actions: Record<string, IncidentAction>;
    postmortemData: PostmortemData;
}
