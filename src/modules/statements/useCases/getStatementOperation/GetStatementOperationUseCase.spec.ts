import { OperationType } from './../../entities/Statement';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { GetStatementOperationError } from './GetStatementOperationError';


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository:  InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe('Get Statement', () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it('Should be able to get a statement', async() => {
        const user = await inMemoryUsersRepository.create({
            name: 'User test',
            email: 'user@email.com',
            password: '1234'
        })

        const user_id = String(user.id)

        const statement = await inMemoryStatementsRepository.create({
            user_id: user_id,
            amount: 100,
            description: 'Deposity amount',
            type: OperationType['DEPOSIT']
        })

        const statement_id = String(statement.id)

        const result = await getStatementOperationUseCase.execute({
            user_id: user_id,
            statement_id: statement_id
        })

        expect(result).toHaveProperty('id')
    })

    it('Should not be able to get statement user not already exist', () => {
        expect(async() => {
            await getStatementOperationUseCase.execute({
                user_id: '10',
                statement_id: '10'
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it('Should not be able to get statement with statement not already exist', () => {
        expect(async() => {
            const user = await inMemoryUsersRepository.create({
                name: 'User test',
                email: 'user@email.com',
                password: '1234'
            })
    
            const user_id = String(user.id)
    
            const statement = await inMemoryStatementsRepository.create({
                user_id: user_id,
                amount: 100,
                description: 'Deposity amount',
                type: OperationType['DEPOSIT']
            })

            await getStatementOperationUseCase.execute({
                user_id: user_id,
                statement_id: '10'
            })
    
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })
})