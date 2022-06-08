import { GROUPS_METADATA } from "../constants";

export type GroupsMetadata = { [key: string | symbol]: GroupsKeyMetadata[] };
export interface GroupsKeyMetadata {
	groups: string | string[];
	predicate: PredicateFn;
	inverseGroups: string | string[];
}

export type PredicateFn = (...args: any[]) => boolean;

export interface UseGroupsIfOptions {
	groups: string | string[];
	predicate: PredicateFn;
	inverseGroups?: string | string[];
}

export function UseGroupsIf(
	groups: string | string[],
	predicate: PredicateFn,
	inverseGroups?: string | string[],
): PropertyDecorator {
	const options: GroupsKeyMetadata = {
		groups,
		predicate,
		inverseGroups: inverseGroups as any,
	};
	if (typeof options.groups === "string") {
		options.groups = [options.groups];
	}

	if (typeof options.inverseGroups === "string") {
		options.inverseGroups = [options.inverseGroups];
	} else if (options.inverseGroups == null) {
		options.inverseGroups = options.groups.map((group) => `!${group}`);
	} else if (
		Array.isArray(options.inverseGroups) &&
		options.inverseGroups.length !== options.groups.length
	) {
		options.inverseGroups.concat(
			...options.groups.map((group) => `!${group}`),
		);
	}

	return function (target: Object, propertyKey: string | symbol) {
		const metadata = getGroupsMetadata(target.constructor);
		const propertyMetadata = (metadata[propertyKey] =
			metadata[propertyKey] ?? []);
		propertyMetadata.push(options);
		Reflect.defineMetadata(GROUPS_METADATA, metadata, target.constructor);
	};
}

export function getGroupsMetadata(target: Object): GroupsMetadata {
	return Reflect.getMetadata(GROUPS_METADATA, target) ?? {};
}
