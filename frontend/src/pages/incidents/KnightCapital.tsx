import { useState } from 'react';
import { RoleSelector } from '../../components/incidents/RoleSelector';
import { SimulationCanvas } from '../../components/incidents/SimulationCanvas';

export const KnightCapital = () => {
    const [activeRole, setActiveRole] = useState<string | null>(null);

    return (
        <div className="min-h-[calc(100vh-64px)] bg-black text-white relative w-full h-full overflow-hidden">
            {!activeRole ? (
                <RoleSelector onStart={(role: string) => setActiveRole(role)} />
            ) : (
                <SimulationCanvas
                    role={activeRole}
                    onAbort={() => setActiveRole(null)}
                    onReset={() => setActiveRole(null)}
                />
            )}
        </div>
    );
};

export default KnightCapital;
