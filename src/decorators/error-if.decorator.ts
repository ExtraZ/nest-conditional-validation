import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
} from "class-validator";
import { PredicateFn } from "src/types";

export function ErrorIf(
	predicate: PredicateFn,
	validationOptions?: ValidationOptions,
) {
	return function (target: Object, propertyName: string) {
		registerDecorator({
			name: "errorIf",
			target: target.constructor,
			propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return !predicate(value, propertyName, args.object);
				},
			},
		});
	};
}
