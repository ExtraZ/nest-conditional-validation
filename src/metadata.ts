import { GROUPS_METADATA } from "./constants";
import { GroupsMetadata } from "./types";

export function getGroupsMetadata(target: Object): GroupsMetadata {
	return Reflect.getMetadata(GROUPS_METADATA, target) ?? {};
}
