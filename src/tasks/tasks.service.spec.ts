import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});
const mockUser = { id: 10, username: 'Rohan' }

describe('TaskService', () => {
    let taskService;
    let taskRepository;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ],
        }).compile();
        taskService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it(' gets all the tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filter: GetTaskFilter = { status: TaskStatus.IN_PROGRESS, search: 'search query' };
            const result = await taskService.getTasks(filter, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue')
        });
    });

    describe('getTasksById', () => {
        it(' calls tasksRepository.findOne() and successfully retrieve and return the value', async () => {
            const mockTask = { title: 'task', description: 'description' };
            taskRepository.findOne.mockResolvedValue(mockTask);
            const result = await taskService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                    where: {
                        id: 1, userId: mockUser.id
                    }
            });
        });
        it('throws an error when the task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    });
    describe('createTasks', () => {
        it(' create tasks in the repository', async () => {
            taskRepository.createTask.mockResolvedValue('someValue');
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTask: CreateTaskDto = { title: 'title', description: 'desc query' };
            const result = await taskService.createTask(createTask, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTask, mockUser);
            expect(result).toEqual('someValue')
        });
    });

    describe('deleteTasks', () => {
        it(' calls tasksRepository.deleteTask() to delete a task', async () => {
            taskRepository.delete.mockResolvedValue({affected:1});
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await taskService.deleteTaskById(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id});

        });
        it('throws an error when the task is not found', () => {
            taskRepository.delete.mockResolvedValue({affected:0});
            expect(taskService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    });

    describe('updateTasksStatus', () => {
        it('updates a task status', async () => {
            const save = jest.fn().mockResolvedValue(true);
            taskService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });
            expect(taskService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const result = await taskService.updateTask(1, TaskStatus.DONE, mockUser);
            expect(taskService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
})