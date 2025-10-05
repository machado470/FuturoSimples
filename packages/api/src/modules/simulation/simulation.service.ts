import { Injectable } from '@nestjs/common';
import type { SimulationRequest, SimulationResult } from '@futurosimples/types';
import { runSimulation } from '@futurosimples/sim';

@Injectable()
export class SimulationService {
  run(payload: SimulationRequest): SimulationResult {
    return runSimulation(payload);
  }
}
