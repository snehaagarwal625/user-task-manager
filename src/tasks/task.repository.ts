import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./tasks.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { User } from "../auth/user.entity";
import { GetTaskFilter } from "./dto/get-task-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>{
        const { title, description } = createTaskDto
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        delete task.user;
        return task;
    }

    async getTasks(filterDto: GetTaskFilter, user: User): Promise<Task[]>{
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', {userId: user.id});
        if(status){
            query.andWhere('task.status = :status', {status});
        }
        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%`});
        }
        const tasks = await query.getMany();
        return tasks;
    }
    
}