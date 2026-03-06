import { knightCapitalScenario } from './knight-capital';
import type { IncidentScenario } from './types';

export const allScenarios: IncidentScenario[] = [
    knightCapitalScenario
];

export const getScenarioById = (id: string): IncidentScenario | undefined => {
    return allScenarios.find(s => s.id === id);
};
