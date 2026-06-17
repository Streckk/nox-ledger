import { registerDecorator, ValidationOptions } from 'class-validator';

const DATA_URL_PREFIX = /^data:[^;]+;base64,/;

/** Calcula el tamaño en bytes del contenido decodificado de una cadena base64. */
function base64ByteSize(value: string): number {
  const base64 = value.replace(DATA_URL_PREFIX, '');
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

/**
 * Valida que una cadena base64 (o data URL base64) no supere `maxBytes`
 * una vez decodificada. Cadenas vacías/nulas se consideran válidas (usar
 * junto con @IsOptional para campos opcionales).
 */
export function MaxBase64Size(
  maxBytes: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxBase64Size',
      target: object.constructor,
      propertyName,
      constraints: [maxBytes],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || value.length === 0) {
            return true;
          }
          return base64ByteSize(value) <= maxBytes;
        },
        defaultMessage() {
          const mb = Math.round(maxBytes / (1024 * 1024));
          return `La imagen no debe superar ${mb}MB`;
        },
      },
    });
  };
}
