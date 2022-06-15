export type PredicateFn = (value: any, key: string, object: any) => boolean;
export type GroupsMetadata = { [key: string | symbol]: GroupsKeyMetadata[] };
export interface GroupsKeyMetadata {
	groups: string | string[];
	predicate: PredicateFn;
	inverseGroups: string | string[];
}
