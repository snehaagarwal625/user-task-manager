import {User} from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('UserEntity',()=>{
    let user: User;
    beforeEach(()=>{
        user = new User();
        user.password = 'testPassword';
        user.salt = 'testSalt';
        bcrypt.hash = jest.fn();
    })
    describe('validatePassowrd',()=>{
        it('return true as password is valid', async()=>{
            bcrypt.hash = jest.fn().mockResolvedValue('testPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('123456');
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
            expect(result).toBeTruthy();
        })

        it('return false as password is invalid', async()=>{
            bcrypt.hash = jest.fn().mockResolvedValue('wrong');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await user.validatePassword('wrong');
            expect(bcrypt.hash).toHaveBeenCalledWith('wrong', 'testSalt');
            expect(result).toBeFalsy()
        })

    })

})