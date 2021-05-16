import { Injectable, NotFoundException } from '@nestjs/common';
//import { Task, TaskStatus } from './tasks.model';
//import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksModule } from './tasks.module';
import { GetTaskFilter } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { readlinkSync } from 'fs';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }
    
    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({where:{id, userId:user.id}});

        if (!found) {
            throw new NotFoundException(`Task with "${id}" not found`);
        }
        else return found;
    }
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number, user: User):Promise<void>{
        const result = await this.taskRepository.delete({id, userId: user.id});
        if(result.affected === 0){
            throw new NotFoundException(`Task with "${id}" not found`);

        }
        
    }
    async updateTask(id:number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;

    }
    async getTasks(
        filterDto: GetTaskFilter,
        user: User): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }

    // private tasks: Task[] = [];
    // getAllTask(){
    //     return this.tasks;
    // }

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);

    //     if(!found){
    //         throw new NotFoundException(`Task with "${id}" not found`);
    //     }
    //     else return found;
    // }

    // getTaskByFilter(getTaskByFilterDto: GetTaskFilter) {
    //     const {status, search} = getTaskByFilterDto;
    //     let tasks = this.getAllTask();
    //     if(status){
    //         tasks = this.tasks.filter(task => task.status == status)
    //     }

    //     if(search){
    //         tasks = this.tasks.filter(task =>
    //             task.title.includes(search)||
    //             task.description.includes(search),
    //         );
    //     }

    //     return tasks;

    // }

    // deleteTaskById(id: string):void{
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task =>task.id !== found.id);
    // }

    // updateTask(id:string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;

    // }

    // createTask(createTaskDto: CreateTaskDto): Task{
    //     const { title, description } = createTaskDto
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status : TaskStatus.OPEN,
    //     };
    //     this.tasks.push(task);
    //     return task;
    // }
}
