import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getAllUsers() {
        return this.userService.findAll()
    }

    @Get('/:idUser')
    getUserById(@Param('idUser') idUser: number) {
        return this.userService.findOne({idUser})
    }

}
