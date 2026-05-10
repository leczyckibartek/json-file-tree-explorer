import type { FileNode, FolderNode, TreeNodeData } from "./types"

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
}

function formatPathForError(pathSegments: string[]): string {
	if (pathSegments.length === 0) {
		return "root"
	}
	return pathSegments.join(" / ")
}

function nameSlashError(
	label: "File" | "Folder",
	name: string,
	pathSegments: string[],
): string | null {
	if (!name.includes("/")) {
		return null
	}
	return `${label} name "${name}" at "${formatPathForError(pathSegments)}" must not contain "/".`
}

function validateFileNode(
	value: unknown,
	pathSegments: string[],
): FileNode | string {
	if (!isPlainObject(value)) {
		return `Node "${formatPathForError(pathSegments)}" must be a JSON object.`
	}
	if (value.type !== "file") {
		return `Node "${formatPathForError(pathSegments)}" has an unsupported type (expected type: "file").`
	}
	if (typeof value.name !== "string" || value.name.length === 0) {
		return `File at "${formatPathForError(pathSegments)}" must have a non-empty name (string).`
	}
	const fileSlashErr = nameSlashError("File", value.name, pathSegments)
	if (fileSlashErr) {
		return fileSlashErr
	}
	if (typeof value.size !== "number" || !Number.isFinite(value.size)) {
		return `File "${value.name}" at "${formatPathForError(pathSegments)}" must have a finite numeric size.`
	}
	return {
		name: value.name,
		type: "file",
		size: value.size,
	}
}

function validateFolderNode(
	value: unknown,
	pathSegments: string[],
): FolderNode | string {
	if (!isPlainObject(value)) {
		return `Node "${formatPathForError(pathSegments)}" must be a JSON object.`
	}
	if (value.type !== "folder") {
		return `Node "${formatPathForError(pathSegments)}" has an unsupported type (expected type: "folder").`
	}
	if (typeof value.name !== "string" || value.name.length === 0) {
		return `Folder at "${formatPathForError(pathSegments)}" must have a non-empty name (string).`
	}
	const folderSlashErr = nameSlashError("Folder", value.name, pathSegments)
	if (folderSlashErr) {
		return folderSlashErr
	}
	if (!Array.isArray(value.children)) {
		return `Folder "${value.name}" at "${formatPathForError(pathSegments)}" must have a children array.`
	}

	const validatedChildren: TreeNodeData[] = []
	const siblingNames = new Set<string>()
	let index = 0
	for (const childValue of value.children) {
		const childPath = [...pathSegments, `${value.name}[${index}]`]
		const childOutcome = validateTreeNodeData(childValue, childPath)
		if (typeof childOutcome === "string") {
			return childOutcome
		}
		if (siblingNames.has(childOutcome.name)) {
			return `Folder "${value.name}" at "${formatPathForError(pathSegments)}" has duplicate child name "${childOutcome.name}". Sibling names must be unique.`
		}
		siblingNames.add(childOutcome.name)
		validatedChildren.push(childOutcome)
		index += 1
	}

	return {
		name: value.name,
		type: "folder",
		children: validatedChildren,
	}
}

function validateTreeNodeData(
	value: unknown,
	pathSegments: string[],
): TreeNodeData | string {
	if (!isPlainObject(value)) {
		return `Node "${formatPathForError(pathSegments)}" must be a JSON object.`
	}
	if (value.type === "file") {
		return validateFileNode(value, pathSegments)
	}
	if (value.type === "folder") {
		return validateFolderNode(value, pathSegments)
	}
	return `Node "${formatPathForError(pathSegments)}" must have type "file" or "folder".`
}

export function parseDirectoryTreeJsonText(jsonText: string): FolderNode | string {
	const trimmedText = jsonText.trim()
	if (trimmedText.length === 0) {
		return "Paste or upload non-empty JSON."
	}

	let parsedJson: unknown
	try {
		parsedJson = JSON.parse(trimmedText) as unknown
	}
	catch {
		return "Could not parse JSON (invalid syntax)."
	}

	const rootOutcome = validateFolderNode(parsedJson, [])
	if (typeof rootOutcome === "string") {
		return `Document root: ${rootOutcome}`
	}
	return rootOutcome
}
