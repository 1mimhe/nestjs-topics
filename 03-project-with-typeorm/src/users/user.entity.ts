import { Exclude } from "class-transformer";
import { AfterInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// First, we create our entity.
// Then, we connect the entity to its parent module. This creates repository for us automatically.
// Then, we connect the entity to the root module.

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude() // Rule: Removes this field from serialized responses
  password: string;

  // Hooks
  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id', this.id);
  }
}

// Defines serialization rules to transform User instances to JSON:
// - Controls what properties are exposed in API responses
// - Applies transformations to the raw entity data
// - Works with ClassSerializerInterceptor for automatic conversion


// @Expose() -> Include this field in JSON.
// @Exclude() -> Never show this field in JSON.