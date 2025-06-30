import { Exclude } from "class-transformer";
import { Report } from "src/reports/report.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  // Associations (Relations) in TypeOrm (More at report.entity.ts)
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // Hooks
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}

// Defines serialization rules to transform User instances to JSON:
// - Controls what properties are exposed in API responses
// - Applies transformations to the raw entity data
// - Works with ClassSerializerInterceptor for automatic conversion


// @Expose() -> Include this field in JSON.
// @Exclude() -> Never show this field in JSON.