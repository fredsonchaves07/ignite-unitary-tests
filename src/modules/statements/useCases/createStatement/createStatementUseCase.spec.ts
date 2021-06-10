import { ICreateStatementDTO } from './ICreateStatementDTO';
import { Statement } from './../../entities/Statement';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository:  InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase

describe('Create Statement', () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it('Should be able to create a statement', async() => {
        const user = await inMemoryUsersRepository.create({
            name: 'User test',
            email: 'user@email.com',
            password: '1234'
        })

        const user_id = String(user.id)

        const statement: ICreateStatementDTO = {
            user_id: user_id,
            amount: 100,
            description: 'Deposity amount',
            type: 'withdraw'
        }
    })
})