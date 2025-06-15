import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  // We said that DI system uses type annotations to figure out
  // what instance it needs to inject into this class at runtime.
  // Unfortunately, the DI system does not play nicely with generics,
  // which is why we need to use the @InjectRepository() decorator
  // here to explicitly specify which repository we want to inject.

  create({ email, password }: { email: string, password: string }) {
    const user = this.repo.create({ email, password }); // Creates an instance of User entity.
    return this.repo.save(user); // Persist the user to the database
    // Alternative: We could directly save { email, password } without creating an entity,
    // but this would skip entity validation and lifecycle hooks (@BeforeInsert, etc.)
    // return this.repo.save({ email, password });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  findMany(email: string) {
    return this.repo.find({
      where: {
        email
      }
    });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.repo.remove(user);
  }
}

// Direct save() operations (insert/update/delete) bypass:
// - Entity validation (@Column constraints, class-validator rules)
// - TypeORM lifecycle hooks (@BeforeInsert, @AfterUpdate, etc.)
// - Entity method logic (if defined in the User class)