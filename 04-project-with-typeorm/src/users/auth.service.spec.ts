import { Test } from '@nestjs/testing';
import { it } from 'node:test';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// We have Unit tests here.
// At *.spec.ts files.
// Unit testing => Make sure that individual methods on a class are working correctly.
// We should create a instance of the class and its dependencies (in order) to test its methods.
// But with DI system we avoid doing these creating dependencies.
// We going to make a fake copy of our dependencies (ex. UsersService here).

// describe => just for organizing our tests.
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  // Just Example.
  beforeEach(async () => {
    // Create a fake copy of UsersService
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: ({ email, password }: { email: string; password: string }) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Creating Testing DI Container
    const module = await Test.createTestingModule({
      providers: [
        AuthService, // We should provide copies of AuthService dependencies.
        {
          provide: UsersService,
          useValue: fakeUsersService, // If anyone asks for UsersService, give them this object.
        },
      ], // List of things we want to register (inject) in our Testing DI Container.
    }).compile();

    service = module.get(AuthService); // Creating an instance of AuthService
  });

  it('can create an instance of auth service.', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup({ email: 'asdf@asdf.com', password: 'asdf' });

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup({ email: 'asdf@asdf.com', password: 'asdf' });
    await expect(service.signup({ email: 'asdf@asdf.com', password: 'asdf' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin({ email: 'asdflkj@asdlfkj.com', password: 'passdflkj' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup({ email: 'laskdjf@alskdfj.com', password: 'password' });
    await expect(
      service.signin({ email: 'laskdjf@alskdfj.com', password: 'laksdlfkj' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup({ email: 'asdf@asdf.com', password: 'mypassword' });

    const user = await service.signin({ email: 'asdf@asdf.com', password: 'mypassword' });
    expect(user).toBeDefined();
  });
});
