import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

// This is where we write business logic and call repository methods.
// Services are on top of repositories, allowing controllers to interact with the database.

// We don't rely on getting exactly the MessagesRepository.
// Instead, we define an interface and can pass any object that satisfies it.

// interface Repository {
//   findOne(id: string);
//   findAll();
//   create(content: string);
// }

@Injectable()
export class MessagesService {
  constructor(public messagesRepo: MessagesRepository) {
    // DO NOT DO THIS IN REAL APPLICATIONS
    // In this example, the service creates its own dependency, which is not recommended.
    // In NestJS, we inject dependencies into different parts instead of creating them directly.
    // this.messagesRepo = new MessagesRepository();
  }

  findOne(id: string) {
    return this.messagesRepo.findOne(id);
  }

  findAll() {
    return this.messagesRepo.findAll();
  }

  create(content: string) {
    return this.messagesRepo.create(content);
  }
}
