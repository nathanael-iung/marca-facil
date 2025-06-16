import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {

  @Get('profile')
  @Roles(Role.ADMIN, Role.CLIENT)
  getProfile(@Req() req: Request) {
    // req.user contém os dados retornados pelo método validate() da JwtStrategy
    return {
      message: 'OK'
    }
  }
}
