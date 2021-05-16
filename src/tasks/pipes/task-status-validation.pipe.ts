import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../tasks.model";

export class TaskStatusValidationPipe implements PipeTransform{
    readonly allowedStatus=[
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];
    transform(value: any, metadata: ArgumentMetadata){
        console.log('value', value);
        console.log('metadata',metadata);
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`invalid status "${value}"`)

        }
        

        return value;

    }

    public isStatusValid(status: any){
        const idx = this.allowedStatus.indexOf(status);
        return idx !== -1;

    }
}