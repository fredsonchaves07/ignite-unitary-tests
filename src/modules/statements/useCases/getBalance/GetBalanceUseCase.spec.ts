import { ICreateStatementDTO } from './../createStatement/ICreateStatementDTO';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { OperationType } from './../../entities/Statement';
import { GetBalanceError } from './GetBalanceError';


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository:  InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

describe('Get Balance', () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    })

    it('Should be able to get balance', async() => {
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

        await inMemoryStatementsRepository.create(statement)

        const result = await getBalanceUseCase.execute({
            user_id: user_id
        })

        expect(result).toHaveProperty('balance')
        expect(result.balance).not.toBeNaN()
    })

    it('Should not be able to get balant user not already exist', () => {
        expect(async() => {
            await getBalanceUseCase.execute({
                user_id: '10'
            })
        }).rejects.toBeInstanceOf(GetBalanceError)
    })
})