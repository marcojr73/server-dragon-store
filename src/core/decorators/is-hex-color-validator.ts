import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsHexColor(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isHexColor',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value);
        },
        defaultMessage() {
          return 'Color must be a valid hex code (e.g. "#2ec7d6" or "2ec7d6")';
        },
      },
    });
  };
}
