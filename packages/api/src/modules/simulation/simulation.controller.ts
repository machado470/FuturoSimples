import { Body, Controller, Post } from '@nestjs/common';
import type { SimulationRequest, SimulationResult } from '@futurosimples/types';
import { SimulationService } from './simulation.service';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly service: SimulationService) {}

  @Post('run')
  run(@Body() body: SimulationRequest): SimulationResult {
    return this.service.run(body);
  }
}
