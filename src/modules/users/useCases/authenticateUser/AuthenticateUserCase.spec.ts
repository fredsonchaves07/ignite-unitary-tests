import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { AppError } from './../../../../shared/errors/AppError';
import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { ICreateUserDTO } from './../createUser/ICreateUserDTO';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepositoryInMemory: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe('Atuhenticate User', () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it('Should be able to authenticate an new user', async() => {
        const user: ICreateUserDTO = {
            name: 'User Test',
            email: 'user@email.com',
            password: '1234'
        }

        await createUserUseCase.execute(user)

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })

        expect(result).toHaveProperty('token')
    })

    it('Should not be able authenticate an noneexistent user', () => {
        expect(async() => {
            await authenticateUserUseCase.execute({
                email: 'false@email.com',
                password: '123'
            })
        }).rejects.toBeInstanceOf(AppError)
    })

    it('Should not be able authenticate with incorrect email', () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'User Test',
                email: 'user@email.com',
                password: '1234'
            }
    
            await createUserUseCase.execute(user)
    
            const result = await authenticateUserUseCase.execute({
                email: 'user1@email.com',
                password: user.password
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it('Should not be able authenticate with incorrect password', () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'User Test',
                email: 'user@email.com',
                password: '1234'
            }
    
            await createUserUseCase.execute(user)
    
            const result = await authenticateUserUseCase.execute({
                email: user.email,
                password: '123456'
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})