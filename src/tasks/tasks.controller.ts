import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
//import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService){}
    @Get()
    getTasks(
        @Query(ValidationPipe) getTaskFilterDto: GetTaskFilter,
        @GetUser() user: User,
    ): Promise<Task[]> {
        return this.taskService.getTasks(getTaskFilterDto, user);
     }

    @Get('/:id')
    getTaskById(@Param('id',ParseIntPipe) id: number, @GetUser() @GetUser() user: User): Promise<Task> {
        console.log(typeof(id));
        return this.taskService.getTaskById(id, user);
     }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ):Promise<Task>{
         return this.taskService.createTask(createTaskDto, user);   
    }

    @Delete('/:id')
    deteteTastById(@Param('id',ParseIntPipe) id: number, @GetUser() user: User): Promise<void>{
        return this.taskService.deleteTaskById(id, user);
    }

    @Patch('/:id/:status')
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body('status',TaskStatusValidationPipe,) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task>{
        return this.taskService.updateTask(id,status,user);
    }

    // @Get()
    // getTasks(@Query(ValidationPipe) getTaskFilterDto: GetTaskFilter): Task[]{
    //     if(Object.keys(getTaskFilterDto).length){
    //         return this.taskService.getTaskByFilter(getTaskFilterDto);
    //     }
    //     else{
    //         return this.taskService.getAllTask();
    //     }
        
    // }

    // @Get('/:id')
    // getTaskById(@Param('id') id: string): Task {
    //     return this.taskService.getTaskById(id);
    // }
    // @Delete('/:id')
    // deteteTastById(@Param('id') id: string): void{
    //     this.taskService.deleteTaskById(id);
    // }

    // @Post()
    // @UsePipes(ValidationPipe)
    // createTask(@Body() createTaskDto: CreateTaskDto){
    //      return this.taskService.createTask(createTaskDto);
        
    // }
    // @Patch('/:id/:status')
    // updateTask(
    //     @Param('id') id: string,
    //     @Body('status',TaskStatusValidationPipe) status: TaskStatus
    // ): Task{
    //     return this.taskService.updateTask(id,status);
    // }

}
