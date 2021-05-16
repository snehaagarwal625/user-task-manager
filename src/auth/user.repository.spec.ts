import { ConflictException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import {UserRepository} from './user.repository';
import * as bcrypt from 'bcryptjs';

const mockUser = { id: 10, username: 'Rohan' }
const mockCredentialsDto = {username: 'username', password: 'password'};

describe('UserRepository', () => {
    let userRepository;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ],
        }).compile();
        userRepository = await module.get<UserRepository>(UserRepository);
    });
    describe('signup',()=>{
        let save;
        beforeEach(async () => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({save}); 
        });
        it('it successfully signs up the user', ()=>{
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();

        })
        it('throws a conflict as user name already exists', ()=>{
            save.mockRejectedValue({code: '23505'});
            expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        })
        it('incorrect error code', ()=>{
            save.mockRejectedValue({code: '212305'});
            expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });
    });
    describe('validatePassword',()=>{
        let user;
        beforeEach(()=>{
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = 'TestUserName';
            user.validatePassword = jest.fn();
        })
        it('returns the username as validation is successfull',async()=>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(result).toEqual('TestUserName');

        });

        it('returns null as user cannot be found', async ()=>{
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('returns null as password is invalid', async()=>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('hashpassword', ()=>{
        it('calls bcrypt.hash to generate a hash', async()=>{
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('testPassword', 'testSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testHash');

        })
    })
})