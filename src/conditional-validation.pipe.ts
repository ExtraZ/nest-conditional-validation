import { ArgumentMetadata, Injectable, ValidationPipe } from "@nestjs/common";
import { getGroupsMetadata } from "./decorators";

@Injectable()
export class ConditionalValidationPipe extends ValidationPipe {
	async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
		const fakeThis: this = Object.assign(
			Object.create(Object.getPrototypeOf(this)),
			this,
		);

		if (metadata.metatype != null && this.toValidate(metadata)) {
			const groupsMetadata = getGroupsMetadata(metadata.metatype);

			const groups = Object.entries(value).reduce((groups, [key, v]) => {
				const keyGroups =
					<string[] | undefined>(
						groupsMetadata[key]?.map((meta) =>
							meta.predicate(v, key, value)
								? meta.groups
								: meta.inverseGroups,
						)
					) ?? [];
				return groups.concat(...keyGroups);
			}, [] as string[]);

			if (fakeThis["transformOptions"] != null) {
				fakeThis["transformOptions"] = {
					...fakeThis["transformOptions"],
				};
				fakeThis["transformOptions"].groups = [
					...(fakeThis["transformOptions"].groups ?? []),
					...groups,
				];
			}
			if (fakeThis["validatorOptions"] != null) {
				fakeThis["validatorOptions"] = {
					...fakeThis["validatorOptions"],
				};
				fakeThis["validatorOptions"].always = true;
				fakeThis["validatorOptions"].strictGroups = true;
				fakeThis["validatorOptions"].groups = [
					...(fakeThis["validatorOptions"].groups ?? []),
					...groups,
				];
			}
		}

		return await ValidationPipe.prototype.transform.call(
			fakeThis,
			value,
			metadata,
		);
	}
}
