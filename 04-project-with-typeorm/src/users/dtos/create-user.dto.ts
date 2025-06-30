import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  // Swagger:
  // @ApiProperty()
  // In order to make the class properties visible to the SwaggerModule
  // we have to either annotate them with the @ApiProperty() decorator
  // or use the CLI plugin (read more in the Plugin section) which will do it automatically.
  // Allows setting various Schema Object (https://swagger.io/specification/#schemaObject) properties.
  // @ApiProperty({
  //   description: 'The email of a user',
  //   minimum: 1,
  //   default: 1,
  //   type: Number // Array: [Number]
  // })
  
  // Comments introspection (introspectComments: true)
  /**
   * Email of the user.
   * @example example@example.com
   */
  @IsEmail()
  email: string;

  // @IsStrongPassword()
  @IsString()
  password: string;
}

// Use swagger plugin:
// At nest-cli.json:
/*
  "compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }
*/ 

// The Swagger plugin will automatically:
// annotate all DTO properties with @ApiProperty unless @ApiHideProperty is used
// set the required property depending on the question mark (e.g. name?: string will set required: false)
// set the type or enum property depending on the type (supports arrays as well)
// set the default property based on the assigned default value
// set several validation rules based on class-validator decorators (if classValidatorShim set to true)
// add a response decorator to every endpoint with a proper status and type (response model)
// generate descriptions for properties and endpoints based on comments (if introspectComments set to true)
// generate example values for properties based on comments (if introspectComments set to true)