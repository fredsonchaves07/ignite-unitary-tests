import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"


let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show User Profile', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    })

    it('Should be able to show profile', async() => {
        const user = await inMemoryUsersRepository.create({
            name: 'User test',
            email: 'user@email.com',
            password: '1234'
        })

        const userProfile = await showUserProfileUseCase.execute(String(user.id))

        expect(user).toEqual(userProfile)
    })

    it('Should not be able to show profile with user not exist', () => {
        expect(async() => {
            await showUserProfileUseCase.execute('10')
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})