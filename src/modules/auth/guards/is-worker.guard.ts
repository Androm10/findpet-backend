import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ShelterService } from 'src/modules/shelter/shelter.service';

@Injectable()
export class IsWorkerGuard implements CanActivate {
  constructor(private shelterService: ShelterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user, body, params } = req;
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const shelterId = body.shelterId || params.shelterId || params.id;
    if (!shelterId) {
      return true;
    }

    const workers = await this.shelterService.getWorkers(shelterId);
    if (workers.find((w) => w.id === user.id)) {
      return true;
    }
    throw new ForbiddenException(
      'You must be a worker of shelter with requested id',
    );
  }
}
