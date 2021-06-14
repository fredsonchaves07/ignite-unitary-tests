import { CreateStatementError } from '../createStatement/CreateStatementError';
import { ICreateStatementDTO } from './ICreateStatementDTO';
import { OperationType } from './../../entities/Statement';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository:  InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase

describe('Create Statement', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
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
            type: OperationType['DEPOSIT']
        }

        const result = await createStatementUseCase.execute(statement)

        expect(result).toHaveProperty('id')
    })

    it('Should not be able to create a new statement with user not already exist', () => {
        expect(async() => {
            const statement: ICreateStatementDTO = {
                user_id: '10',
                amount: 100,
                description: 'Deposity amount',
                type: OperationType['DEPOSIT']
            }

            await createStatementUseCase.execute(statement)
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })

    it('Should not be able to create a new statement with insufficient funds', () => {
        expect(async() => {
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
                type: OperationType['WITHDRAW']
            }

            await createStatementUseCase.execute(statement)
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })
})