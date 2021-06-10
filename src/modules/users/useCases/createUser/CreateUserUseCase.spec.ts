import { CreateUserError } from './CreateUserError';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create a user', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it('Should be able to create a new car', async() => {
        const user = await createUserUseCase.execute({
            name: 'User Test',
            password: '1234',
            email: 'user@email.com'
        })

        expect(user).toHaveProperty('id')
    })

    it('Should not be able to create a user with email aready exist', () => {
        expect(async() => {
            await createUserUseCase.execute({
                name: 'User Test',
                password: '1234',
                email: 'user@email.com'
            })

            await createUserUseCase.execute({
                name: 'User Test3',
                password: '126',
                email: 'user@email.com'
            })
        }).rejects.toBeInstanceOf(CreateUserError)
    })

    
})